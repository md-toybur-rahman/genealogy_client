import React, { useState } from 'react';
import { FaArrowDown, FaAngleDoubleRight } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';

const Genealogy = ({ data, language, loading }) => {
	const [showChildren, setShowChildren] = useState(false);
	const [isBorder, setIsBorder] = useState(false);

	const toggleChildren = () => {
		setShowChildren(!showChildren);
		setIsBorder(!isBorder);
	};
	return (
		<div className="p-1 lg:p-2 flex flex-col lg:flex-row items-center gap-3 text-sm lg:text-base">
			<button
				onClick={toggleChildren}
				disabled={data.children ? false : true}
				className="cursor-pointer flex flex-col lg:flex-row gap-3 items-center"
			>
				<div className={`px-1 lg:px-4 py-1 cursor-pointer bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 rounded-md ${data.children ? 'hover:text-teal-500' : ''}`}>
					<div className=''>{loading ? <ThreeDots
						visible={true}
						height="20"
						width="30"
						color="#4fa94d"
						radius="9"
						ariaLabel="three-dots-loading"
						wrapperStyle={{}}
						wrapperClass=""
					/> : data.name}</div>
				</div>
				{data.children ? <span><span className='hidden lg:flex items-center text-glow'><FaAngleDoubleRight /><FaAngleDoubleRight /></span> <span className='lg:hidden'><FaArrowDown className='text-xl text-glow' /></span></span> : ''}
			</button>
			<div className={`${data.children && isBorder ? 'div-glow rounded-lg' : ''} flex items-center duration-500`}>
				{showChildren && (
					<div className="mx-2 lg:mx-4 my-4">
						{data.children.length > 0 && data.children.map((child, index) => (
							<div className='flex lg:items-center'>
								<h1 className='pt-4'>{index + 1}.</h1>
								<Genealogy key={index} data={child} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Genealogy;