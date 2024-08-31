import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const ProfilePosts = () => {
	const { userId } = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [getPostsLoading, setGetPostsLoading] = useState(true);
	const [userData, setUserData] = useState({});

	// console.log(userPosts);
	// console.log(userData);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await fetch(`/api/user/getuser/${userId}`);
				const data = await res.json();
				if (res.ok) {
					setUserData(data);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchUserData();
	}, [userId]);

	useEffect(() => {
		setGetPostsLoading(true);
		const fetchPosts = async () => {
			try {
				if (userData) {
					const res = await fetch(
						`/api/post/getposts-public?userId=${userId}&limit=10`
					);
					const data = await res.json();
					if (res.ok) {
						setUserPosts(data);
						if (data?.length < 10) {
							setShowMore(false);
						}
						setGetPostsLoading(false);
					}
				}
			} catch (error) {
				console.log(error.message);
				setGetPostsLoading(false);
			}
		};

		if (currentUser) {
			fetchPosts();
		}
	}, [userData?._id]);

	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(
				`/api/post/getposts-public?userId=${userId}&startIndex=${startIndex}&limit=10`
			);
			const data = await res.json();
			if (res.ok) {
				setUserPosts((prevPosts) => [...prevPosts, ...data]);
				if (data.length < 10) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div>
			{getPostsLoading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : !getPostsLoading && currentUser && userPosts.length > 0 ? (
				<>
					<div
						className="overflow-x-scroll p-4 lg:overflow-visible md:max-w-md lg:max-w-6xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:shadow-whiteLg
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className=" lg:sticky lg:top-[175px]">
								<Table.HeadCell>Date created</Table.HeadCell>
								<Table.HeadCell>Post Image</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								<Table.HeadCell>Number of Likes</Table.HeadCell>
								<Table.HeadCell>Category</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{userPosts.map((post) => (
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
												<span className="text-gray-900 dark:text-gray-300 font-semibold">
													{post.title}
												</span>
											</Link>
										</Table.Cell>
										<Table.Cell>{post.numberOfLikes}</Table.Cell>
										<Table.Cell>{post.category}</Table.Cell>
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
				!getPostsLoading &&
				userData &&
				userPosts.length === 0 && (
					<div
						className="max-w-xl w-full mx-auto bg-transparent border-2 mt-10 dark:shadow-whiteLg
					border-white/40 dark:border-white/20 rounded-lg shadow-lg backdrop-blur-[9px]">
						<p className="p-10 text-center">This user has no posts yet</p>
					</div>
				)
			)}
		</div>
	);
};

export default ProfilePosts;
