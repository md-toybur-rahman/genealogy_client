import React, { useState } from 'react';

const Genealogy = ({ data, language }) => {
	const [showChildren, setShowChildren] = useState(false);
	const [isBorder, setIsBorder] = useState(false);

	const toggleChildren = () => {
		setShowChildren(!showChildren);
		setIsBorder(!isBorder);
	};
	// console.log('ছমর উদ্দিন হাওলাদার' == 'ছমর উদ্দিন হাওলাদার')
	return (
		<div className="p-2 flex flex-col lg:flex-row items-center gap-3">
			<div
				onClick={toggleChildren}
				className="cursor-pointer flex flex-col lg:flex-row gap-3 items-center"
			>
				<div className={`p-2 bg-blue-200 rounded-md ${data.children ? 'hover:bg-blue-300' : ''}`}>
					<div className=''>{data.name}</div>
					{data.name == 'Chomor Uddin Hawladar' ?
						<div className={`${language == "English" ? 'block' : 'hidden'} rounded-md`}>
							<h1>Brother's Name: Rohim Uddin</h1>
							<h1>Father's Name: Fokir Mahmud (Chowkidar)</h1>
							<h1>Evidence of Information: C.S. Khatiyan No: 26 and 23</h1>
						</div> : ''
					}
					{data.name == 'ছমর উদ্দিন হাওলাদার' ?
						<div className={`${language == "Bangla" ? 'block' : 'hidden'} rounded-md`}>
							<h1>ভাইয়ের নামঃ রহিম উদ্দিন</h1>
							<h1>পিতার নামঃ ফকির মাহমুদ (চৌকিদার)</h1>
							<h1>তথ্যের প্রমাণ: C.S খতিয়ান নং: 26 এবং 23</h1>
						</div> : ''
					}
				</div>
				{/* <div className={`p-2 bg-blue-200 rounded-md ${data.children ? 'hover:bg-blue-300' : ''}`}>
					{data.name == 'ছমর উদ্দিন হাওলাদার' ?
						<div className={`p-2 bg-blue-200 ${language == "Bangla" ? 'block' : 'hidden'} rounded-md`}>
							<h1>নাম: ছমর উদ্দিন হাওলাদার</h1>
							<h1>ভাইয়ের নামঃ রহিম উদ্দিন</h1>
							<h1>পিতার নামঃ ফকির মাহমুদ (চৌকিদার)</h1>
							<h1>তথ্যের প্রমাণ: C.S খতিয়ান নং: 26 এবং 23</h1>
						</div> : <div>{data.name}</div>
					}
				</div> */}
				{data.children ? <span><span className='hidden lg:block'>├┬┴┬┴</span> <span className='lg:hidden'>🔻</span></span> : ''}
			</div>
			<div className={`${data.children && isBorder ? 'border border-red-500' : ''} flex items-center duration-500`}>
				{showChildren && (
					<div className="ml-4 mt-2">
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