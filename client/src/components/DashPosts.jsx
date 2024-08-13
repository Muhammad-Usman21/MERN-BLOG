import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	return (
		<div
			className="p-10 w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			<div
				className="overflow-x-scroll p-3
				scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
				 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500
				 bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-lg">
				{currentUser.isAdmin && userPosts.length > 0 ? (
					<>
						<Table hoverable className="shadow-md">
							<Table.Head>
								<Table.HeadCell>Date updated</Table.HeadCell>
								<Table.HeadCell>Post Image</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								<Table.HeadCell>Category</Table.HeadCell>
								<Table.HeadCell>Delete</Table.HeadCell>
								<Table.HeadCell>
									<span>Edit</span>
								</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{userPosts.map((post) => (
									<Table.Row key={post._id} className="border border-gray-400">
										<Table.Cell>
											{new Date(post.updatedAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell>
											<Link to={`/post/${post.slug}`}>
												<img
													src={post.image}
													alt={post.title}
													className="w-20 h-10 object-cover bg-gray-500"
												/>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<Link to={`/post/${post.slug}`}>
												<span className="font-medium text-gray-900 dark:text-gray-300">
													{post.title}
												</span>
											</Link>
										</Table.Cell>
										<Table.Cell>{post.category}</Table.Cell>
										<Table.Cell>
											<span className="font-medium text-red-500 hover:cursor-pointer">
												Delete
											</span>
										</Table.Cell>
										<Table.Cell>
											<Link to={`/update-post/${post._id}`}>
												<span className="text-teal-500">Edit</span>
											</Link>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</>
				) : (
					<p>You have no posts yet</p>
				)}
			</div>
		</div>
	);
};

export default DashPosts;
