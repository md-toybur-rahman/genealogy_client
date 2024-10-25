import React, { useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import AuthProviders from '../../Providers/AuthProviders';

const Layout = () => {
	// const {lan, setLan} = useContext(AuthProviders)
	return (
		<div>
			<Navbar></Navbar>
			<Outlet></Outlet>
		</div>
	);
};

export default Layout;