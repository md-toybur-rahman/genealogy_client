import React from 'react';

const Navbar = (props) => {
	return (
		<div className='w-full fixed top-0 left-0 py-5 bg_dark div-glow flex items-center justify-between px-5 md:px-10'>
			<h1 className='cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 w-fit px-2 lg:px-4 py-1 rounded-lg text-sm md:text-base'>Last Update: 28/07/24</h1>

			<h1 onClick={() => { props.setLan(!props.lan) }} className='cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 w-fit px-2 lg:px-4 py-1 rounded-lg  text-sm md:text-base'>{!props.lan ? 'বাংলা' : 'English'}</h1>
		</div>
	);
};

export default Navbar;