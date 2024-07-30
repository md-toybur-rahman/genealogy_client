import React, { createContext, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import app from '../firebase/firebase.config';




export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProviders = ({ children }) => {
	const [user, setUser] = useState(false);
	const [loading, setLoading] = useState(true);


	const googleSignIn = () => {
		setLoading(true);
		return signInWithPopup(auth, googleProvider);
	}

	useEffect(() => {
		const userActivity = onAuthStateChanged(auth, loggedUser => {
			if (loggedUser) {
				setUser(loggedUser);
				setLoading(false);
			}
			else {
				setUser(false);
				setLoading(true);
			}
		})
		return userActivity();
	}, [])

	const authCollection = {
		user,
		loading,
		googleSignIn
	}

	return (
		<AuthContext.Provider value={authCollection}>
			{children}
		</AuthContext.Provider>
	)
};

export default AuthProviders;