import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { apiFetch } from '../../config/api';

const Comments = () => {
	const { user, profile } = useContext(AuthContext);
	const [comments, setComments] = useState([]);
	useEffect(() => {
		apiFetch(user, '/comments')
			.then(data => { setComments(data) })
	}, [user]);

	const handleDone = (id) => {
		console.log(id)
	}
	return (
		<div className='bg_dark min-h-[100vh] w-full english_font px-10'>
			<div className='pt-10'>
				<h1 className='text-2xl lg:text-3xl text-center'>All Comments</h1>
			</div>
			<div className='grid lg:grid-cols-2 gap-4 lg:gap-10'>
				{
					comments.map(comment => <div key={comment._id}>
						<div className='w-full div-glow text-lg p-3 overflow-y-scroll comment_card mt-10 rounded-xl flex flex-col'>
							<div className='lg:flex gap-10'>
								<div className='lg:border-r-2 pr-10'>
									<h1>Name : {comment.name}</h1>
									<h1>Phone number : {comment.number}</h1>
									<h1>Date: {comment.date}</h1>
									<h1>Time: {comment.time}</h1>
								</div>
								<div>
									<h1>Comment : {comment.comment}</h1>
								</div>
							</div>
							{
								profile?.user_type === 'admin' ?
									<div onClick={() => handleDone(comment._id)} className='flex-grow flex items-end justify-center mt-8'>
										<button className='border border-teal-500 div-glow px-5 py-1 rounded-lg'>Done</button>
									</div> : ''
							}
						</div>
					</div>)
				}
			</div>

		</div>
	);
};

export default Comments;
