import { Alert, Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { MdCancelPresentation } from "react-icons/md";
import { deleteUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const DashComments = () => {
	const { currentUser } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.theme);
	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState(null);
	const [getCommentsLoading, setGetCommentsLoading] = useState(false);
	const [deleteCommentErrorMsg, setDeleteCommentErrorMsg] = useState(null);
	const [deleteCommentSuccessMsg, setDeleteCommentSuccessMsg] = useState(null);
	const dispatch = useDispatch();
	const [postDetails, setPostDetails] = useState({});
	const [userDetails, setUserDetails] = useState({});

	useEffect(() => {
		setGetCommentsLoading(true);
		const fetchComments = async () => {
			try {
				const res = await fetch(`/api/comment/get-comments?limit=10`);
				const data = await res.json();
				if (res.ok) {
					setComments(data.comments);
					if (data.comments.length < 10) {
						setShowMore(false);
					}
					setGetCommentsLoading(false);
				}
			} catch (error) {
				console.log(error.message);
				setGetCommentsLoading(false);
			}
		};

		if (currentUser.isAdmin) {
			fetchComments();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = comments.length;
		try {
			const res = await fetch(
				`/api/comment/get-comments?startIndex=${startIndex}&limit=10`
			);
			const data = await res.json();
			if (res.ok) {
				setComments((prevComments) => [...prevComments, ...data.comments]);
				if (data.comments.length < 10) {
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
				`api/comment/delete-comment/${commentIdToDelete}`,
				{
					method: "DELETE",
				}
			);

			const data = await res.json();
			if (res.ok) {
				if (currentUser._id === commentIdToDelete) {
					dispatch(deleteUserSuccess(data));
				} else {
					setDeleteCommentSuccessMsg("Comment deleted successfully!");
					setComments((prevComments) =>
						prevComments.filter((comment) => comment._id !== commentIdToDelete)
					);
				}
			} else {
				setDeleteCommentErrorMsg(data.message);
			}
		} catch (error) {
			setDeleteCommentErrorMsg(error.message);
		}
	};

	const getCommentPost = async (postId) => {
		if (!postDetails[postId]) {
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

	const getCommentUser = async (userId) => {
		if (!userDetails[userId]) {
			try {
				const res = await fetch(`/api/user/${userId}`);
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
		comments.forEach((comment) => {
			getCommentPost(comment.postId);
			getCommentUser(comment.userId);
		});
	}, [comments]);

	return (
		<div
			className="p-5 w-full bg-cover bg-center min-h-screen
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			{getCommentsLoading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : currentUser.isAdmin && comments?.length > 0 ? (
				<>
					<div
						className="overflow-x-scroll p-4 xl:overflow-visible md:max-w-md lg:max-w-5xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 flex flex-col gap-4
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:shadow-whiteLg
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className=" xl:sticky xl:top-[68px]">
								<Table.HeadCell>Date Updated</Table.HeadCell>
								<Table.HeadCell>Comment Content</Table.HeadCell>
								<Table.HeadCell>Number of Likes</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								<Table.HeadCell>Username</Table.HeadCell>
								<Table.HeadCell>Delete</Table.HeadCell>
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
										<Table.Cell>
											<span
												className={`text-gray-900 dark:text-gray-300 ${
													currentUser._id === comment.userId && "font-medium"
												}`}>
												{userDetails[comment.userId]?.username}
											</span>
										</Table.Cell>
										<Table.Cell>
											<button
												onClick={() => {
													setShowModal(true);
													setCommentIdToDelete(comment._id);
												}}
												className="font-medium text-red-500 hover:cursor-pointer
                                                disabled:text-red-300 disabled:cursor-auto"
												disabled={
													userDetails[comment.userId]?.isAdmin &&
													currentUser._id !== comment.userId
												}>
												Delete
											</button>
										</Table.Cell>
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

export default DashComments;
