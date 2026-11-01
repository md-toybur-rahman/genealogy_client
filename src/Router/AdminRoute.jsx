import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProviders';

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ children }) => {
	const { user, loading, profile, profileLoading } = useContext(AuthContext);
	if (loading) return <div className="bg_dark min-h-screen flex items-center justify-center">Loading…</div>;
	if (!user) return <Navigate to="/signup" replace />;
	if (profileLoading) return <div className="bg_dark min-h-screen flex items-center justify-center">Profile যাচাই হচ্ছে…</div>;
	if (!profile?.profile_complete) return <Navigate to="/edit_profile" replace />;
	if (profile.user_type !== 'admin') return <Navigate to="/" replace />;
	return children;
};

export default AdminRoute;
