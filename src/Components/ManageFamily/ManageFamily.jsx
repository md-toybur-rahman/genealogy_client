import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch, readTree } from '../../config/api';

function nodeLabel(root, path) {
	let node = root;
	const names = [root?.name].filter(Boolean);
	for (const index of path || []) {
		node = node?.children?.[index];
		if (!node) return 'Tree-তে পাওয়া যায়নি';
		names.push(node.name);
	}
	return names.join(' → ');
}

function deletableMembers(root) {
	const members = [];
	function visit(node, path = [], ancestors = []) {
		if (!node || !Array.isArray(node.children)) return;
		const lineage = [...ancestors, node.name];
		if (path.length) members.push({ path, name: node.name, label: lineage.join(' → ') });
		node.children.forEach((child, index) => visit(child, [...path, index], lineage));
	}
	visit(root);
	return members;
}

const ManageFamily = () => {
	const { user, profile } = useContext(AuthContext);
	const [requests, setRequests] = useState([]);
	const [users, setUsers] = useState([]);
	const [trees, setTrees] = useState({ english: null, bangla: null });
	const [tab, setTab] = useState('requests');
	const [loading, setLoading] = useState(true);
	const [busyId, setBusyId] = useState('');
	const [error, setError] = useState('');
	const [englishMember, setEnglishMember] = useState('');
	const [banglaMember, setBanglaMember] = useState('');
	const [deleting, setDeleting] = useState(false);
	const canDeleteMembers = profile?.email?.toLowerCase() === 'toyburrahman48@gmail.com';
	const englishMembers = deletableMembers(trees.english);
	const banglaMembers = deletableMembers(trees.bangla);

	const loadData = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const [pending, allUsers, englishTree, banglaTree] = await Promise.all([
				apiFetch(user, '/admin/requests'), apiFetch(user, '/admin/users'), readTree(user, 'english'), readTree(user, 'bangla'),
			]);
			setRequests(pending);
			setUsers(allUsers);
			setTrees({ english: englishTree, bangla: banglaTree });
		} catch (loadError) {
			setError(loadError.message || 'Admin data load করা যায়নি।');
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => { loadData(); }, [loadData]);

	const reviewRequest = async (requestId, decision) => {
		setBusyId(requestId);
		setError('');
		try {
			await apiFetch(user, `/admin/requests/${requestId}`, { method: 'PATCH', body: JSON.stringify({ decision }) });
			setRequests(previous => previous.filter(request => request._id !== requestId));
		} catch (reviewError) {
			setError(reviewError.message || 'Request update করা যায়নি।');
			await loadData();
		} finally {
			setBusyId('');
		}
	};

	const changeRole = async (person, userType) => {
		setBusyId(person._id);
		setError('');
		try {
			await apiFetch(user, `/admin/users/${person._id}/role`, { method: 'PATCH', body: JSON.stringify({ user_type: userType }) });
			setUsers(previous => previous.map(item => item._id === person._id ? { ...item, user_type: userType } : item));
		} catch (roleError) {
			setError(roleError.message || 'Role update করা যায়নি।');
		} finally {
			setBusyId('');
		}
	};

	const deleteMember = async event => {
		event.preventDefault();
		const english = englishMembers.find(item => JSON.stringify(item.path) === englishMember);
		const bangla = banglaMembers.find(item => JSON.stringify(item.path) === banglaMember);
		if (!english || !bangla) return setError('দুই tree-তেই member নির্বাচন করুন।');
		if (!window.confirm(`নিশ্চিতভাবে delete করবেন?\nEnglish: ${english.label}\nবাংলা: ${bangla.label}\nএই member-এর নিচের সব সন্তানও tree থেকে মুছে যাবে।`)) return;
		setDeleting(true);
		setError('');
		try {
			await apiFetch(user, '/admin/family-member', {
				method: 'DELETE',
				body: JSON.stringify({ englishPath: english.path, banglaPath: bangla.path, englishName: english.name, banglaName: bangla.name }),
			});
			setEnglishMember('');
			setBanglaMember('');
			await loadData();
		} catch (deleteError) {
			setError(deleteError.message || 'Member delete করা যায়নি।');
		} finally {
			setDeleting(false);
		}
	};

	return (
		<main className="bg_dark min-h-screen px-5 pt-28 pb-12">
			<section className="max-w-6xl mx-auto">
				<h1 className="text-2xl md:text-3xl text-center text-glow">Admin dashboard</h1>
				<p className="text-center opacity-80 mt-2">Signed in as {profile?.name}</p>
				<div className="flex justify-center gap-3 mt-8">
					<button onClick={() => setTab('requests')} className={`border border-teal-500 rounded-lg px-4 py-2 ${tab === 'requests' ? 'bg-teal-500/20' : ''}`}>Requests ({requests.length})</button>
					<button onClick={() => setTab('users')} className={`border border-teal-500 rounded-lg px-4 py-2 ${tab === 'users' ? 'bg-teal-500/20' : ''}`}>Users & roles</button>
					{canDeleteMembers && <button onClick={() => setTab('delete')} className={`border border-rose-400 rounded-lg px-4 py-2 ${tab === 'delete' ? 'bg-rose-500/20' : ''}`}>Delete family member</button>}
					<button onClick={loadData} className="border border-teal-500 rounded-lg px-4 py-2">Refresh</button>
				</div>
				{error && <p role="alert" className="text-rose-300 text-center mt-5">{error}</p>}
				{loading ? <p className="text-center mt-10">Loading…</p> : tab === 'delete' && canDeleteMembers ? (
					<form onSubmit={deleteMember} className="div-glow rounded-xl p-6 max-w-2xl mx-auto mt-8 space-y-5">
						<h2 className="text-xl">ভুল করে tree-তে যোগ হওয়া member মুছুন</h2>
						<p className="text-sm opacity-80">English ও বাংলা tree-তে একই ব্যক্তির সঠিক অবস্থান বেছে নিন। নির্বাচিত member-এর নিচের branch-ও মুছে যাবে। এই কাজ undo করা যাবে না।</p>
						<label className="block">English tree<select required value={englishMember} onChange={event => setEnglishMember(event.target.value)} className="mt-2 w-full border border-teal-500 bg-slate-900 rounded-lg px-3 py-3"><option value="">Member নির্বাচন করুন</option>{englishMembers.map(person => <option key={person.path.join('.')} value={JSON.stringify(person.path)}>{person.label}</option>)}</select></label>
						<label className="block">বাংলা tree<select required value={banglaMember} onChange={event => setBanglaMember(event.target.value)} className="mt-2 w-full border border-teal-500 bg-slate-900 rounded-lg px-3 py-3"><option value="">সদস্য নির্বাচন করুন</option>{banglaMembers.map(person => <option key={person.path.join('.')} value={JSON.stringify(person.path)}>{person.label}</option>)}</select></label>
						<button disabled={deleting || !englishMembers.length || !banglaMembers.length} className="border border-rose-400 text-rose-200 rounded-lg px-5 py-2 disabled:opacity-50">{deleting ? 'মুছছে…' : 'দুই tree থেকে member delete করুন'}</button>
					</form>
				) : tab === 'requests' ? (
					<div className="grid md:grid-cols-2 gap-5 mt-8">
						{requests.length === 0 && <p className="text-center opacity-80 md:col-span-2">কোনো pending request নেই।</p>}
						{requests.map(request => <article key={request._id} className="div-glow rounded-xl p-5">
							<p className="text-sm opacity-70">{request.type === 'member_add' ? 'Member addition' : `${request.field === 'fathers_name' ? 'Father’s name correction' : 'Name correction'} (${request.language})`}</p>
							<h2 className="text-xl mt-2">{request.type === 'member_add' ? `${request.englishName} / ${request.banglaName}` : `${request.expectedName} → ${request.proposedName}`}</h2>
							{request.photoURL && <img src={request.photoURL} alt={`${request.englishName} profile preview`} className="mt-3 w-24 h-24 object-cover rounded-full border border-teal-500" />}
							{request.type === 'member_add' ? <div className="mt-3 text-sm opacity-80">
								<p>English parent: {nodeLabel(trees.english, request.parentEnglishPath)}</p>
								<p>বাংলা parent: {nodeLabel(trees.bangla, request.parentBanglaPath)}</p>
							</div> : <p className="mt-3 text-sm opacity-80">Tree: {request.language === 'english' ? 'English' : 'বাংলা'} · {nodeLabel(trees[request.language], request.targetPath)}</p>}
							<p className="mt-3 text-sm">Request করেছেন: {request.submitterName} · {new Date(request.createdAt).toLocaleString()}</p>
							<div className="flex gap-3 justify-end mt-5">
								<button disabled={busyId === request._id} onClick={() => reviewRequest(request._id, 'rejected')} className="border border-rose-400 rounded-lg px-4 py-2 disabled:opacity-50">Reject</button>
								<button disabled={busyId === request._id} onClick={() => reviewRequest(request._id, 'approved')} className="border border-teal-500 rounded-lg px-4 py-2 disabled:opacity-50">{busyId === request._id ? 'Saving…' : 'Approve'}</button>
							</div>
						</article>)}
					</div>
				) : (
					<div className="overflow-x-auto mt-8">
						<table className="w-full min-w-[700px] border-collapse">
							<thead><tr className="border-b border-teal-500 text-left"><th className="p-3">Member</th><th className="p-3">Father&apos;s name</th><th className="p-3">Phone</th><th className="p-3">Role</th><th className="p-3">Change role</th></tr></thead>
							<tbody>{users.map(person => <tr key={person._id} className="border-b border-teal-500/30">
								<td className="p-3 flex items-center gap-3">{person.photoURL && <img src={person.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />}<span>{person.name}<br />{person.bangla_name}</span></td>
								<td className="p-3">{person.fathers_name}</td>
								<td className="p-3">{person.phone_number} ({person.phone_visibility})</td>
								<td className="p-3">{person.user_type}</td>
								<td className="p-3"><button disabled={busyId === person._id || (person._id === profile?._id && person.user_type === 'admin')} onClick={() => changeRole(person, person.user_type === 'admin' ? 'user' : 'admin')} className="border border-teal-500 rounded-lg px-3 py-2 disabled:opacity-50">{busyId === person._id ? 'Saving…' : person.user_type === 'admin' ? 'Make user' : 'Make admin'}</button></td>
							</tr>)}</tbody>
						</table>
					</div>
				)}
			</section>
		</main>
	);
};

export default ManageFamily;
