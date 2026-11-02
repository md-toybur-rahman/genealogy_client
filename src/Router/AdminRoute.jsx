import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';
import { AuthContext } from '../Providers/AuthProviders';

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ children }) => {
	const { user, loading, profile, profileLoading } = useContext(AuthContext);
	if (loading) return <div className="min-h-screen flex items-center justify-center bg_dark pt-20"><div className='flex flex-col items-center'>
		<DNA
			visible={true}
			height="80"
			width="80"
			ariaLabel="dna-loading"
			wrapperStyle={{}}
			wrapperClass="dna-wrapper"
		/>
		<h1 className='text-xl'>এক্কানা খাড়ান</h1>
	</div></div>;
	if (!user) return <Navigate to="/signup" replace />;
	if (profileLoading) return <div className="min-h-screen flex items-center justify-center bg_dark pt-20"><div className='flex flex-col items-center'>
		<DNA
			visible={true}
			height="80"
			width="80"
			ariaLabel="dna-loading"
			wrapperStyle={{}}
			wrapperClass="dna-wrapper"
		/>
		<h1 className='text-xl'>এক্কানা খাড়ান</h1>
	</div></div>;
	if (!profile?.profile_complete) return <Navigate to="/edit_profile" replace />;
	if (profile.user_type !== 'admin') return <Navigate to="/" replace />;
	return children;
};

export default AdminRoute;
