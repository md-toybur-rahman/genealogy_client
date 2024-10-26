import React, { useContext } from 'react';
import { AuthContext } from '../Providers/AuthProviders';
import { Navigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useContext(AuthContext);

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

	// Render children if user is authenticated
	return children;
};

export default PrivateRoute;
