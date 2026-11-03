import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser, FaSortDown, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../Providers/AuthProviders';

const Navbar = () => {
	const { user, profile, logOut, isProfile, setIsProfile, lan, setLan } = useContext(AuthContext);
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const handleLogout = async () => {
		setIsProfile(false);
		setMenuOpen(false);
		await logOut();
	};

	return (
		<header className="w-full fixed top-0 left-0 bg_dark div-glow px-3 sm:px-5 lg:px-8 py-2 sm:py-3 z-50">
			<div className="max-w-screen-2xl mx-auto flex min-h-12 items-center justify-between gap-2">
				<Link to="/" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-2">
					<img className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" src="chomor_uddin_logo.png" alt="" />
					{
						!lan ?
							<span className="text-glow english_font text-xs sm:text-sm leading-tight">Chomor Uddin<br />Hawladar</span> :
							<span className="text-glow english_font text-xs sm:text-sm leading-tight">ছমর উদ্দিন<br />হাওলাদার</span>

					}
				</Link>
				{user && <div className="flex md:hidden items-center gap-2">
					<button type="button" onClick={() => setIsProfile(!isProfile)} className="flex items-center gap-1.5" aria-expanded={isProfile} aria-label="Profile menu">
						{profile?.photoURL ? <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" src={profile.photoURL} alt="" /> : <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full div-glow flex items-center justify-center"><FaRegUser /></span>}
						<FaSortDown className={`${isProfile ? 'rotate-180' : ''} duration-300`} />
					</button>
					<button type="button" onClick={() => setMenuOpen(open => !open)} className="md:hidden w-10 h-10 flex items-center justify-center border border-teal-500 rounded-lg" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <FaTimes /> : <FaBars />}</button>
				</div>}
				{user && <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-full left-3 right-3 md:left-auto md:right-auto md:ml-auto flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-2 lg:gap-3 p-3 md:p-0 rounded-xl md:rounded-none border border-teal-500/60 md:border-0 bg_dark md:bg-transparent text-sm shadow-xl md:shadow-none`}>
					<Link onClick={() => setMenuOpen(false)} to="/request-member" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">{!lan ? 'Request member' : 'সদস্য যোগের আবেদন'}</Link>
					{profile?.user_type === 'admin' && <Link onClick={() => setMenuOpen(false)} to="/all_users" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">{!lan ? 'Members' : 'সদস্যগণ'}</Link>}
					<Link onClick={() => setMenuOpen(false)} to="/family-photos" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">{!lan ? 'Family Photo' : 'পারিবারিক ছবি'}</Link>
					{profile?.user_type === 'admin' && <Link onClick={() => setMenuOpen(false)} to="/comments" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">{!lan ? 'Comments' : 'মন্তব্য'}</Link>}
					{profile?.user_type === 'admin' && <Link onClick={() => setMenuOpen(false)} to="/admin" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">Admin</Link>}
					<button type="button" onClick={() => setLan(!lan)} className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">{!lan ? 'বাংলা' : 'English'}</button>
					<a href='https://youtu.be/ugQ7H-xEVSU' to="/family-photos" className="border border-teal-500 rounded-lg px-3 py-2.5 md:py-2">{!lan ? 'Tutorial' : 'টিউটোরিয়াল'}</a>
					<div role="note" className="sm:hidden w-full rounded-xl border border-teal-500/60 bg-slate-950/80 px-4 py-3 text-center text-sm sm:text-base leading-relaxed">
						{lan ? 'আপনার ছবি যুক্ত না থাকলে নিজের নামের পাশের ছবি আইকনে চাপ দিয়ে ছবি যুক্তির আবেদন করুন। অন্য কোনো সদস্যের ছবি আপনার কাছে থাকলে তাঁর নামের পাশের আইকন থেকেও ছবি পাঠাতে পারেন। Admin অনুমোদন করলে ছবিটি tree-তে যুক্ত বা পরিবর্তন হবে।' : 'If your photo is missing, use the image icon beside your name to request an upload. If you have a photo of another member, you can submit it from the icon beside their name too. The photo appears in the tree after admin approval.'}
					</div>
					{user && <div className="hidden md:flex items-center gap-2">
						<button type="button" onClick={() => setIsProfile(!isProfile)} className="flex items-center gap-1.5" aria-expanded={isProfile} aria-label="Profile menu">
							{profile?.photoURL ? <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" src={profile.photoURL} alt="" /> : <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full div-glow flex items-center justify-center"><FaRegUser /></span>}
							<FaSortDown className={`${isProfile ? 'rotate-180' : ''} duration-300`} />
						</button>
						<button type="button" onClick={() => setMenuOpen(open => !open)} className="md:hidden w-10 h-10 flex items-center justify-center border border-teal-500 rounded-lg" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <FaTimes /> : <FaBars />}</button>
					</div>}
				</nav>}
				{user && isProfile && <section className="absolute top-full right-2 sm:right-4 md:right-8 mt-2 div-glow p-4 sm:p-5 rounded-xl bg_dark w-[min(20rem,calc(100vw-1rem))] max-h-[75dvh] overflow-y-auto">
					<p className="text-xs text-teal-300 break-all">{user.email}</p>
					<p className="mt-3 break-words">{profile?.name} · {profile?.bangla_name}</p>
					<p className="mt-1 break-words">Father&apos;s name: {profile?.fathers_name}</p>
					<p className="mt-1 break-words">Mobile: {profile?.phone_number} ({profile?.phone_visibility})</p>
					<button onClick={() => { setIsProfile(false); navigate('/edit_profile'); }} className="border border-teal-500 rounded-lg px-4 py-2 mt-4 w-full min-h-11">Edit profile</button>
					<button onClick={handleLogout} className="border border-teal-500 rounded-lg px-4 py-2 mt-2 w-full min-h-11">Log out</button>
				</section>}
			</div>
		</header>
	);
};

export default Navbar;
