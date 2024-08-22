import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
	HiAnnotation,
	HiArrowNarrowUp,
	HiDocumentText,
	HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardComp = () => {
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const [comments, setComments] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalPosts, setTotalPosts] = useState(0);
	const [totalComments, setTotalComments] = useState(0);
	const [lastMonthUsers, setLastMonthUsers] = useState(0);
	const [lastMonthPosts, setLastMonthPosts] = useState(0);
	const [lastMonthComments, setLastMonthComments] = useState(0);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("/api/user/getusers?limit=5");
				const data = await res.json();
				if (res.ok) {
					setUsers(data.users);
					setTotalUsers(data.totalUsers);
					setLastMonthUsers(data.lastMonthUsers);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		const fetchPosts = async () => {
			try {
				const res = await fetch("/api/post/getposts?limit=5");
				const data = await res.json();
				if (res.ok) {
					setPosts(data.posts);
					setTotalPosts(data.totalPosts);
					setLastMonthPosts(data.lastMonthPosts);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		const fetchComments = async () => {
			try {
				const res = await fetch("/api/comment/get-comments?limit=5");
				const data = await res.json();
				if (res.ok) {
					setComments(data.comments);
					setTotalComments(data.totalComments);
					setLastMonthComments(data.lastMonthComments);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		if (currentUser.isAdmin) {
			fetchUsers();
			fetchPosts();
			fetchComments();
		}
	}, [currentUser]);

	return (
		<div
			className="w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			<div className="flex flex-wrap gap-4 justify-center mt-5 sm:mt-10">
				<div
					className="flex flex-col p-3 gap-4 md:w-72 w-full mx-3 sm:mx-0 dark:shadow-whiteLg
                        bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
					<div className="flex justify-between">
						<div>
							<h3 className="text-gray-500 text-md uppercase">Total Users</h3>
							<p className="text-2xl">{totalUsers}</p>
						</div>
						<HiOutlineUserGroup
							className="bg-teal-600 text-white 
                            rounded-full text-5xl p-3 shadow-lg"
						/>
					</div>
					<div className="flex gap-2 text-sm">
						<span className="text-green-500 flex items-center">
							<HiArrowNarrowUp />
							{lastMonthUsers}
						</span>
						<span className="text-gray-500">Last Month</span>
					</div>
				</div>
				<div
					className="flex flex-col p-3 gap-4 md:w-72 w-full mx-3 sm:mx-0 dark:shadow-whiteLg
                        bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
					<div className="flex justify-between">
						<div>
							<h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
							<p className="text-2xl">{totalPosts}</p>
						</div>
						<HiDocumentText
							className="bg-lime-600 text-white 
                            rounded-full text-5xl p-3 shadow-lg"
						/>
					</div>
					<div className="flex gap-2 text-sm">
						<span className="text-green-500 flex items-center">
							<HiArrowNarrowUp />
							{lastMonthPosts}
						</span>
						<span className="text-gray-500">Last Month</span>
					</div>
				</div>
				<div
					className="flex flex-col p-3 gap-4 md:w-72 w-full mx-3 sm:mx-0 dark:shadow-whiteLg
                    bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
					<div className="flex justify-between">
						<div>
							<h3 className="text-gray-500 text-md uppercase">
								Total Comments
							</h3>
							<p className="text-2xl">{totalComments}</p>
						</div>
						<HiAnnotation
							className="bg-indigo-600 text-white 
                            rounded-full text-5xl p-3 shadow-lg"
						/>
					</div>
					<div className="flex gap-2 text-sm">
						<span className="text-green-500 flex items-center">
							<HiArrowNarrowUp />
							{lastMonthComments}
						</span>
						<span className="text-gray-500">Last Month</span>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-4 py-3 mx-auto justify-center items-start my-5">
				{users && (
					<div
						className="flex flex-col w-full md:w-auto p-3 mx-3 sm:mx-0 dark:shadow-whiteLg
                            bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
						<div className="flex justify-between p-3 text-sm font-semibold">
							<h1 className="text-center p-2">Recent Users</h1>
							<Button outline gradientDuoTone="purpleToBlue" className="w-24">
								<Link to={"/dashboard?tab=users"}>Show all</Link>
							</Button>
						</div>
						<Table
							hoverable
							className="bg-transparent border-2 border-white/20 rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className="sticky top-[64px] md:top-[68px]">
								<Table.HeadCell>Image</Table.HeadCell>
								<Table.HeadCell>Username</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{users.map((user) => (
									<Table.Row key={user._id} className="border border-gray-400">
										<Table.Cell className="w-24">
											<img
												src={user.profilePicture}
												alt="user"
												className="w-10 h-10 rounded-full bg-gray-500 object-cover"
											/>
										</Table.Cell>
										<Table.Cell>{user.username}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				)}
				{posts && (
					<div
						className="flex flex-col w-full md:w-auto p-3 mx-3 sm:mx-0 dark:shadow-whiteLg
                            bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
						<div className="flex justify-between p-3 text-sm font-semibold">
							<h1 className="text-center p-2">Recent Posts</h1>
							<Button outline gradientDuoTone="purpleToBlue" className="w-24">
								<Link to={"/dashboard?tab=posts"}>Show all</Link>
							</Button>
						</div>
						<Table
							hoverable
							className="bg-transparent border-2 border-white/20 rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className="sticky top-[64px] md:top-[68px]">
								<Table.HeadCell>Post Image</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								<Table.HeadCell>Likes</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{posts.map((post) => (
									<Table.Row key={post._id} className="border border-gray-400">
										<Table.Cell className="w-32">
											<img
												src={post.image}
												alt="post"
												className="w-20 h-10 rounded-md bg-gray-500 object-cover"
											/>
										</Table.Cell>
										<Table.Cell className="w-56">{post.title}</Table.Cell>
										<Table.Cell className="w-20">
											{post.numberOfLikes}
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				)}
				{comments && (
					<div
						className="flex flex-col w-full md:w-auto p-3 mx-3 sm:mx-0 dark:shadow-whiteLg
                            bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
						<div className="flex justify-between p-3 text-sm font-semibold">
							<h1 className="text-center p-2">Recent Comments</h1>
							<Button outline gradientDuoTone="purpleToBlue" className="w-24">
								<Link to={"/dashboard?tab=comments"}>Show all</Link>
							</Button>
						</div>
						<Table
							hoverable
							className="bg-transparent border-2 border-white/20 rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className="sticky top-[64px] md:top-[68px]">
								<Table.HeadCell>Comment Content</Table.HeadCell>
								<Table.HeadCell>Likes</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{comments.map((comment) => (
									<Table.Row
										key={comment._id}
										className="border border-gray-400">
										<Table.Cell className="w-52">
											<p className="line-clamp-2">{comment.content}</p>
										</Table.Cell>
										<Table.Cell className="w-20">
											{comment.numberOfLikes}
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardComp;
