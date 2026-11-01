import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch, flattenParents, readTree } from '../../config/api';

const RequestMember = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [parents, setParents] = useState({ english: [], bangla: [] });
	const [parentEnglishPath, setParentEnglishPath] = useState('');
	const [parentBanglaPath, setParentBanglaPath] = useState('');
	const [englishName, setEnglishName] = useState('');
	const [banglaName, setBanglaName] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		Promise.all([readTree(user, 'english'), readTree(user, 'bangla')])
			.then(([englishTree, banglaTree]) => setParents({ english: flattenParents(englishTree), bangla: flattenParents(banglaTree) }))
			.catch(loadError => setError(loadError.message || 'Family tree load করা যায়নি।'))
			.finally(() => setLoading(false));
	}, [user]);

	const handleSubmit = async event => {
		event.preventDefault();
		setSaving(true);
		setError('');
		setSuccess('');
		try {
			await apiFetch(user, '/requests', {
				method: 'POST',
				body: JSON.stringify({
					type: 'member_add', englishName: englishName.trim(), banglaName: banglaName.trim(),
					parentEnglishPath: JSON.parse(parentEnglishPath), parentBanglaPath: JSON.parse(parentBanglaPath),
				}),
			});
			setEnglishName('');
			setBanglaName('');
			setSuccess('আপনার request admin-এর কাছে পাঠানো হয়েছে। Approve হলে tree-তে দেখা যাবে।');
		} catch (requestError) {
			setError(requestError.message || 'Request পাঠানো যায়নি।');
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className="bg_dark min-h-screen px-5 pt-28 pb-12">
			<section className="max-w-3xl mx-auto">
				<button type="button" onClick={() => navigate('/')} className="mb-6 border border-teal-500 rounded-lg px-4 py-2">← Family tree</button>
				<h1 className="text-2xl md:text-3xl text-center text-glow">Request to add a family member</h1>
				<p className="text-center opacity-80 mt-2">Admin approve করলে member দুই ভাষার tree-তে যোগ হবে।</p>
				{loading ? <p className="text-center mt-10">Family tree লোড হচ্ছে…</p> : (
					<form onSubmit={handleSubmit} className="mt-8 space-y-5 div-glow rounded-xl p-5 md:p-8">
						<label className="block"><span className="block mb-2">English name</span><input required maxLength={120} value={englishName} onChange={event => setEnglishName(event.target.value)} className="w-full bg-transparent border border-teal-500 rounded-lg px-3 py-2" /></label>
						<label className="block"><span className="block mb-2">বাংলা নাম</span><input required maxLength={120} value={banglaName} onChange={event => setBanglaName(event.target.value)} className="w-full bg-transparent border border-teal-500 rounded-lg px-3 py-2" /></label>
						<label className="block"><span className="block mb-2">English tree-তে বাবা/মা</span>
							<select required value={parentEnglishPath} onChange={event => setParentEnglishPath(event.target.value)} className="w-full bg-[#01001a] border border-teal-500 rounded-lg px-3 py-2"><option value="">Choose a parent</option>{parents.english.map(parent => <option key={JSON.stringify(parent.path)} value={JSON.stringify(parent.path)}>{parent.label}</option>)}</select>
						</label>
						<label className="block"><span className="block mb-2">বাংলা tree-তে বাবা/মা</span>
							<select required value={parentBanglaPath} onChange={event => setParentBanglaPath(event.target.value)} className="w-full bg-[#01001a] border border-teal-500 rounded-lg px-3 py-2"><option value="">বাবা/মা নির্বাচন করুন</option>{parents.bangla.map(parent => <option key={JSON.stringify(parent.path)} value={JSON.stringify(parent.path)}>{parent.label}</option>)}</select>
						</label>
						{error && <p role="alert" className="text-rose-300">{error}</p>}
						{success && <p role="status" className="text-teal-300">{success}</p>}
						<div className="flex justify-end"><button disabled={saving} className="border border-teal-500 rounded-lg px-6 py-2 disabled:opacity-50">{saving ? 'Sending…' : 'Send request'}</button></div>
					</form>
				)}
			</section>
		</main>
	);
};

export default RequestMember;
