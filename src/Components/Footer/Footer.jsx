import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const Footer = () => (
	<footer className="bg-[#080821] border-t border-teal-500/40 px-4 sm:px-6 py-8 sm:py-10">
		<div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 sm:items-center">
			<div>
				<p className="text-teal-300 text-sm">প্রধান পরিচালকের সাথে যোগাযোগ</p>
				<h2 className="text-lg sm:text-xl font-semibold mt-1">তৌয়বুর রহমান তুহিন</h2>
				<p className="mt-1 text-sm sm:text-base opacity-80">পিতার নাম: মোঃ আলী হোসেন</p>
			</div>
			<div className="flex flex-col sm:items-end gap-3">
				<a href="tel:+8801773345189" className="inline-flex items-center gap-3 min-h-11 w-fit text-teal-200 hover:text-white"><FaPhoneAlt aria-hidden="true" /><span>০১৭৭৩৩৪৫১৮৯</span></a>
				<a href="https://wa.me/8801773345189" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 min-h-11 w-fit text-teal-200 hover:text-white"><FaWhatsapp aria-hidden="true" /><span>WhatsApp-এ যোগাযোগ করুন</span></a>
			</div>
		</div>
	</footer>
);

export default Footer;
