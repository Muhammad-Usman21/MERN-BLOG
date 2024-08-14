import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
					if (data.posts.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(
				`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeletePostSubmit = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserPosts((prevPosts) =>
					prevPosts.filter((post) => post._id !== postIdToDelete)
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div
			className="flex p-10 w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg-dark.jpg')]">
			<div
				className="overflow-x-scroll p-3 xl:overflow-visible
				scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
				 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500
				 bg-transparent border-2 border-white/20 rounded-lg shadow-lg">
				{currentUser.isAdmin && userPosts.length > 0 ? (
					<>
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg">
							<Table.Head className=" xl:sticky xl:top-[68px]">
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
											<span
												onClick={() => {
													setShowModal(true);
													setPostIdToDelete(post._id);
												}}
												className="font-medium text-red-500 hover:cursor-pointer">
												Delete
											</span>
										</Table.Cell>
										<Table.Cell>
											<Link to={`/update-post/${post._id}`}>
												<span className="text-teal-500 dark:text-gray-400">
													Edit
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
									className="text-teal-500 dark:text-gray-400 mx-auto text-sm py-4">
									Show more
								</button>
							</div>
						)}
					</>
				) : (
					<p>You have no posts yet</p>
				)}
			</div>

			<Modal
				show={showModal}
				onClose={() => {
					setShowModal(false);
				}}
				popup
				size="lg">
				<Modal.Header />
				<Modal.Body>
					<form
						className="flex flex-col text-center"
						onSubmit={handleDeletePostSubmit}>
						<div className="flex items-center mb-8 gap-8 self-center">
							<HiOutlineExclamationCircle
								className="h-14 w-14 text-gray-400 dark:text-gray-200 
							dark:bg-black"
							/>
							<span className="text-2xl text-gray-500 dark:text-gray-300">
								Delete Post
							</span>
						</div>
						<h3 className="my-5 text-lg text-gray-500 dark:text-gray-300">
							Are you sure you want to delete this Post?
						</h3>
						<div className="flex justify-around">
							<Button type="submit" color="failure" className="focus:ring-1">
								{"Yes, i'm sure"}
							</Button>
							<Button
								type="button"
								color="gray"
								onClick={() => setShowModal(false)}
								className="focus:ring-1">
								No, cancel
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default DashPosts;
