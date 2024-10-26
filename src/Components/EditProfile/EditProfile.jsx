import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import Swal from 'sweetalert2';
import { GiCrossedSwords } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
	const { user,setLoading } = useContext(AuthContext);
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState([]);
	useEffect(() => {
		fetch(`https://genealogy-server.onrender.com/users`)
			.then(res => res.json())
			.then(data => {
				const findCurrentUser = data.filter(singleUser => singleUser.email == user.email);
				setCurrentUser(findCurrentUser);
			})
	}, [user]);
	const handleEditProfile = event => {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;
		const fathers_name = form.fathers_name.value;
		const phone_number = form.number.value;
		const updatedData = { name, fathers_name, phone_number };
		fetch(`https://genealogy-server.onrender.com/users/${currentUser[0]._id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(updatedData)
		})
			.then(res => res.json())
			.then(data => {
				if (data.modifiedCount) {
					Swal.fire({
						position: "center",
						icon: "success",
						title: "কাম সাইচ্ছে",
						showConfirmButton: false,
						timer: 3000,
						background: '#01001a',
						color: '#dddcff',
						customClass: 'div-glow text-sm'
					});
				}
				navigate('/')

			})
	}
	const handleCloseEditProfile = () => {
		navigate('/')
	}
	return (
		<div className={`bg-black w-full h-screen flex items-center justify-center px-7`}>

			<div className='border border-teal-500 p-6 shadow-md hover:shadow-md shadow-teal-500 transition-shadow duration-300 rounded-2xl mt-10 w-full sm:w-[400px] min-h-[200px] bg-black mx-auto flex flex-col items-center justify-center gap-5 relative'>
				{
					currentUser[0]?.name ?
						<div onClick={handleCloseEditProfile} className='text-white text-xl absolute -top-4 -right-4 rounded-full p-2 div-glow bg-black cursor-pointer'>
							<GiCrossedSwords className='text-white' /></div> : ''

				}

				<h1 className='text-xl md:text-3xl font-bold text-center text-white mt-4'>Edit Your Profile</h1>
				<form onSubmit={handleEditProfile} className='h-[80%] w-[90%] md:w-[95%] mt-4 text-white flex flex-col justify-start gap-5'>
					<div className='flex flex-col items-start gap-2 text-white'>
						<label className='col-span-3'>Name:</label>
						<input name='name' className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1 w-full' defaultValue={currentUser[0]?.name} type="text" />
					</div>
					<div className='flex flex-col items-start gap-2'>
						<label className='col-span-3'>Father's Name:</label>
						<input name='fathers_name' defaultValue={currentUser[0]?.fathers_name} className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1 w-full' type="text" />
					</div>
					<div className='flex flex-col gap-2'>
						<label className='col-span-2'>Phone Number:</label>
						<input name='number' defaultValue={currentUser[0]?.phone_number} className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow  px-3 py-1' type="text" />
					</div>
					<div className='flex items-center justify-center mt-6'>
						<input type='submit' className='border border-teal-500 bg-transparent div-glow rounded-md px-5 py-1 font-semibold duration-300 hover:text-teal-500' value="Submit" />
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;