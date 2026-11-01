import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProviders';

// eslint-disable-next-line react/prop-types
const AuthRoute = ({ children }) => {
	const { user, loading, profileLoading } = useContext(AuthContext);
	if (loading || (user && profileLoading)) return <div className="bg_dark min-h-screen flex items-center justify-center">Loading…</div>;
	if (!user) return <Navigate to="/signup" replace />;
	return children;
};

export default AuthRoute;
