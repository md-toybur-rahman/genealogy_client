import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
	const { user, profile, profileLoading, profileError, googleSignIn } = useContext(AuthContext);
	const navigate = useNavigate();
	const [loginLoading, setLoginLoading] = useState(false);
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
			await googleSignIn();
		} catch (signInError) {
			setError(signInError.message || 'Sign in করা যায়নি।');
		} finally {
			setLoginLoading(false);
		}
	};

	return (
		<main className="bg_dark min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
			<h1 className="text-center text-lg sm:text-xl md:text-2xl text-glow max-w-lg break-words">ছমর উদ্দিনের পরিবারে আপনাকে স্বাগতম</h1>
			<section className="border border-teal-500 p-4 sm:p-6 shadow-md shadow-teal-500 rounded-2xl mt-8 sm:mt-10 w-full max-w-sm min-h-48 flex flex-col items-center justify-center gap-5">
				<h2 className="text-center text-xl sm:text-2xl font-medium">Sign in to continue</h2>
				{error && <p role="alert" className="text-rose-300">{error}</p>}
				{profileError && <p role="alert" className="text-rose-300">{profileError}</p>}
				<button disabled={loginLoading} onClick={handleGoogleSignIn} className="border-2 border-teal-500 px-5 py-3 min-h-12 rounded-lg disabled:opacity-50 w-full sm:w-auto">
					{loginLoading ? 'Signing in…' : 'Continue with Google'}
				</button>
			</section>
		</main>
	);
};

export default SignUp;
