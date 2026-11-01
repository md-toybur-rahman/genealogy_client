import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
	return (
		<div>
			<Navbar></Navbar>
			<Outlet></Outlet>
		</div>
	);
};

export default Layout;
