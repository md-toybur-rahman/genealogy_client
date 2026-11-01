import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const readFileAsDataUrl = file => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => resolve(reader.result);
	reader.onerror = () => reject(new Error('ছবি পড়া যায়নি।'));
	reader.readAsDataURL(file);
});

const isImgbbUrl = value => {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && ['i.ibb.co', 'ibb.co'].includes(url.hostname);
	} catch {
		return false;
	}
};

const EditProfile = () => {
	const { user, profile, profileLoading, profileError, refreshProfile } = useContext(AuthContext);
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', bangla_name: '', fathers_name: '', phone_number: '', phone_visibility: 'private' });
	const [photoURL, setPhotoURL] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!profile) return;
		setForm({
			name: profile.name || '', bangla_name: profile.bangla_name || '', fathers_name: profile.fathers_name || '',
			phone_number: profile.phone_number || '', phone_visibility: profile.phone_visibility || 'private',
		});
		setPhotoURL(isImgbbUrl(profile.photoURL) ? profile.photoURL : '');
	}, [profile]);

	const updateField = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
	const handleImage = event => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 6 * 1024 * 1024) {
			setError('PNG, JPG অথবা WebP ছবি ৬ MB-এর মধ্যে দিন।');
			return;
		}
		setError('');
		setImageFile(file);
		setPhotoURL(URL.createObjectURL(file));
	};

	const handleSubmit = async event => {
		event.preventDefault();
		setSaving(true);
		setError('');
		try {
			let savedPhotoURL = isImgbbUrl(profile?.photoURL) ? profile.photoURL : '';
			if (imageFile) {
				const image = await readFileAsDataUrl(imageFile);
				const upload = await apiFetch(user, '/images/profile', { method: 'POST', body: JSON.stringify({ image }) });
				savedPhotoURL = upload.photoURL;
			}
			await apiFetch(user, '/users/me', {
				method: 'PUT',
				body: JSON.stringify({ ...form, photoURL: savedPhotoURL }),
			});
			await refreshProfile();
			navigate('/');
		} catch (saveError) {
			setError(saveError.message || 'Profile সংরক্ষণ করা যায়নি।');
		} finally {
			setSaving(false);
		}
	};

	if (profileLoading) return <div className="bg_dark min-h-screen flex items-center justify-center">Profile লোড হচ্ছে…</div>;

	return (
		<main className="bg_dark min-h-screen px-5 pt-24 pb-12 flex justify-center">
			<section className="border border-teal-500 shadow-md shadow-teal-500 rounded-2xl p-6 w-full max-w-xl h-fit">
				<h1 className="text-2xl md:text-3xl font-bold text-center">{profile?.profile_complete ? 'Edit your profile' : 'Complete your profile'}</h1>
				<p className="text-center opacity-80 mt-2">সিস্টেম ব্যবহার করতে নিজের তথ্যগুলো পূরণ করুন।</p>
				{profileError && <p role="alert" className="text-rose-300 mt-4">{profileError}</p>}
				<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
					<label className="flex flex-col gap-2">English name<input required maxLength={120} name="name" value={form.name} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-2" /></label>
					<label className="flex flex-col gap-2">বাংলা নাম<input required maxLength={120} name="bangla_name" value={form.bangla_name} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-2" /></label>
					<label className="flex flex-col gap-2">Father&apos;s name<input required maxLength={120} name="fathers_name" value={form.fathers_name} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-2" /></label>
					<label className="flex flex-col gap-2">Mobile number<input required maxLength={30} name="phone_number" value={form.phone_number} onChange={updateField} className="border border-teal-500 bg-transparent rounded-md px-3 py-2" /></label>
					<label className="flex flex-col gap-2">মোবাইল নম্বর কে দেখতে পারবে?
						<select name="phone_visibility" value={form.phone_visibility} onChange={updateField} className="border border-teal-500 bg-[#01001a] rounded-md px-3 py-2">
							<option value="private">Private — শুধু আমি ও admin</option>
							<option value="public">Public — সকল signed-in user</option>
						</select>
					</label>
					<label className="flex flex-col gap-2">Profile photo (Imgbb)
						<input required={!isImgbbUrl(profile?.photoURL)} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className="border border-teal-500 rounded-md px-3 py-2" />
					</label>
					{photoURL && <img src={photoURL} alt="Profile preview" className="w-24 h-24 object-cover rounded-full border border-teal-500" />}
					{error && <p role="alert" className="text-rose-300">{error}</p>}
					<div className="flex justify-end gap-3">
						{profile?.profile_complete && <button type="button" onClick={() => navigate('/')} className="border border-teal-500 rounded-lg px-5 py-2">Cancel</button>}
						<button disabled={saving} className="border border-teal-500 rounded-lg px-5 py-2 disabled:opacity-50">{saving ? 'Saving…' : 'Save profile'}</button>
					</div>
				</form>
			</section>
		</main>
	);
};

export default EditProfile;
