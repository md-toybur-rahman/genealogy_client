import React, { useEffect, useState } from 'react';
import Genealogy from '../Genealogy/Genealogy';
import { MdComment, MdOutlineClose } from "react-icons/md";
import Navbar from '../Navbar/Navbar';

const Home = () => {
	const [lan, setLan] = useState(false);
	const [loading, setLoading] = useState(true);
	const [genealogy, setGenealogy] = useState({});
	const [banglaGenealogy, setBanglaGenealogy] = useState({});
	useEffect(() => {
		setLoading(true);
		fetch('https://genealogy-server.vercel.app/genealogy_english')
			.then(res => res.json())
			.then(data => {
				setGenealogy(data[0]);
				setLoading(false);
			})
	}, [])
	useEffect(() => {
		setLoading(true)
		fetch('https://genealogy-server.vercel.app/genealogy_bangla')
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

		const userComment = { name, number, comment, date: date.toString() }
		console.log(userComment);
		fetch('http://localhost:2000/comments', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(userComment)
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				form.reset();
			});
	}

	return (
		<div className={`${!lan ? 'english_font' : 'bangla_font'}`}>
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
			<div className="min-h-screen flex items-center justify-center bg_dark pt-10">
				<div className="flex justify-center">
					<div className="">
						{/* <h1 className='cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 w-fit px-2 lg:px-4 py-1 rounded-lg fixed top-3 left-4 lg:top-10 lg:left-20 bg_dark text-sm md:text-base'>Last Update: 28/07/24</h1>

						<h1 onClick={() => { setLan(!lan) }} className='cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 w-fit px-2 lg:px-4 py-1 rounded-lg fixed top-3 right-4 lg:top-10 lg:right-20 bg_dark text-sm md:text-base'>{!lan ? 'বাংলা' : 'English'}</h1> */}
						<Navbar lan={lan} setLan={setLan}></Navbar>
						<button onClick={handleCommentBox} className='cursor-pointer bg-transparent div-glow text-glow w-fit p-4 rounded-full shadow-lg fixed bottom-3 right-4 lg:bottom-10 lg:right-20 bg_dark'><MdComment className='text-2xl' /></button>

						<div className='flex flex-col items-center gap-5 mt-12 md:mt-20'>
							<Genealogy data={!lan ? genealogy : banglaGenealogy} language={!lan ? 'English' : "Bangla"} loading={loading}></Genealogy>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default Home;