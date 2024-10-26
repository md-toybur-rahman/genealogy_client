import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import EditProfile from '../EditProfile/EditProfile';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
	const { user, userDetectedLoading, googleSignIn } = useContext(AuthContext)
	const [currentUser, setCurrentUser] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		fetch(`https://genealogy-server.onrender.com/users`)
			.then(res => res.json())
			.then(data => {
				const findCurrentUser = data.filter(singleUser => singleUser.email == user.email);
				setCurrentUser(findCurrentUser);
			})
	}, [user]);
	const handleGoogleSignIn = () => {
		googleSignIn()
			.then(data => {
				const userData = { name: '', fathers_name: '', phone_number: '', email: data.user.email, photoURL: data.user.photoURL }
				fetch(`https://genealogy-server.onrender.com/users`)
					.then(res => res.json())
					.then(ExsistedData => {
						const isExistData = ExsistedData.filter(isExist => isExist.email == data.user.email);
						if (isExistData.length == 0) {
							fetch(`https://genealogy-server.onrender.com/users`, {
								method: 'POST',
								headers: {
									'content-type': 'application/json'
								},
								body: JSON.stringify(userData)
							})
								.then(res => res.json())
								.then(data => {

								})
							navigate('/edit_profile')
						}
						else {
							navigate('/')
						}
					})
			})
	}
	return (
		<div>
			<div id='signInContainer' className={`bg-black h-full w-full absolute flex items-center justify-center`}>
				<div className='border border-teal-500 p-6 shadow-md hover:shadow-md shadow-teal-500 transition-shadow duration-300 rounded-2xl mt-10 sm:w-[400px] min-h-[200px] bg-black mx-auto flex flex-col items-center justify-center gap-5'>
					<h1 className='text-center text-2xl  bg-transparent text-white font-medium'>At First Please Sign In</h1>
					<button onClick={handleGoogleSignIn} type='submit' className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium px-5 py-1 rounded-lg flex items-center gap-2'>Sign In</button>
				</div>
			</div>
		</div>
	);
};

export default SignUp;