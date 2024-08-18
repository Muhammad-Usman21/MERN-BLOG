import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentErrorMsg, setCommentErrorMsg] = useState(null);
	const [comments, setComments] = useState([]);
	const navigate = useNavigate();

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		setCommentErrorMsg(null);

		if (comment?.length > 200) {
			return setCommentErrorMsg("Length must less than 200 characters");
		}

		try {
			const res = await fetch("/api/comment/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: comment,
					postId,
					userId: currentUser._id,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setComment("");
				setComments([data, ...comments]);
			} else {
				setCommentErrorMsg(data.message);
			}
		} catch (error) {
			setCommentErrorMsg(error.message);
		}
	};

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await fetch(`/api/comment/get-comments/${postId}`);
				const data = await res.json();
				if (res.ok) {
					setComments(data);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		getComments();
	}, [postId]);

	const handleLike = async (commentId) => {
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/comment/like-comment/${commentId}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (res.ok) {
				setComments(
					comments.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									likes: data.likes,
									numberOfLikes: data.likes.length,
							  }
							: comment
					)
				);
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleEditSubmit = async (comment, editedContent) => {
		setComments(
			comments.map((c) =>
				c._id === comment._id ? { ...c, content: editedContent } : c
			)
		);
	};

	return (
		<div className="max-w-2xl mx-auto w-full p-3">
			{currentUser ? (
				<>
					<div className="flex items-center gap-1 my-3 text-gray-500 text-sm pl-3">
						<p>Signed in as:</p>
						<img
							className="h-5 w-5 object-cover rounded-full ml-1"
							src={currentUser.profilePicture}
							alt=""
						/>
						<Link
							to={"/dashboard?tab=profile"}
							className="text-xs text-cyan-600 hover:underline">
							@{currentUser.username}
						</Link>
					</div>
					<form
						onSubmit={handleCommentSubmit}
						className="bg-transparent border-2 border-white/40 dark:border-white/20 
                            backdrop-blur-[9px] rounded-lg shadow-xl p-3">
						<Textarea
							placeholder="Add a comment..."
							rows="3"
							maxLength="200"
							value={comment}
							onChange={(e) => {
								setComment(e.target.value);
								setCommentErrorMsg(null);
							}}
						/>
						<div className="flex justify-between items-center mt-3 p-1">
							<p className="text-gray-500 text-xs">
								{200 - comment?.length} characters remaining
							</p>
							<Button
								outline
								gradientDuoTone="purpleToBlue"
								type="submit"
								className="focus:ring-1">
								Submit
							</Button>
						</div>
						{commentErrorMsg && (
							<Alert
								className="flex-auto mt-2"
								color="failure"
								withBorderAccent>
								<div className="flex justify-between">
									<span>{commentErrorMsg}</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => {
												setCommentErrorMsg(null);
											}}
										/>
									</span>
								</div>
							</Alert>
						)}
					</form>
				</>
			) : (
				<div className="text-sm text-teal-500 my-3 flex gap-2 dark:text-gray-500 ml-3">
					<p>You mush signed in to comment.</p>
					<Link className="text-blue-500 hover:underline" to={"/sign-in"}>
						Sign In
					</Link>
				</div>
			)}

			{comments.length === 0 ? (
				<p className="text-sm mt-7 mb-5 ml-3">No comments yet</p>
			) : (
				<>
					<div className="text-sm mt-7 mb-5 flex items-center gap-1 ml-3">
						<p>Comments</p>
						<div className="border border-gray-400 py-1 px-2 rounded-sm">
							<p>{comments.length}</p>
						</div>
					</div>
					{comments.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							onLike={handleLike}
							onEdit={handleEditSubmit}
						/>
					))}
				</>
			)}
		</div>
	);
};

export default CommentSection;
