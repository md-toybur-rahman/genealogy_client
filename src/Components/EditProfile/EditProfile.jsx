import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
	const { user, profile, profileLoading, profileError, refreshProfile } = useContext(AuthContext);
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', fathers_name: '', phone_number: '' });
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!profile) return;
		setForm({
			name: profile.profile_complete ? (profile.name || profile.bangla_name || '') : '',
			fathers_name: profile.profile_complete ? (profile.fathers_name || '') : '',
			phone_number: profile.profile_complete ? (profile.phone_number || '') : '',
		});
	}, [profile]);

	const updateField = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));

	const handleSubmit = async event => {
		event.preventDefault();
		setSaving(true);
		setError('');
		try {
			await apiFetch(user, '/users/me', {
				method: 'PUT',
				body: JSON.stringify({ name: form.name.trim(), fathers_name: form.fathers_name.trim(), phone_number: form.phone_number.trim() }),
			});
			await refreshProfile();
			navigate('/');
		} catch (saveError) {
			setError(saveError.message || 'তথ্য সংরক্ষণ করা যায়নি।');
		} finally {
			setSaving(false);
		}
	};

	if (profileLoading) return <div className="bg_dark min-h-screen flex items-center justify-center">Profile লোড হচ্ছে…</div>;

	return (
		<main className="bg_dark min-h-screen px-4 sm:px-5 pt-24 pb-10 sm:pb-12 flex justify-center">
			<section className="border border-teal-500 shadow-md shadow-teal-500 rounded-2xl p-4 sm:p-6 w-full max-w-xl h-fit">
				<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center break-words">{profile?.profile_complete ? 'তথ্য পরিবর্তন করুন' : 'তথ্য দিন'}</h1>
				<p className="text-center opacity-80 mt-2">শুধু নিজের নাম, বাবার নাম ও মোবাইল নম্বর দিন।</p>
				{profileError && <p role="alert" className="text-rose-300 mt-4">{profileError}</p>}
				<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
					<label className="flex flex-col gap-2">আপনার নাম<input required maxLength={120} name="name" value={form.name} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-3" /></label>
					<label className="flex flex-col gap-2">বাবার নাম<input required maxLength={120} name="fathers_name" value={form.fathers_name} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-3" /></label>
					<label className="flex flex-col gap-2">মোবাইল নম্বর<input required maxLength={30} name="phone_number" value={form.phone_number} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-3" /></label>
					{error && <p role="alert" className="text-rose-300">{error}</p>}
					<div className="flex justify-end gap-3">
						{profile?.profile_complete && <button type="button" onClick={() => navigate('/')} className="border border-teal-500 rounded-lg px-5 py-2 min-h-11">বাতিল</button>}
						<button disabled={saving} className="border border-teal-500 rounded-lg px-5 py-2 min-h-11 disabled:opacity-50">{saving ? 'সংরক্ষণ হচ্ছে…' : 'তথ্য সংরক্ষণ করুন'}</button>
					</div>
				</form>
			</section>
		</main>
	);
};

export default EditProfile;
