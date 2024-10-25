import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProviders';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
	const { user } = useContext(AuthContext);
	const [currentUser, setCurrentUser] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		fetch(`http://localhost:2000/users`)
			.then(res => res.json())
			.then(data => {
				const findCurrentUser = data.filter(singleUser => singleUser.email == user.email);
				setCurrentUser(findCurrentUser);
			})
	}, [user]);
	// useEffect(() => {
	// 	if (!user) {
	// 		navigate('/signup')
	// 	} else {
	// 		children
	// 	}
	// }, [user])
	if(!user) {
		return navigate('/signup')
	}
	else {
		return children
	}


};

export default PrivateRoute;