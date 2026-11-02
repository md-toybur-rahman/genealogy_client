import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FaRegCommentDots, FaRegTrashAlt, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch } from '../../config/api';

const Comments = () => {
	const { user, profile, lan } = useContext(AuthContext);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const [busyId, setBusyId] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [query, setQuery] = useState('');
	const [form, setForm] = useState({ name: profile?.name || '', number: profile?.phone_number || '', comment: '' });

	const loadComments = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const data = await apiFetch(user, '/comments');
			setComments(Array.isArray(data) ? data : []);
		} catch (loadError) {
			setError(loadError.message || 'মন্তব্যগুলো load করা যায়নি।');
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => { loadComments(); }, [loadComments]);
	useEffect(() => {
		setForm(previous => ({ ...previous, name: previous.name || profile?.name || '', number: previous.number || profile?.phone_number || '' }));
	}, [profile]);

	const filteredComments = useMemo(() => {
		const needle = query.trim().toLocaleLowerCase();
		if (!needle) return comments;
		return comments.filter(item => `${item.name || ''} ${item.comment || ''}`.toLocaleLowerCase().includes(needle));
	}, [comments, query]);

	const handleSubmit = async event => {
		event.preventDefault();
		setSending(true);
		setError('');
		setSuccess('');
		try {
			await apiFetch(user, '/comments', { method: 'POST', body: JSON.stringify({ ...form, name: form.name.trim(), number: form.number.trim(), comment: form.comment.trim() }) });
			setForm(previous => ({ ...previous, comment: '' }));
			setSuccess(lan ? 'আপনার মন্তব্য জমা হয়েছে। ধন্যবাদ!' : 'Your comment was submitted. Thank you!');
			await loadComments();
		} catch (submitError) {
			setError(submitError.message || 'মন্তব্য জমা দেওয়া যায়নি।');
		} finally {
			setSending(false);
		}
	};

	const handleDone = async comment => {
		if (!window.confirm(lan ? 'এই মন্তব্যটি মুছে ফেলবেন?' : 'Delete this comment?')) return;
		setBusyId(comment._id);
		setError('');
		try {
			await apiFetch(user, `/comments/${comment._id}`, { method: 'DELETE' });
			setComments(previous => previous.filter(item => item._id !== comment._id));
		} catch (deleteError) {
			setError(deleteError.message || 'মন্তব্যটি সরানো যায়নি।');
		} finally {
			setBusyId('');
		}
	};

	return (
		<main className={`${lan ? 'bangla_font' : 'english_font'} bg_dark min-h-screen w-full px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-12`}>
			<div className="max-w-6xl mx-auto">
				<header className="text-center mb-7 sm:mb-10">
					<p className="text-teal-300 text-sm sm:text-base">{lan ? 'আপনার মতামত আমাদের জানান' : 'We value your feedback'}</p>
					<h1 className="text-2xl sm:text-3xl font-semibold mt-1">{lan ? 'মন্তব্য ও যোগাযোগ' : 'Comments & feedback'}</h1>
				</header>

				<div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-6 lg:gap-8 items-start">
					<section className="div-glow rounded-2xl p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-4"><FaRegCommentDots className="text-2xl text-teal-300" /><h2 className="text-lg sm:text-xl font-semibold">{lan ? 'মন্তব্য লিখুন' : 'Leave a comment'}</h2></div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<label className="block text-sm sm:text-base">{lan ? 'আপনার নাম' : 'Your name'}<input required maxLength={120} value={form.name} onChange={event => setForm(previous => ({ ...previous, name: event.target.value }))} className="mt-1.5 w-full min-h-11 rounded-lg border border-teal-500 bg-transparent px-3 py-2" /></label>
							<label className="block text-sm sm:text-base">{lan ? 'মোবাইল নম্বর (ঐচ্ছিক)' : 'Phone number (optional)'}<input type="tel" maxLength={30} value={form.number} onChange={event => setForm(previous => ({ ...previous, number: event.target.value }))} className="mt-1.5 w-full min-h-11 rounded-lg border border-teal-500 bg-transparent px-3 py-2" /></label>
							<label className="block text-sm sm:text-base">{lan ? 'আপনার মন্তব্য' : 'Your comment'}<textarea required minLength={3} maxLength={2000} rows={5} value={form.comment} onChange={event => setForm(previous => ({ ...previous, comment: event.target.value }))} className="mt-1.5 w-full min-h-32 rounded-lg border border-teal-500 bg-transparent px-3 py-2 resize-y" /></label>
							<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3"><span className="text-xs opacity-70 text-right">{form.comment.length}/2000</span><button disabled={sending} className="min-h-11 w-full sm:w-auto border border-teal-500 rounded-lg px-6 py-2 hover:bg-teal-900/40 disabled:opacity-50">{sending ? (lan ? 'জমা হচ্ছে…' : 'Submitting…') : (lan ? 'মন্তব্য জমা দিন' : 'Submit comment')}</button></div>
						</form>
						{error && <p role="alert" className="mt-4 text-rose-300 break-words">{error}</p>}
						{success && <p role="status" className="mt-4 text-teal-200">{success}</p>}
					</section>

					<section>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
							<h2 className="text-lg sm:text-xl font-semibold">{lan ? 'সবার মন্তব্য' : 'Recent comments'} <span className="text-sm font-normal opacity-70">({comments.length})</span></h2>
							<label className="flex items-center gap-2 min-h-11 rounded-lg border border-teal-500 px-3"><FaSearch className="shrink-0 opacity-70" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={lan ? 'মন্তব্য খুঁজুন' : 'Search comments'} className="min-w-0 w-full bg-transparent outline-none" /></label>
						</div>
						{loading ? <p className="py-8 text-center opacity-75">{lan ? 'মন্তব্য load হচ্ছে…' : 'Loading comments…'}</p> : filteredComments.length === 0 ? <div className="rounded-xl border border-teal-500/40 p-6 text-center opacity-80">{query ? (lan ? 'কোনো মিল পাওয়া যায়নি।' : 'No matching comments.') : (lan ? 'এখনো কোনো মন্তব্য নেই।' : 'No comments yet.')}</div> : (
							<div className="grid sm:grid-cols-2 gap-4">
								{filteredComments.map(comment => <article key={comment._id} className="min-w-0 rounded-xl border border-teal-500/40 bg-slate-950/40 p-4 sm:p-5">
									<div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold break-words">{comment.name}</h3><p className="text-xs opacity-65 mt-1">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : `${comment.date || ''} ${comment.time || ''}`}</p></div>{profile?.user_type === 'admin' && <button type="button" disabled={busyId === comment._id} onClick={() => handleDone(comment)} title={lan ? 'মন্তব্য মুছুন' : 'Delete comment'} aria-label={lan ? 'মন্তব্য মুছুন' : 'Delete comment'} className="shrink-0 min-w-10 min-h-10 flex items-center justify-center rounded-lg border border-rose-400/70 text-rose-200 disabled:opacity-50">{busyId === comment._id ? '…' : <FaRegTrashAlt />}</button>}</div>
									{comment.number && <a href={`tel:${comment.number.replace(/[^+\d]/g, '')}`} className="inline-block mt-2 text-sm text-teal-200 break-all">{comment.number}</a>}
									<p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{comment.comment}</p>
								</article>)}
							</div>
						)}
					</section>
				</div>
			</div>
		</main>
	);
};

export default Comments;
