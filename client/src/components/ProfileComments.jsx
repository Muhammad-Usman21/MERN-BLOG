import { Alert, Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { MdCancelPresentation } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

const ProfileComments = ({ deleteComments }) => {
	const { userId } = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.theme);
	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState(null);
	const [getCommentsLoading, setGetCommentsLoading] = useState(false);
	const [deleteCommentErrorMsg, setDeleteCommentErrorMsg] = useState(null);
	const [deleteCommentSuccessMsg, setDeleteCommentSuccessMsg] = useState(null);
	const [postDetails, setPostDetails] = useState({});
	const [userData, setUserData] = useState({});

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
		setGetCommentsLoading(true);
		const fetchComments = async () => {
			try {
				if (userData) {
					const res = await fetch(
						`/api/comment/getAllCommentsByUser?userId=${userId}&limit=10`
					);
					const data = await res.json();
					if (res.ok) {
						setComments(data);
						if (data.length < 10) {
							setShowMore(false);
						}
						setGetCommentsLoading(false);
					}
				}
			} catch (error) {
				console.log(error.message);
				setGetCommentsLoading(false);
			}
		};

		if (currentUser.isAdmin || currentUser._id === userData._id) {
			fetchComments();
		}
	}, [userData?._id]);

	const handleShowMore = async () => {
		const startIndex = comments.length;
		try {
			const res = await fetch(
				`/api/comment/getAllCommentsByUser?userId=${userId}&startIndex=${startIndex}&limit=10`
			);
			const data = await res.json();
			if (res.ok) {
				setComments((prevComments) => [...prevComments, ...data]);
				if (data.length < 10) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteCommentSubmit = async (e) => {
		e.preventDefault();
		setShowModal(false);
		setDeleteCommentErrorMsg(null);
		setDeleteCommentSuccessMsg(null);

		try {
			const res = await fetch(
				`/api/comment/delete-comment/${commentIdToDelete}`,
				{
					method: "DELETE",
				}
			);

			const data = await res.json();
			if (res.ok) {
				setDeleteCommentSuccessMsg("Comment deleted successfully!");
				setComments((prevComments) =>
					prevComments.filter((comment) => comment._id !== commentIdToDelete)
				);
			} else {
				setDeleteCommentErrorMsg(data.message);
			}
		} catch (error) {
			setDeleteCommentErrorMsg(error.message);
		}
	};

	useEffect(() => {
		const fetchTotalComments = async () => {
			try {
				const res = await fetch(
					`/api/comment/countTotalCommentsByUser/${userId}`
				);
				const data = await res.json();
				if (res.ok) {
					deleteComments(data);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchTotalComments();
	}, [comments]);

	const getCommentPost = async (postId) => {
		if (postDetails && !postDetails[postId]) {
			try {
				const res = await fetch(`/api/post/getposts?postId=${postId}`);
				const data = await res.json();
				if (res.ok) {
					setPostDetails((prevState) => ({
						...prevState,
						[postId]: data.posts[0],
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
		comments?.forEach((comment) => {
			getCommentPost(comment.postId);
		});
	}, [comments]);

	return (
		<div>
			{getCommentsLoading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : comments?.length > 0 &&
			  (currentUser.isAdmin || currentUser._id === userData._id) ? (
				<>
					<div
						className="overflow-x-scroll p-4 lg:overflow-visible md:max-w-md lg:max-w-6xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 flex flex-col gap-4
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:shadow-whiteLg
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className="lg:sticky lg:top-[175px]">
								<Table.HeadCell>Date Updated</Table.HeadCell>
								<Table.HeadCell>Comment Content</Table.HeadCell>
								<Table.HeadCell>Number of Likes</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								{currentUser._id === userData._id && (
									<Table.HeadCell>Delete</Table.HeadCell>
								)}
							</Table.Head>
							<Table.Body>
								{comments.map((comment) => (
									<Table.Row
										key={comment._id}
										className="border border-gray-400">
										<Table.Cell>
											{new Date(comment.updatedAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell>
											<span
												className={`text-gray-900 dark:text-gray-300 ${
													currentUser._id === comment.userId && "font-medium"
												}`}>
												{comment.content}
											</span>
										</Table.Cell>
										<Table.Cell>{comment.numberOfLikes}</Table.Cell>
										<Table.Cell>
											<Link to={`/post/${postDetails[comment.postId]?.slug}`}>
												<span
													className={`text-gray-900 dark:text-gray-300 ${
														currentUser._id ===
															postDetails[comment.postId]?.userId &&
														"font-medium"
													}`}>
													{postDetails[comment.postId]?.title}
												</span>
											</Link>
										</Table.Cell>
										{currentUser._id === userData._id && (
											<Table.Cell>
												<button
													onClick={() => {
														setShowModal(true);
														setCommentIdToDelete(comment._id);
													}}
													className="font-medium text-red-500 hover:cursor-pointer">
													Delete
												</button>
											</Table.Cell>
										)}
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						{showMore && (
							<div className="flex w-full">
								<button
									onClick={handleShowMore}
									className="text-teal-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 mx-auto text-sm pb-4">
									Show more
								</button>
							</div>
						)}
						{(deleteCommentErrorMsg || deleteCommentSuccessMsg) && (
							<Alert
								className="flex-auto"
								color={deleteCommentErrorMsg ? "failure" : "success"}
								withBorderAccent>
								<div className="flex justify-between">
									<span>
										{deleteCommentErrorMsg || deleteCommentSuccessMsg}
									</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => {
												setDeleteCommentErrorMsg(null);
												setDeleteCommentSuccessMsg(null);
											}}
										/>
									</span>
								</div>
							</Alert>
						)}
					</div>
				</>
			) : (
				<div
					className="max-w-xl w-full mx-auto bg-transparent border-2 mt-10 dark:shadow-whiteLg
				border-white/40 dark:border-white/20 rounded-lg shadow-lg backdrop-blur-[9px]">
					<p className="p-10 text-center">There are no comments yet</p>
				</div>
			)}

			<Modal
				className={`${theme}`}
				show={showModal}
				onClose={() => {
					setShowModal(false);
				}}
				popup
				size="lg">
				<Modal.Header />
				<Modal.Body>
					<form
						className={`flex flex-col text-center ${theme}`}
						onSubmit={handleDeleteCommentSubmit}>
						<div className="flex items-center mb-8 gap-8 self-center">
							<HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200" />
							<span className="text-2xl text-gray-600 dark:text-gray-200">
								Delete Comment
							</span>
						</div>
						<h3 className="my-5 text-lg text-gray-600 dark:text-gray-300">
							Are you sure you want to delete this Comment?
						</h3>
						<div className="flex justify-around">
							<Button type="submit" color="failure" className="focus:ring-1">
								{"Yes, i'm sure"}
							</Button>
							<Button
								type="button"
								color="gray"
								onClick={() => setShowModal(false)}
								className="focus:ring-1 dark:text-gray-300">
								No, cancel
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default ProfileComments;
