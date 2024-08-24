import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
	const { currentUser } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.theme);
	const [posts, setPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [getPostsLoading, setGetPostsLoading] = useState(false);
	const [userDetails, setUserDetails] = useState({});

	useEffect(() => {
		setGetPostsLoading(true);
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?limit=10`);
				const data = await res.json();
				if (res.ok) {
					setPosts(data.posts);
					if (data.posts.length < 10) {
						setShowMore(false);
					}
					setGetPostsLoading(false);
				}
			} catch (error) {
				console.log(error.message);
				setGetPostsLoading(false);
			}
		};

		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = posts.length;
		try {
			const res = await fetch(
				`/api/post/getposts?startIndex=${startIndex}&limit=10`
			);
			const data = await res.json();
			if (res.ok) {
				setPosts((prevPosts) => [...prevPosts, ...data.posts]);
				if (data.posts.length < 10) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const getPostUser = async (userId) => {
		if (!userDetails[userId]) {
			try {
				const res = await fetch(`/api/user/getuser/${userId}`);
				const data = await res.json();
				if (res.ok) {
					setUserDetails((prevState) => ({
						...prevState,
						[userId]: data,
					}));
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		}
	};

	useEffect(() => {
		posts.forEach((post) => {
			getPostUser(post.userId);
		});
	}, [posts]);

	return (
		<div
			className="p-5 w-full bg-cover bg-center min-h-screen
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			{getPostsLoading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : currentUser.isAdmin && posts.length > 0 ? (
				<>
					<div
						className="overflow-x-scroll p-4 xl:overflow-visible md:max-w-md lg:max-w-5xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:shadow-whiteLg
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className=" xl:sticky xl:top-[68px]">
								<Table.HeadCell>Date created</Table.HeadCell>
								<Table.HeadCell>Post Image</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								<Table.HeadCell>Number of Likes</Table.HeadCell>
								<Table.HeadCell>Category</Table.HeadCell>
								<Table.HeadCell>Username</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{posts.map((post) => (
									<Table.Row key={post._id} className="border border-gray-400">
										<Table.Cell>
											{new Date(post.createdAt).toLocaleDateString()}
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
												<span
													className={`text-gray-900 dark:text-gray-300 ${
														currentUser._id === post.userId && "font-semibold"
													}`}>
													{post.title}
												</span>
											</Link>
										</Table.Cell>
										<Table.Cell>{post.numberOfLikes}</Table.Cell>
										<Table.Cell>{post.category}</Table.Cell>
										<Table.Cell>
											<Link
												to={`/profile/${
													userDetails[post.userId]?._id
												}?tab=user`}>
												<span
													className={`text-gray-900 dark:text-gray-300 ${
														currentUser._id === post.userId && "font-medium"
													}`}>
													{userDetails[post.userId]?.username}
												</span>
											</Link>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						{showMore && (
							<div className="flex w-full">
								<button
									onClick={handleShowMore}
									className="text-teal-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 mx-auto text-sm py-4">
									Show more
								</button>
							</div>
						)}
					</div>
				</>
			) : (
				<div
					className="max-w-xl w-full mx-auto bg-transparent border-2 mt-10 dark:shadow-whiteLg
				border-white/40 dark:border-white/20 rounded-lg shadow-lg backdrop-blur-[9px]">
					<p className="p-10 text-center">No posts yet</p>
				</div>
			)}
		</div>
	);
};

export default DashPosts;
