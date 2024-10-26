import React, { createContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import app from '../firebase/firebase.config';

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()
auth.settings.appVerificationDisabledForTesting = true;

const AuthProviders = ({ children }) => {
	const [user, setUser] = useState(false);
	const [userDetectedLoading, setUserDetectedLoading] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isProfile, setIsProfile] = useState(false);
	const [lan, setLan] = useState(false);

	const googleSignIn = () => {
		setLoading(true);
		return signInWithPopup(auth, googleProvider);
	}

	const logOut = () => {
		setLoading(true);
		setUser(false);
		return signOut(auth);
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUserDetectedLoading(true);
			if (currentUser) {
				setUser(currentUser);
			} else {
				setUser(false);
			}
			setUserDetectedLoading(false);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const authCollection = {
		user,
		loading,
		setLoading,
		logOut,
		googleSignIn,
		userDetectedLoading,
		isProfile,
		setIsProfile,
		lan,
		setLan
	};

	return (
		<AuthContext.Provider value={authCollection}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProviders;
