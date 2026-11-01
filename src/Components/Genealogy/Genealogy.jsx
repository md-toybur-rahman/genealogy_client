/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaArrowDown, FaAngleDoubleRight, FaRegEdit, FaRegImage } from 'react-icons/fa';

const Genealogy = ({ data, language, profiles = [], path = [], fatherName = '', onShowPhoto, onRequestCorrection, expandedPaths = [], highlightedPath = null }) => {
	const [showChildren, setShowChildren] = useState(false);
	const children = Array.isArray(data?.children) ? data.children : [];
	const person = profiles.find(item => item.family_member_id && item.family_member_id === data.familyMemberId);
	const photoURL = person?.photoURL || data.photoURL;
	const canExpand = children.length > 0;
	const isExpanded = showChildren || expandedPaths.some(item => item.join('.') === path.join('.'));
	const isHighlighted = highlightedPath?.join('.') === path.join('.');

	return (
		<div data-genealogy-path={path.join('.')} className={`p-1 lg:p-2 flex flex-col lg:flex-row items-center gap-3 text-sm lg:text-base ${isHighlighted ? 'rounded-xl ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}`}>
			<div className="flex items-center gap-2">
				<button type="button" onClick={() => setShowChildren(!isExpanded)} disabled={!canExpand} className="cursor-pointer flex flex-col lg:flex-row gap-3 items-center disabled:cursor-default">
					<div className={`px-1 lg:px-4 py-1 bg-transparent border border-teal-500 transition-shadow duration-200 shadow-md shadow-teal-500 rounded-md ${canExpand ? 'hover:text-teal-500' : ''}`}>{data.name}</div>
					{canExpand && <span><span className="hidden lg:flex items-center text-glow"><FaAngleDoubleRight /><FaAngleDoubleRight /></span><span className="lg:hidden"><FaArrowDown className="text-xl text-glow" /></span></span>}
				</button>
				{photoURL && <button type="button" aria-label={`${data.name} profile photo`} title="View profile photo" onClick={() => onShowPhoto?.({ ...person, name: data.name, photoURL })} className="text-teal-300 hover:text-teal-100 p-1"><FaRegImage /></button>}
				<button type="button" aria-label={`Request name correction for ${data.name}`} title="নাম সংশোধনের request" onClick={() => onRequestCorrection?.({ language: language === 'Bangla' ? 'bangla' : 'english', targetPath: path, currentName: data.name, fatherName })} className="text-teal-300 hover:text-teal-100 p-1"><FaRegEdit /></button>
			</div>
			{isExpanded && canExpand && <div className="mx-2 lg:mx-4 my-4 div-glow rounded-lg p-1">
				{children.map((child, index) => <div key={`${path.join('.')}-${index}`} className="flex lg:items-center">
					<h2 className="pt-4">{index + 1}.</h2>
					<Genealogy data={child} language={language} profiles={profiles} path={[...path, index]} fatherName={data.name} onShowPhoto={onShowPhoto} onRequestCorrection={onRequestCorrection} expandedPaths={expandedPaths} highlightedPath={highlightedPath} />
				</div>)}
			</div>}
		</div>
	);
};

export default Genealogy;
