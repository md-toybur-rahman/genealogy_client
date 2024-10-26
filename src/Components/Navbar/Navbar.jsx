import React, { useContext, useEffect, useState } from 'react';
import { FaRegEdit, FaRegUser, FaSortDown } from "react-icons/fa";
import { AuthContext } from '../../Providers/AuthProviders';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
	const { user, logOut, isProfile, setIsProfile, lan, setLan } = useContext(AuthContext);
	const [usersDetails, setUsersDetails] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`https://genealogy-server.onrender.com/users`)
			.then(res => res.json())
			.then(data => {
				const userData = data.filter(currentUser => currentUser.email == user.email);
				setUsersDetails(userData);
			})
	}, [user]);

	const handleLogout = async () => {
		await setIsProfile(!isProfile);
		logOut()
	}
	const handleEditProfile = () => {
		navigate('/edit_profile');
	}
	return (
		<div className='w-full fixed top-0 left-0 py-5 bg_dark div-glow flex items-center justify-between px-5 md:px-10 h-[80px]'>

			<h1 className='cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 w-fit px-2 lg:px-4 py-1 rounded-lg text-sm md:text-base'>Last Update: Work Running</h1>
			<div>
				{
					user ?
						<div>
							<div className='flex items-center gap-8'>
								<h1 onClick={() => setLan(!lan) } className='cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 w-fit px-2 lg:px-4 py-1 rounded-lg  text-sm md:text-base'>{!lan ? 'বাংলা' : 'English'}</h1>
								<div id='profileContainerSwitch' onClick={() => setIsProfile(!isProfile)} className='flex items-center gap-4 cursor-pointer'>
									<div className='h-[40px] w-[40px] rounded-full div-glow flex items-center justify-center'>
										{
											!user && !usersDetails[0]?.photoURL ?
												<FaRegUser className='text-xl' /> : <img className='overflow-hidden rounded-full' src={usersDetails[0]?.photoURL} alt="" />
										}
									</div>
									<FaSortDown className={`${isProfile ? 'rotate-180' : 'rotate-0'} duration-300`} />
								</div>
							</div>

							<div onClick={() => setIsProfile(!isProfile)} id='profileContainer' className={`div-glow p-5 rounded-xl absolute top-24 right-10 bg_dark ${isProfile ? 'block' : 'hidden'}`}>
								<div className={`h-[80px] w-[80px] rounded-full div-glow flex items-center justify-center mx-auto relative`}>
									{
										!user && !usersDetails[0]?.photoURL ?
											<FaRegUser className='text-4xl' /> : <img className='overflow-hidden rounded-full' src={usersDetails[0]?.photoURL} alt="" />
									}
									<div className='absolute bg-black p-2 rounded-full -bottom-2 -right-2 div-glow cursor-pointer'>
										<FaRegEdit></FaRegEdit>
									</div>
								</div>
								<div className='mt-2 flex flex-col items-center justify-center'>
									<h1><span className='text-teal-500 text-xs text-center'>{usersDetails[0]?.email}</span></h1>
									<button onClick={handleEditProfile} className='hover:bg-teal-500 border border-teal-500 duration-300  bg-transparent text-xs text-white px-5 py-1 rounded-lg flex items-center gap-2 mt-2'>Edit Profile</button>
								</div>
								<div className='mt-8 flex flex-col gap-3'>
									<h1><span className='text-teal-500'>Name: {usersDetails[0]?.name}</span></h1>

									<h1><span className='text-teal-500'>Father's Name: {usersDetails[0]?.fathers_name}</span></h1>
									<h1><span className='text-teal-500'>Mobile Number: {usersDetails[0]?.phone_number}</span></h1>
								</div>

								<div className='mx-auto w-fit'>
									<button onClick={handleLogout} className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium px-5 py-1 rounded-lg flex items-center gap-2 mt-7'>Log Out</button>
								</div>
							</div>
						</div> : <div></div>
				}
			</div>

		</div>
	);
};

export default Navbar;