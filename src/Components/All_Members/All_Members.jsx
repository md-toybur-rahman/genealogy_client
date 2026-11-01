import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch } from '../../config/api';

const All_Members = () => {
	const { user, lan } = useContext(AuthContext);
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		apiFetch(user, '/users')
			.then(setMembers)
			.catch(loadError => setError(loadError.message || 'সদস্য তালিকা load করা যায়নি।'))
			.finally(() => setLoading(false));
	}, [user]);

	return (
		<main className={`${lan ? 'bangla_font' : 'english_font'} bg_dark min-h-screen w-full px-5 md:px-10 pt-28 pb-12`}>
			<h1 className="text-2xl lg:text-3xl text-center text-glow">{lan ? 'সদস্যগণ' : 'Family members'}</h1>
			{loading && <p className="text-center mt-8">Loading…</p>}
			{error && <p role="alert" className="text-center text-rose-300 mt-8">{error}</p>}
			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
				{members.map(person => <article key={person._id} className="div-glow rounded-xl p-5 flex gap-4 items-start">
					{person.photoURL && <img className="w-20 h-20 rounded-full object-cover" src={person.photoURL} alt={person.name} />}
					<div className="min-w-0">
						<h2 className="text-lg font-semibold">{lan ? person.bangla_name || person.name : person.name}</h2>
						<p className="opacity-80 mt-1">{lan ? 'বাবার নাম' : "Father's name"}: {person.fathers_name}</p>
						<p className="opacity-80 mt-1">{lan ? 'মোবাইল' : 'Mobile'}: {person.phone_number || (lan ? 'ব্যক্তিগত' : 'Private')}</p>
					</div>
				</article>)}
			</div>
		</main>
	);
};

export default All_Members;
