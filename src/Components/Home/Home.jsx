import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Genealogy from '../Genealogy/Genealogy';
import { MdComment } from "react-icons/md";
import { DNA } from 'react-loader-spinner';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch, readTree } from '../../config/api';

const readFileAsDataUrl = file => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => resolve(reader.result);
	reader.onerror = () => reject(new Error('ছবি পড়া যায়নি।'));
	reader.readAsDataURL(file);
});
import { FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';

const normalizeSearch = value => value?.trim().toLocaleLowerCase();

function findTreeMatches(root, query) {
	const matches = [];
	const needle = normalizeSearch(query);
	if (!root || !needle) return matches;
	function visit(node, path = [], ancestors = []) {
		if (!node || typeof node.name !== 'string' || !Array.isArray(node.children)) return;
		const lineage = [...ancestors, node.name];
		if (normalizeSearch(node.name).includes(needle)) matches.push({ name: node.name, path, label: lineage.join(' → ') });
		node.children.forEach((child, index) => visit(child, [...path, index], lineage));
	}
	visit(root);
	return matches.slice(0, 10);
}

const Home = () => {
	const { user, userDetectedLoading, lan } = useContext(AuthContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [genealogy, setGenealogy] = useState({});
	const [banglaGenealogy, setBanglaGenealogy] = useState({});
	const [members, setMembers] = useState([]);
	const [treeError, setTreeError] = useState('');
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [photoRequest, setPhotoRequest] = useState(null);
	const [photoFile, setPhotoFile] = useState(null);
	const [photoPreview, setPhotoPreview] = useState('');
	const [photoRequestError, setPhotoRequestError] = useState('');
	const [photoRequestSent, setPhotoRequestSent] = useState(false);
	const [sendingPhotoRequest, setSendingPhotoRequest] = useState(false);
	const [correction, setCorrection] = useState(null);
	const [correctionField, setCorrectionField] = useState('name');
	const [proposedName, setProposedName] = useState('');
	const [correctionError, setCorrectionError] = useState('');
	const [correctionSent, setCorrectionSent] = useState(false);
	const [sendingCorrection, setSendingCorrection] = useState(false);
	const [treeSearch, setTreeSearch] = useState('');
	const [selectedTreePath, setSelectedTreePath] = useState(null);
	const [expandedPaths, setExpandedPaths] = useState([]);
	const activeTree = lan ? banglaGenealogy : genealogy;
	const searchResults = treeSearch.trim() ? findTreeMatches(activeTree, treeSearch) : [];
	useEffect(() => {
		let active = true;
		setLoading(true);
		setTreeError('');
		Promise.all([readTree(user, 'english'), readTree(user, 'bangla'), apiFetch(user, '/users')])
			.then(([englishTree, banglaTree, people]) => {
				if (!active) return;
				setGenealogy(englishTree);
				setBanglaGenealogy(banglaTree);
				setMembers(people);
			})
			.catch(error => {
				if (active) setTreeError(error.message || 'Family tree could not be loaded.');
			})
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [user]);

	useEffect(() => {
		if (!selectedTreePath) return undefined;
		const frame = requestAnimationFrame(() => {
			document.querySelector(`[data-genealogy-path="${selectedTreePath.join('.')}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		});
		return () => cancelAnimationFrame(frame);
	}, [selectedTreePath, lan, loading]);

	useEffect(() => {
		setTreeSearch('');
		setSelectedTreePath(null);
		setExpandedPaths([]);
	}, [lan]);

	const openCorrection = request => {
		setCorrection(request);
		setCorrectionField('name');
		setProposedName(request.currentName);
		setCorrectionError('');
		setCorrectionSent(false);
	};

	const openPhotoRequest = request => {
		setPhotoRequest(request);
		setPhotoFile(null);
		setPhotoPreview('');
		setPhotoRequestError('');
		setPhotoRequestSent(false);
	};

	const handlePhotoRequestSubmit = async event => {
		event.preventDefault();
		if (!photoFile) return setPhotoRequestError('আগে একটি ছবি নির্বাচন করুন।');
		setSendingPhotoRequest(true);
		setPhotoRequestError('');
		try {
			const image = await readFileAsDataUrl(photoFile);
			const { photoURL } = await apiFetch(user, '/images/profile', { method: 'POST', body: JSON.stringify({ image }) });
			await apiFetch(user, '/requests', {
				method: 'POST', body: JSON.stringify({
					type: photoRequest.type || 'photo_add', language: photoRequest.language, targetPath: photoRequest.targetPath,
					familyMemberId: photoRequest.familyMemberId, photoURL, expectedPhotoURL: photoRequest.expectedPhotoURL || '',
				})
			});
			setPhotoRequestSent(true);
			Swal.fire({
				position: "center",
				icon: "success",
				title: "Request admin-এর কাছে পাঠানো হয়েছে।",
				theme: 'dark',
				showConfirmButton: false,
				timer: 1500
			});
		} catch (error) {
			setPhotoRequestError(error.message || 'ছবির request পাঠানো যায়নি।');
		} finally {
			setSendingPhotoRequest(false);
		}
	};

	const openSearchResult = result => {
		const ancestorsAndTarget = Array.from({ length: result.path.length + 1 }, (_, index) => result.path.slice(0, index));
		setExpandedPaths(ancestorsAndTarget);
		setSelectedTreePath(result.path);
		setTreeSearch(result.name);
	};

	const handleCorrectionSubmit = async event => {
		event.preventDefault();
		setSendingCorrection(true);
		setCorrectionError('');
		try {
			await apiFetch(user, '/requests', {
				method: 'POST',
				body: JSON.stringify({
					type: 'name_correction', language: correction.language,
					targetPath: correctionField === 'fathers_name' ? correction.targetPath.slice(0, -1) : correction.targetPath,
					field: correctionField, proposedName: proposedName.trim()
				}),
			});
			setCorrectionSent(true);
			setCorrection(null);
			Swal.fire({
				position: "center",
				icon: "success",
				title: "Request admin-এর কাছে পাঠানো হয়েছে।",
				theme: 'dark',
				showConfirmButton: false,
				timer: 1500
			});
		} catch (error) {
			setCorrectionError(error.message || 'Request পাঠানো যায়নি।');
		} finally {
			setSendingCorrection(false);
		}
	};

	return (
		<div className={`${!lan ? 'english_font' : 'bangla_font'}`}>
			<div className="min-h-screen w-full min-w-0 flex items-center justify-center bg_dark pt-24 pb-28 overflow-x-clip">
				<div className="w-full min-w-0 flex justify-center">
					<div className="w-full min-w-0 flex flex-col items-center">

						<button type="button" onClick={() => navigate('/comments')} aria-label={lan ? 'মন্তব্য লিখুন' : 'Leave a comment'} className={`cursor-pointer div-glow text-glow w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shadow-lg ${user ? 'fixed' : 'hidden'} bottom-4 right-4 sm:bottom-8 sm:right-8 bg_dark z-20`}><MdComment className='text-2xl' /></button>
						{
							lan ?
								<h1 className={`text-xs md:text-base cursor-pointer bg-transparent text-glow w-full md:w-fit p-4 rounded-md shadow-lg ${user ? 'fixed' : 'hidden'} bottom-3 left-4 lg:bottom-3 lg:right-20 bg_dark`}>পরিচালক: তৌয়বুর রহমান তুহিন <br />পিতার নাম: মোঃ আলী হোসেন <br /> মোবাইল নং: ০১৭৭৩৩৪৫১৮৯ <br /> <a href="https://wa.me/8801773345189" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 w-fit text-teal-200 hover:text-white"><FaWhatsapp aria-hidden="true" /><span>WhatsApp-এ যোগাযোগ করুন</span></a></h1> :
								<h1 className={`text-xs md:text-base cursor-pointer bg-transparent text-glow w-full md:w-fit p-4 rounded-md shadow-lg ${user ? 'fixed' : 'hidden'} bottom-3 left-4 lg:bottom-3 lg:right-20 bg_dark`}>Owner: Toybur Rahman Tuhin <br />Father&apos;s Name: Md Ali Hossain <br /> Mobile No: 01773345189 <br /> <a href="https://wa.me/8801773345189" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 w-fit text-teal-200 hover:text-white"><FaWhatsapp aria-hidden="true" /><span>Contact Via WhatsApp</span></a></h1>

						}

						<div className="fixed top-20 sm:top-28 z-10 w-full max-w-xl min-w-0 px-4 mb-4">
							<Link onClick={() => setMenuOpen(false)} to="/family-photos" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2 flex md:hidden items-center justify-center text-center mb-2">{!lan ? 'Family Photo' : 'পারিবারের সকলের ছবি'}</Link>
							<label htmlFor="genealogy-search" className="sr-only">নাম দিয়ে family tree খুঁজুন</label>
							<div className="flex items-center gap-2 border border-teal-500 rounded-xl px-4 py-3 bg-slate-950/90 shadow-lg shadow-teal-900/30">
								<input id="genealogy-search" type="search" autoComplete="off" value={treeSearch} onChange={event => { setTreeSearch(event.target.value); setSelectedTreePath(null); setExpandedPaths([]); }} placeholder={lan ? 'সদস্যের নাম লিখে খুঁজুন…' : 'Search family tree by name…'} className="w-full bg-transparent outline-none" />
								{treeSearch && <button type="button" onClick={() => { setTreeSearch(''); setSelectedTreePath(null); setExpandedPaths([]); }} className="text-sm text-teal-200 hover:text-white">Clear</button>}
							</div>
							{treeSearch.trim() && !selectedTreePath && <div className="absolute left-4 right-4 top-full mt-2 max-h-72 overflow-y-auto rounded-xl border border-teal-500/70 bg-slate-950 shadow-xl">
								{searchResults.length ? searchResults.map(result => <button type="button" key={result.path.join('.')} onClick={() => openSearchResult(result)} className="block w-full text-left px-4 py-3 hover:bg-teal-900/50 border-b border-teal-500/20 last:border-0">
									<strong>{result.name}</strong><span className="block mt-1 text-xs opacity-70">{result.label}</span>
								</button>) : <p className="px-4 py-3 opacity-75">কোনো মিল পাওয়া যায়নি।</p>}
							</div>}
						</div>

						<div className='flex flex-col items-center gap-5 mt-28 md:mt-24'>
							{/* <div role="note" className="w-[calc(100%-2rem)] max-w-5xl rounded-xl border border-teal-500/60 bg-slate-950/80 px-4 py-3 text-center text-sm sm:text-base leading-relaxed">
								{lan ? 'আপনার ছবি যুক্ত না থাকলে নিজের নামের পাশের ছবি আইকনে চাপ দিয়ে ছবি যুক্তির আবেদন করুন। অন্য কোনো সদস্যের ছবি আপনার কাছে থাকলে তাঁর নামের পাশের আইকন থেকেও ছবি পাঠাতে পারেন। Admin অনুমোদন করলে ছবিটি tree-তে যুক্ত বা পরিবর্তন হবে।' : 'If your photo is missing, use the image icon beside your name to request an upload. If you have a photo of another member, you can submit it from the icon beside their name too. The photo appears in the tree after admin approval.'}
							</div> */}
							{
								(loading || userDetectedLoading) ?
									<div className='flex flex-col items-center'>
										<DNA
											visible={true}
											height="80"
											width="80"
											ariaLabel="dna-loading"
											wrapperStyle={{}}
											wrapperClass="dna-wrapper"
										/>
										<h1 className='text-xl'>এক্কানা খাড়ান</h1>
									</div> :
									treeError ? <div role="alert" className="max-w-xl px-6 py-4 border border-rose-400 rounded-lg text-center">{treeError}</div> :
										<>
											{/* <div className="relative z-10 w-full max-w-xl min-w-0 px-4 mb-4">
												<label htmlFor="genealogy-search" className="sr-only">নাম দিয়ে family tree খুঁজুন</label>
												<div className="flex items-center gap-2 border border-teal-500 rounded-xl px-4 py-3 bg-slate-950/90 shadow-lg shadow-teal-900/30">
													<input id="genealogy-search" type="search" autoComplete="off" value={treeSearch} onChange={event => { setTreeSearch(event.target.value); setSelectedTreePath(null); setExpandedPaths([]); }} placeholder={lan ? 'সদস্যের নাম লিখে খুঁজুন…' : 'Search family tree by name…'} className="w-full bg-transparent outline-none" />
													{treeSearch && <button type="button" onClick={() => { setTreeSearch(''); setSelectedTreePath(null); setExpandedPaths([]); }} className="text-sm text-teal-200 hover:text-white">Clear</button>}
												</div>
												{treeSearch.trim() && !selectedTreePath && <div className="absolute left-4 right-4 top-full mt-2 max-h-72 overflow-y-auto rounded-xl border border-teal-500/70 bg-slate-950 shadow-xl">
													{searchResults.length ? searchResults.map(result => <button type="button" key={result.path.join('.')} onClick={() => openSearchResult(result)} className="block w-full text-left px-4 py-3 hover:bg-teal-900/50 border-b border-teal-500/20 last:border-0">
														<strong>{result.name}</strong><span className="block mt-1 text-xs opacity-70">{result.label}</span>
													</button>) : <p className="px-4 py-3 opacity-75">কোনো মিল পাওয়া যায়নি।</p>}
												</div>}
											</div> */}
											<Genealogy data={activeTree} language={!lan ? 'English' : 'Bangla'} profiles={members} onShowPhoto={setSelectedPhoto} onRequestCorrection={openCorrection} onRequestPhoto={openPhotoRequest} expandedPaths={expandedPaths} highlightedPath={selectedTreePath} />
										</>
							}
						</div>
					</div>
				</div>
			</div>
			{selectedPhoto && <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center px-5" role="dialog" aria-modal="true" aria-label={`${selectedPhoto.name} profile photo`} onClick={() => setSelectedPhoto(null)}>
				<div className="bg_dark div-glow rounded-xl p-4 sm:p-5 max-w-md w-full max-h-[90dvh] overflow-y-auto text-center" onClick={event => event.stopPropagation()}>
					<button type="button" className="block ml-auto text-2xl" onClick={() => setSelectedPhoto(null)} aria-label="Close">×</button>
					<img src={selectedPhoto.photoURL} alt={selectedPhoto.name} className="w-52 h-52 sm:w-64 sm:h-64 object-cover rounded-xl mx-auto" />
					<h2 className="text-xl mt-4">{!lan ? selectedPhoto.name : selectedPhoto.bangla_name || selectedPhoto.name}</h2>
					<p className="mt-1">{selectedPhoto.fathers_name}</p>
					{selectedPhoto.phone_number && <p className="mt-1">{selectedPhoto.phone_number}</p>}
					<button type="button" onClick={() => { openPhotoRequest({ type: 'photo_change', language: selectedPhoto.language, targetPath: selectedPhoto.targetPath, familyMemberId: selectedPhoto.familyMemberId, currentName: selectedPhoto.name, expectedPhotoURL: selectedPhoto.photoURL }); setSelectedPhoto(null); }} className="mt-5 min-h-11 w-full sm:w-auto border border-teal-500 rounded-lg px-5 py-2">{lan ? 'ছবি পরিবর্তনের আবেদন' : 'Request photo change'}</button>
				</div>
			</div>}
			{photoRequest && <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="photo-request-title" onClick={() => setPhotoRequest(null)}>
				<form onSubmit={handlePhotoRequestSubmit} className="bg_dark div-glow rounded-xl p-4 sm:p-6 max-w-lg w-full max-h-[92dvh] overflow-y-auto space-y-4" onClick={event => event.stopPropagation()}>
					<button type="button" className="block ml-auto text-2xl min-w-10 min-h-10" onClick={() => setPhotoRequest(null)} aria-label="Close">×</button>
					<h2 id="photo-request-title" className="text-xl">{photoRequest.type === 'photo_change' ? (lan ? `${photoRequest.currentName} — ছবি পরিবর্তনের আবেদন` : `Request a new photo for ${photoRequest.currentName}`) : (lan ? `${photoRequest.currentName} — ছবি যুক্ত করুন` : `Add a photo for ${photoRequest.currentName}`)}</h2>
					<p className="text-sm opacity-80">{photoRequest.type === 'photo_change' ? (lan ? 'নতুন ছবি admin-এর কাছে approval-এর জন্য যাবে। Approve হলে বর্তমান ছবি বদলে যাবে।' : 'The new photo will go to an admin for approval. It will replace the current photo after approval.') : (lan ? 'এই সদস্যের কোনো ছবি যুক্ত নেই। ছবি upload করলে admin-এর কাছে approval-এর জন্য request যাবে।' : 'No photo is attached to this member. Uploading a photo will send it to an admin for approval.')}</p>
					{photoRequest.type === 'photo_change' && <div className="flex items-center gap-3"><img src={photoRequest.expectedPhotoURL} alt="বর্তমান ছবি" className="w-20 h-20 rounded-lg object-cover" /><span className="text-sm opacity-75">{lan ? 'বর্তমান ছবি' : 'Current photo'}</span></div>}
					{photoRequestSent ? <p role="status" className="text-teal-200">{photoRequest.type === 'photo_change' ? (lan ? 'ছবি পরিবর্তনের request admin-এর কাছে পাঠানো হয়েছে। Approve হলে নতুন ছবি দেখা যাবে।' : 'Photo change request sent to admin. The new photo will appear after approval.') : (lan ? 'ছবির request admin-এর কাছে পাঠানো হয়েছে। Approve হলে tree-তে দেখা যাবে।' : 'Photo request sent to admin. It will appear in the tree after approval.')}</p> : <>
						<label className="block">{lan ? 'ছবি নির্বাচন করুন (PNG, JPG বা WebP; সর্বোচ্চ ৬ MB)' : 'Choose an image (PNG, JPG or WebP; up to 6 MB)'}<input required type="file" accept="image/png,image/jpeg,image/webp" onChange={event => {
							const file = event.target.files?.[0];
							if (!file) return;
							if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 6 * 1024 * 1024) {
								setPhotoRequestError('PNG, JPG অথবা WebP ছবি ৬ MB-এর মধ্যে দিন।');
								setPhotoFile(null);
								setPhotoPreview('');
								return;
							}
							setPhotoRequestError(''); setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file));
						}} className="mt-2 w-full min-w-0 border border-teal-500 rounded-lg px-3 py-2" /></label>
						{photoPreview && <img src={photoPreview} alt="Selected photo preview" className="w-32 h-32 rounded-xl object-cover border border-teal-500 mx-auto" />}
						{photoRequestError && <p role="alert" className="text-rose-300 break-words">{photoRequestError}</p>}
						<button disabled={sendingPhotoRequest || !photoFile} className="w-full sm:w-auto min-h-11 border border-teal-500 rounded-lg px-5 py-2 disabled:opacity-50">{sendingPhotoRequest ? (lan ? 'Request পাঠানো হচ্ছে…' : 'Sending request…') : (lan ? 'Admin-এর কাছে request পাঠান' : 'Send request to admin')}</button>
					</>}
				</form>
			</div>}
			{correction && <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center px-5" role="dialog" aria-modal="true" aria-labelledby="correction-title">
				<form onSubmit={handleCorrectionSubmit} className="bg_dark div-glow rounded-xl p-4 sm:p-6 max-w-lg w-full max-h-[90dvh] overflow-y-auto space-y-4">
					<button type="button" className="block ml-auto text-2xl" onClick={() => setCorrection(null)} aria-label="Close">×</button>
					<h2 id="correction-title" className="text-xl">নাম সংশোধনের request</h2>
					<label className="block">কোন নাম সংশোধন করবেন?<select value={correctionField} onChange={event => { setCorrectionField(event.target.value); setProposedName(event.target.value === 'fathers_name' ? correction.fatherName : correction.currentName); }} className="mt-2 w-full border border-teal-500 rounded-lg bg-[#01001a] px-3 py-2"><option value="name">এই সদস্যের নাম ({correction.currentName})</option><option value="fathers_name" disabled={!correction.targetPath.length}>এই সদস্যের বাবার নাম ({correction.fatherName || 'নেই'})</option></select></label>
					<p>বর্তমান নাম: {correctionField === 'fathers_name' ? correction.fatherName : correction.currentName}</p>
					<label className="block">সঠিক নাম<input required maxLength={120} value={proposedName} onChange={event => setProposedName(event.target.value)} className="mt-2 w-full border border-teal-500 rounded-lg bg-transparent px-3 py-2" /></label>
					{correctionError && <p role="alert" className="text-rose-300">{correctionError}</p>}
					{correctionSent ? <p role="status" className="text-teal-300">Request admin-এর কাছে পাঠানো হয়েছে।</p> : <button disabled={sendingCorrection} className="border border-teal-500 rounded-lg px-5 py-2 disabled:opacity-50">{sendingCorrection ? 'পাঠানো হচ্ছে…' : 'Request পাঠান'}</button>}
				</form>
			</div>}
		</div>
	)
};

export default Home;
