import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { useNavigate } from 'react-router-dom';
import { wakeServer } from '../../config/api';

const SignUp = () => {
	const { user, profile, profileLoading, profileError, googleSignIn, refreshProfile } = useContext(AuthContext);
	const navigate = useNavigate();
	const [loginLoading, setLoginLoading] = useState(false);
	const [retryLoading, setRetryLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!user || profileLoading) return;
		if (profileError) return;
		navigate(profile?.profile_complete ? '/' : '/edit_profile', { replace: true });
	}, [user, profile, profileLoading, profileError, navigate]);

	const handleGoogleSignIn = async () => {
		setLoginLoading(true);
		setError('');
		try {
			const signInPromise = googleSignIn();
			void wakeServer().catch(() => {});
			await signInPromise;
		} catch (signInError) {
			setError(signInError.message || 'Sign in করা যায়নি।');
		} finally {
			setLoginLoading(false);
		}
	};

	const handleProfileRetry = async () => {
		setRetryLoading(true);
		setError('');
		try {
			await refreshProfile();
		} catch (retryError) {
			setError(retryError.message || 'Server-এ সংযোগ করা যায়নি। আবার চেষ্টা করুন।');
		} finally {
			setRetryLoading(false);
		}
	};

	const connecting = loginLoading || Boolean(user && profileLoading) || retryLoading;

	return (
		<main className="bg_dark min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
			<h1 className="text-center text-lg sm:text-xl md:text-2xl text-glow max-w-lg break-words">ছমর উদ্দিনের পরিবারে আপনাকে স্বাগতম</h1>
			<h1 className="text-center text-base sm:text-lg md:text-xl text-glow text-red-400 max-w-lg break-words mt-5">পুরো সিস্টেম বুজতে আগে নিচের এই ভিডিওটি দেখে নিন</h1>
			<a href='https://youtu.be/ugQ7H-xEVSU' className="border-2 border-teal-500 px-5 py-3 min-h-12 rounded-lg disabled:opacity-50 w-full sm:w-auto mt-4 text-center">
					ভিডিও দেখার জন্য এইখানে চাপ দিন
				</a>
			<section className="border border-teal-500 p-4 sm:p-6 shadow-md shadow-teal-500 rounded-2xl mt-8 sm:mt-10 w-full max-w-sm min-h-48 flex flex-col items-center justify-center gap-5">
				<h2 className="text-center text-xl sm:text-2xl font-medium">Sign in to continue</h2>
				{error && <p role="alert" className="text-rose-300">{error}</p>}
				{profileError && <p role="alert" className="text-rose-300">{profileError}</p>}
				{user && profileLoading && <div role="status" aria-live="polite" className="text-center text-sm sm:text-base text-teal-200">
					<span className="inline-block w-5 h-5 border-2 border-teal-300 border-t-transparent rounded-full animate-spin align-middle mr-2" />
					Render server ঘুম থেকে জাগছে, সংযোগ হতে কিছুটা সময় লাগতে পারে। অপেক্ষা করুন…
				</div>}
				{user && profileError && <button type="button" disabled={connecting} onClick={handleProfileRetry} className="border border-teal-500 px-5 py-3 min-h-12 rounded-lg disabled:opacity-50 w-full sm:w-auto">
					{retryLoading ? 'Server-এ সংযোগ হচ্ছে…' : 'আবার সংযোগ করুন'}
				</button>}
				<button disabled={connecting || Boolean(user && profileError)} onClick={handleGoogleSignIn} className="border-2 border-teal-500 px-5 py-3 min-h-12 rounded-lg disabled:opacity-50 w-full sm:w-auto">
					{connecting ? <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin align-middle mr-2" />{loginLoading ? 'Signing in…' : 'Connecting…'}</> : 'Continue with Google'}
				</button>
			</section>
		</main>
	);
};

export default SignUp;
