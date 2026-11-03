import { useContext, useEffect, useState } from 'react';
import { FaRegImage } from 'react-icons/fa';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch, readTree } from '../../config/api';

function flattenFamily(root, profiles) {
	const members = [];
	function visit(node, fatherName = '') {
		if (!node) return;
		const profile = profiles.find(person => person.family_member_id && person.family_member_id === node.familyMemberId);
		members.push({ name: node.name, fatherName, photoURL: profile?.photoURL || node.photoURL || '' });
		(node.children || []).forEach(child => visit(child, node.name));
	}
	visit(root);
	return members.sort((first, second) => Number(Boolean(second.photoURL)) - Number(Boolean(first.photoURL)));
}

const FamilyPhotos = () => {
	const { user, lan } = useContext(AuthContext);
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;
		setLoading(true);
		setError('');
		Promise.all([readTree(user, lan ? 'bangla' : 'english'), apiFetch(user, '/users')])
			.then(([tree, profiles]) => {
				if (active) setMembers(flattenFamily(tree, profiles));
			})
			.catch(loadError => {
				if (active) setError(loadError.message || 'Family photos load করা যায়নি।');
			})
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [user, lan]);

	return (
		<main className={`${lan ? 'bangla_font' : 'english_font'} bg_dark min-h-screen w-full px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-10 sm:pb-12`}>
			<section className="max-w-7xl mx-auto">
				<h1 className="text-2xl sm:text-3xl text-center text-glow">{lan ? 'পারিবারিক ছবি' : 'Family Photo'}</h1>
				<p className="text-center opacity-75 mt-2">{lan ? 'ছমর উদ্দিন থেকে শুরু করে পরিবারের সকল সদস্য' : 'Every family member, starting from Chomor Uddin'}</p>
				{!loading && !error && <p className="text-center text-teal-200 mt-3">{lan ? `পরিবারের মোট সদস্য: ${members.length} জন` : `Total family members: ${members.length}`}</p>}
				{loading && <p className="text-center mt-10">{lan ? 'ছবি load হচ্ছে…' : 'Loading photos…'}</p>}
				{error && <p role="alert" className="text-center text-rose-300 mt-8 break-words">{error}</p>}
				{!loading && !error && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 mt-7 sm:mt-10">
					{members.map((member, index) => <article key={`${index}-${member.name}`} className="min-w-0 overflow-hidden rounded-xl border border-teal-500/60 bg-slate-950/40 shadow-md shadow-teal-900/20">
						<div className="aspect-square w-full bg-slate-900/70 flex items-center justify-center overflow-hidden">
							{member.photoURL ? <img src={member.photoURL} alt={member.name} loading="lazy" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-2 px-2 text-center text-teal-200/60"><FaRegImage className="text-3xl" /><span className="text-xs sm:text-sm">{lan ? 'ছবি নেই' : 'No photo'}</span></div>}
						</div>
						<div className="px-2.5 sm:px-3 py-2.5 sm:py-3 text-center">
							<h2 className="text-sm sm:text-base font-medium leading-snug break-words">{member.name}</h2>
							<p className="mt-1 text-xs sm:text-sm leading-snug opacity-75 break-words">{lan ? `বাবার নাম: ${member.fatherName || 'উল্লেখ নেই'}` : `Father: ${member.fatherName || 'Not listed'}`}</p>
						</div>
					</article>)}
				</div>}
			</section>
		</main>
	);
};

export default FamilyPhotos;
