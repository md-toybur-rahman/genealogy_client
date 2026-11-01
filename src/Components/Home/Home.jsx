import { useContext, useEffect, useState } from 'react';
import Genealogy from '../Genealogy/Genealogy';
import { MdComment, MdOutlineClose } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { DNA } from 'react-loader-spinner';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch, readTree } from '../../config/api';

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
	// const [lan, setLan] = useState(false);
	const [loading, setLoading] = useState(true);
	const [genealogy, setGenealogy] = useState({});
	const [banglaGenealogy, setBanglaGenealogy] = useState({});
	const [members, setMembers] = useState([]);
	const [treeError, setTreeError] = useState('');
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [correction, setCorrection] = useState(null);
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

	const handleCommentBox = () => {
		const commentBox = document.getElementById('comment_box');
		if (commentBox.classList.contains('hidden')) {
			commentBox.classList.remove('hidden');
			commentBox.classList.add('flex');
		}
	}
	const handleCloseComment = () => {
		const commentBox = document.getElementById('comment_box');
		if (commentBox.classList.contains('flex')) {
			commentBox.classList.remove('flex');
			commentBox.classList.add('hidden');
		}
	}

	const handleCommentSubmit = event => {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;
		const number = form.number.value;
		const comment = form.comment.value;
		const date = new Date();
		const fullDate = date.toDateString()
		const time = date.toLocaleTimeString();

		const userComment = { name, number, comment, date: `${fullDate}`, time }

		apiFetch(user, '/comments', {
			method: 'POST',
			body: JSON.stringify(userComment)
		})
			.then(() => {
				form.reset();
				const alertBox = document.getElementById('alert_box');

				alertBox.classList.remove('hidden');
				alertBox.classList.add('flex');
				handleCloseComment();
				setTimeout(() => {
					alertBox.classList.remove('flex');
					alertBox.classList.add('hidden');
				}, 2000);
			});
	}

	const openCorrection = request => {
		setCorrection(request);
		setProposedName(request.currentName);
		setCorrectionError('');
		setCorrectionSent(false);
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
				body: JSON.stringify({ type: 'name_correction', language: correction.language, targetPath: correction.targetPath, proposedName: proposedName.trim() }),
			});
			setCorrectionSent(true);
		} catch (error) {
			setCorrectionError(error.message || 'Request পাঠানো যায়নি।');
		} finally {
			setSendingCorrection(false);
		}
	};

	return (
		<div className={`${!lan ? 'english_font' : 'bangla_font'}`}>
			{/* Alert */}
			<div id='alert_box' className={`fixed h-full w-full bg-black/40 z-30 hidden items-center justify-center px-5`}>
				<div className='w-[400px] h-fit py-10 bg_dark div-glow rounded-xl relative overflow-hidden flex flex-col gap-10 items-center justify-center'>
					<div className='w-[60px] h-[60px] flex items-center justify-center rounded-full div-glow'><IoCheckmarkDoneSharp className='checkmark text-teal-500' /> </div>
					<div>
						<h1>{!lan ? 'Message Submitted Successfully' : 'মন্তব্য সফলভাবে জমা দেওয়া হয়েছে'}</h1>
						{/* <h1>Sign Up Successfully</h1> */}
					</div>

				</div>
			</div>
			{/* Modal Comment Box */}
			<div id='comment_box' className={`fixed h-full w-full bg-black/40 z-20 hidden items-center justify-center px-5`}>
				<div className='w-[600px] h-fit py-5 bg_dark div-glow rounded-xl relative overflow-hidden flex items-center justify-center'>
					<div onClick={handleCloseComment} className='absolute right-4 top-4 w-fit p-2 cursor-pointer duration-300 text-2xl hover:text-teal-500'><MdOutlineClose /></div>
					<form onSubmit={handleCommentSubmit} className='h-[80%] w-[90%] md:w-[80%] mt-14'>
						<div className='flex flex-col md:grid grid-cols-6 gap-2 md:gap-5'>
							<label className='col-span-2'>{!lan ? 'Your Name :' : 'আপনার নাম :'}</label>
							<input name='name' className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1' type="text" />
						</div>
						<div className='flex flex-col md:grid grid-cols-6 gap-2 md:gap-5 mt-5'>
							<label className='col-span-2'>{!lan ? 'Mobile Number :' : 'মোবাইল নম্বর:'}</label>
							<input name='number' className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1' type="text" />
						</div>
						<div className='flex flex-col md:grid grid-cols-6 gap-2 md:gap-5 mt-5'>
							<label className='col-span-2'>{!lan ? 'Your Comment :' : 'আপনার মন্তব্য :'}</label>
							<textarea name='comment' rows={5} className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1 resize-none' type="text" />
						</div>
						<div className='flex items-center justify-center mt-6'>
							<input type='submit' className='border border-teal-500 bg-transparent div-glow rounded-md px-5 py-1 font-semibold duration-300 hover:text-teal-500' value={!lan ? 'Submit' : 'জমা দিন'} />
						</div>
					</form>
				</div>
			</div>
			<div className="min-h-screen flex items-center justify-center bg_dark pt-20">
				<div className="flex justify-center">
					<div className="">

						<button onClick={handleCommentBox} className={`cursor-pointer bg-transparent div-glow text-glow w-fit p-4 rounded-full shadow-lg ${user ? 'fixed' : 'hidden'} bottom-3 right-4 lg:bottom-10 lg:right-20 bg_dark`}><MdComment className='text-2xl' /></button>

						<div className='flex flex-col items-center gap-5 mt-12 md:mt-20'>
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
																					<div className="relative z-10 w-full max-w-xl px-4 mb-4">
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
																				<Genealogy data={activeTree} language={!lan ? 'English' : 'Bangla'} profiles={members} onShowPhoto={setSelectedPhoto} onRequestCorrection={openCorrection} expandedPaths={expandedPaths} highlightedPath={selectedTreePath} />
																			</>
							}
						</div>
					</div>
				</div>
			</div>
			{selectedPhoto && <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center px-5" role="dialog" aria-modal="true" aria-label={`${selectedPhoto.name} profile photo`} onClick={() => setSelectedPhoto(null)}>
				<div className="bg_dark div-glow rounded-xl p-5 max-w-md w-full text-center" onClick={event => event.stopPropagation()}>
					<button type="button" className="block ml-auto text-2xl" onClick={() => setSelectedPhoto(null)} aria-label="Close">×</button>
					<img src={selectedPhoto.photoURL} alt={selectedPhoto.name} className="w-64 h-64 object-cover rounded-xl mx-auto" />
					<h2 className="text-xl mt-4">{!lan ? selectedPhoto.name : selectedPhoto.bangla_name || selectedPhoto.name}</h2>
					<p className="mt-1">{selectedPhoto.fathers_name}</p>
					{selectedPhoto.phone_number && <p className="mt-1">{selectedPhoto.phone_number}</p>}
				</div>
			</div>}
			{correction && <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center px-5" role="dialog" aria-modal="true" aria-labelledby="correction-title">
				<form onSubmit={handleCorrectionSubmit} className="bg_dark div-glow rounded-xl p-6 max-w-lg w-full space-y-4">
					<button type="button" className="block ml-auto text-2xl" onClick={() => setCorrection(null)} aria-label="Close">×</button>
					<h2 id="correction-title" className="text-xl">নাম সংশোধনের request</h2>
					<p>বর্তমান নাম: {correction.currentName}</p>
					<label className="block">সঠিক নাম<input required maxLength={120} value={proposedName} onChange={event => setProposedName(event.target.value)} className="mt-2 w-full border border-teal-500 rounded-lg bg-transparent px-3 py-2" /></label>
					{correctionError && <p role="alert" className="text-rose-300">{correctionError}</p>}
					{correctionSent ? <p role="status" className="text-teal-300">Request admin-এর কাছে পাঠানো হয়েছে।</p> : <button disabled={sendingCorrection} className="border border-teal-500 rounded-lg px-5 py-2 disabled:opacity-50">{sendingCorrection ? 'পাঠানো হচ্ছে…' : 'Request পাঠান'}</button>}
				</form>
			</div>}
		</div>
	)
};

export default Home;
