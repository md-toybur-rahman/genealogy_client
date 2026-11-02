import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Layout = () => {
	return (
		<div className="min-h-screen flex flex-col overflow-x-clip">
			<Navbar />
			<div className="flex-1"><Outlet /></div>
		</div>
	);
};

export default Layout;
