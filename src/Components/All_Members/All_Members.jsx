import React from 'react';
import { FaRegUser } from 'react-icons/fa';
import { useLoaderData } from 'react-router-dom';

const All_Members = () => {
	const allUsers = useLoaderData();
	console.log(allUsers);
	return (
		<div className='bg_dark min-h-[100vh] w-full english_font px-10'>
			<div className='pt-24'>
				<h1 className='text-2xl lg:text-3xl text-center text-glow'>All Users</h1>
			</div>
			<div className='grid lg:grid-cols-3 gap-4 lg:gap-10'>
				{
					allUsers.map(person => <div key={person.index}>
						<div className='w-full div-glow text-lg p-5 overflow-y-scroll comment_card mt-10 rounded-xl flex flex-col'>
							<div className='gap-10'>
								<div className={`h-[80px] w-[80px] rounded-full div-glow relative mb-5`}>
									<img className='overflow-hidden rounded-full' src={`${person.photoURL}`} alt="" />
								</div>
								<div className='lg:border-r-2 pr-10'>
									<h1>Name : {person.name}</h1>
									<h1>Father's Name : {person.fathers_name}</h1>
									<h1>Phone Number: {person.phone_number}</h1>
									<h1>Email: {person.email}</h1>
								</div>
							</div>
						</div>
					</div>)
				}
			</div>
		</div>
	);
};

export default All_Members;