import React, { useContext, useEffect, useState } from 'react';
import Genealogy from '../Genealogy/Genealogy';
import { MdComment, MdOutlineClose } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { DNA, ThreeDots } from 'react-loader-spinner';
import { AuthContext } from '../../Providers/AuthProviders';


const Home = () => {
	const { user, googleSignIn, userDetectedLoading, lan, setLan } = useContext(AuthContext);
	// const [lan, setLan] = useState(false);
	const [loading, setLoading] = useState(true);
	const [genealogy, setGenealogy] = useState({});
	const [banglaGenealogy, setBanglaGenealogy] = useState({});
	const [currentUser, setCurrentUser] = useState([]);
	useEffect(() => {
		fetch(`https://genealogy-server.onrender.com/users`)
			.then(res => res.json())
			.then(data => {
				const findCurrentUser = data.filter(singleUser => singleUser.email == user.email);
				setCurrentUser(findCurrentUser);
			})
	}, [user]);
	useEffect(() => {
		setLoading(true);
		fetch('genealogy.json')
			.then(res => res.json())
			.then(data => {
				setGenealogy(data[0]);
				setLoading(false);
			})
	}, [])
	useEffect(() => {
		setLoading(true)
		fetch('genealogy_bangla.json')
			.then(res => res.json())
			.then(data => {
				setBanglaGenealogy(data[0]);
				setLoading(false);
			})
	}, []);

	const handleCommentBox = () => {
		const commentBox = document.getElementById('comment_box');
		if (commentBox.classList.contains('hidden')) {
			commentBox.classList.remove('hidden');
			commentBox.classList.add('flex');
		}
	}
	const handleCloseComment = () => {
		const commentBox = document.getElementById('comment_box');
		if (commentBox.classList.contains('flex')) {
			commentBox.classList.remove('flex');
			commentBox.classList.add('hidden');
		}
	}

	const handleCommentSubmit = event => {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;
		const number = form.number.value;
		const comment = form.comment.value;
		const date = new Date();
		const fullDate = date.toDateString()
		const time = date.toLocaleTimeString();

		const userComment = { name, number, comment, date: `${fullDate}`, time }

		fetch('https://genealogy-server.onrender.com/comments', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(userComment)
		})
			.then(res => res.json())
			.then(data => {
				form.reset();
				const alertBox = document.getElementById('alert_box');

				alertBox.classList.remove('hidden');
				alertBox.classList.add('flex');
				handleCloseComment();
				setTimeout(() => {
					alertBox.classList.remove('flex');
					alertBox.classList.add('hidden');
				}, 2000);
			});
	}

	return (
		<div className={`${!lan ? 'english_font' : 'bangla_font'}`}>
			{/* Alert */}
			<div id='alert_box' className={`fixed h-full w-full bg-black/40 z-30 hidden items-center justify-center px-5`}>
				<div className='w-[400px] h-fit py-10 bg_dark div-glow rounded-xl relative overflow-hidden flex flex-col gap-10 items-center justify-center'>
					<div className='w-[60px] h-[60px] flex items-center justify-center rounded-full div-glow'><IoCheckmarkDoneSharp className='checkmark text-teal-500' /> </div>
					<div>
						<h1>{!lan ? 'Message Submitted Successfully' : 'মন্তব্য সফলভাবে জমা দেওয়া হয়েছে'}</h1>
						{/* <h1>Sign Up Successfully</h1> */}
					</div>

				</div>
			</div>
			{/* Modal Comment Box */}
			<div id='comment_box' className={`fixed h-full w-full bg-black/40 z-20 hidden items-center justify-center px-5`}>
				<div className='w-[600px] h-fit py-5 bg_dark div-glow rounded-xl relative overflow-hidden flex items-center justify-center'>
					<div onClick={handleCloseComment} className='absolute right-4 top-4 w-fit p-2 cursor-pointer duration-300 text-2xl hover:text-teal-500'><MdOutlineClose /></div>
					<form onSubmit={handleCommentSubmit} className='h-[80%] w-[90%] md:w-[80%] mt-14'>
						<div className='flex flex-col md:grid grid-cols-6 gap-2 md:gap-5'>
							<label className='col-span-2'>{!lan ? 'Your Name :' : 'আপনার নাম :'}</label>
							<input name='name' className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1' type="text" />
						</div>
						<div className='flex flex-col md:grid grid-cols-6 gap-2 md:gap-5 mt-5'>
							<label className='col-span-2'>{!lan ? 'Mobile Number :' : 'মোবাইল নম্বর:'}</label>
							<input name='number' className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1' type="text" />
						</div>
						<div className='flex flex-col md:grid grid-cols-6 gap-2 md:gap-5 mt-5'>
							<label className='col-span-2'>{!lan ? 'Your Comment :' : 'আপনার মন্তব্য :'}</label>
							<textarea name='comment' rows={5} className='border border-teal-500 bg-transparent div-glow rounded-md flex-grow col-span-4 px-3 py-1 resize-none' type="text" />
						</div>
						<div className='flex items-center justify-center mt-6'>
							<input type='submit' className='border border-teal-500 bg-transparent div-glow rounded-md px-5 py-1 font-semibold duration-300 hover:text-teal-500' value={!lan ? 'Submit' : 'জমা দিন'} />
						</div>
					</form>
				</div>
			</div>
			<div className="min-h-screen flex items-center justify-center bg_dark pt-20">
				<div className="flex justify-center">
					<div className="">
						
						<button onClick={handleCommentBox} className={`cursor-pointer bg-transparent div-glow text-glow w-fit p-4 rounded-full shadow-lg ${user ? 'fixed' : 'hidden'} bottom-3 right-4 lg:bottom-10 lg:right-20 bg_dark`}><MdComment className='text-2xl' /></button>

						<div className='flex flex-col items-center gap-5 mt-12 md:mt-20'>
							{
								loading && userDetectedLoading ?
									<div className='flex flex-col items-center'>
										<DNA
											visible={true}
											height="80"
											width="80"
											ariaLabel="dna-loading"
											wrapperStyle={{}}
											wrapperClass="dna-wrapper"
										/>
										<h1 className='text-xl'>এক্কানা খাড়ান</h1>
									</div> :
									<Genealogy data={!lan ? genealogy : banglaGenealogy} language={!lan ? 'English' : "Bangla"}></Genealogy>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default Home;