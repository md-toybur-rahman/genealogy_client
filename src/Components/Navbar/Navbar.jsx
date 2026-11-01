import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser, FaSortDown } from 'react-icons/fa';
import { AuthContext } from '../../Providers/AuthProviders';

const Navbar = () => {
	const { user, profile, logOut, isProfile, setIsProfile, lan, setLan } = useContext(AuthContext);
	const navigate = useNavigate();
	const handleLogout = async () => {
		setIsProfile(false);
		await logOut();
	};

	return (
		<header className="w-full fixed top-0 left-0 min-h-[76px] bg_dark div-glow flex flex-wrap items-center justify-between gap-3 px-4 md:px-8 py-3 z-50">
			<Link to="/" className="flex items-center gap-2 shrink-0">
				<img className="w-12 h-12" src="chomor_uddin_logo.png" alt="" />
				<span className="text-glow english_font">Chomor Uddin<br />Hawladar</span>
			</Link>
			{user && <nav className="flex flex-wrap items-center justify-end gap-2 md:gap-3 text-sm">
				<Link to="/request-member" className="border border-teal-500 rounded-lg px-3 py-2">{!lan ? 'Request member' : 'সদস্য যোগের আবেদন'}</Link>
				<Link to="/all_users" className="border border-teal-500 rounded-lg px-3 py-2">{!lan ? 'Members' : 'সদস্যগণ'}</Link>
				<Link to="/comments" className="border border-teal-500 rounded-lg px-3 py-2">{!lan ? 'Comments' : 'মন্তব্য'}</Link>
				{profile?.user_type === 'admin' && <Link to="/admin" className="border border-teal-500 rounded-lg px-3 py-2">Admin</Link>}
				<button type="button" onClick={() => setLan(!lan)} className="border border-teal-500 rounded-lg px-3 py-2">{!lan ? 'বাংলা' : 'English'}</button>
				<button type="button" onClick={() => setIsProfile(!isProfile)} className="flex items-center gap-2" aria-expanded={isProfile} aria-label="Profile menu">
					{profile?.photoURL ? <img className="w-10 h-10 rounded-full object-cover" src={profile.photoURL} alt="" /> : <span className="w-10 h-10 rounded-full div-glow flex items-center justify-center"><FaRegUser /></span>}
					<FaSortDown className={`${isProfile ? 'rotate-180' : ''} duration-300`} />
				</button>
				{isProfile && <section className="absolute top-[72px] right-4 md:right-8 div-glow p-5 rounded-xl bg_dark w-72">
					<p className="text-xs text-teal-300 break-all">{user.email}</p>
					<p className="mt-3">{profile?.name} · {profile?.bangla_name}</p>
					<p className="mt-1">Father&apos;s name: {profile?.fathers_name}</p>
					<p className="mt-1">Mobile: {profile?.phone_number} ({profile?.phone_visibility})</p>
					<button onClick={() => { setIsProfile(false); navigate('/edit_profile'); }} className="border border-teal-500 rounded-lg px-4 py-2 mt-4 w-full">Edit profile</button>
					<button onClick={handleLogout} className="border border-teal-500 rounded-lg px-4 py-2 mt-2 w-full">Log out</button>
				</section>}
			</nav>}
		</header>
	);
};

export default Navbar;
