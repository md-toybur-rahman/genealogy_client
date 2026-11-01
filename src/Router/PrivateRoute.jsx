import { useContext } from 'react';
import { AuthContext } from '../Providers/AuthProviders';
import { Navigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
	const { user, loading, profile, profileLoading, profileError, refreshProfile } = useContext(AuthContext);

	// Show a loading indicator while checking auth state
	if (loading) {
		return <div className='h-screen w-full flex bg-[#01001a] items-center justify-center gap-5'>
			<div className='flex flex-col items-center pt-20'>
				<DNA
					visible={true}
					height="80"
					width="80"
					ariaLabel="dna-loading"
					wrapperStyle={{}}
					wrapperClass="dna-wrapper"
				/>
				<h1 className='text-xl text-white'>এক্কানা খাড়ান</h1>
			</div>
		</div>;
	}

	// Redirect to signup if no user is found
	if (!user) {
		return <Navigate to="/signup" replace />;
	}
	if (profileLoading) return <div className="bg_dark min-h-screen flex items-center justify-center">Profile যাচাই হচ্ছে…</div>;
	if (profileError) return <div className="bg_dark min-h-screen flex flex-col gap-4 items-center justify-center px-5"><p role="alert">{profileError}</p><button className="border border-teal-500 rounded-lg px-5 py-2" onClick={() => refreshProfile().catch(() => {})}>আবার চেষ্টা করুন</button></div>;
	if (!profile?.profile_complete) return <Navigate to="/edit_profile" replace />;

	// Render children if user is authenticated
	return children;
};

export default PrivateRoute;
