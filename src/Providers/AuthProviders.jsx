import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import app from '../firebase/firebase.config';
import { apiFetch } from '../config/api';

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// eslint-disable-next-line react/prop-types
const AuthProviders = ({ children }) => {
	const [user, setUser] = useState(false);
	const [userDetectedLoading, setUserDetectedLoading] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isProfile, setIsProfile] = useState(false);
	const [lan, setLan] = useState(false);
	const [profile, setProfile] = useState(null);
	const [profileLoading, setProfileLoading] = useState(true);
	const [profileError, setProfileError] = useState('');
	const authEventVersion = useRef(0);

	const googleSignIn = () => {
		return signInWithPopup(auth, googleProvider);
	}

	const logOut = () => {
		setLoading(true);
		setUser(false);
		return signOut(auth);
	}

	const refreshProfile = useCallback(async () => {
		if (!user) return null;
		setProfileLoading(true);
		setProfileError('');
		try {
			const currentProfile = await apiFetch(user, '/users/me');
			setProfile(currentProfile);
			return currentProfile;
		} catch (error) {
			setProfileError(error.message || 'Profile load করা যায়নি।');
			throw error;
		} finally {
			setProfileLoading(false);
		}
	}, [user]);

	useEffect(() => {
		let active = true;
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			const eventVersion = ++authEventVersion.current;
			setUserDetectedLoading(true);
			setUser(currentUser || false);
			setUserDetectedLoading(false);
			setLoading(false);
			setProfileError('');
			if (!currentUser) {
				setProfile(null);
				setProfileLoading(false);
				return;
			}
			setProfileLoading(true);
			try {
				const currentProfile = await apiFetch(currentUser, '/users/me');
				if (active && eventVersion === authEventVersion.current) setProfile(currentProfile);
			} catch (error) {
				if (active && eventVersion === authEventVersion.current) {
					setProfile(null);
					setProfileError(error.message || 'Profile load করা যায়নি।');
				}
			} finally {
				if (active && eventVersion === authEventVersion.current) setProfileLoading(false);
			}
		});
		return () => { active = false; unsubscribe(); };
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
		profile,
		profileLoading,
		profileError,
		refreshProfile,
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
