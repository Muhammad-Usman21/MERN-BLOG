import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CommentSection = ({ postId }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentErrorMsg, setCommentErrorMsg] = useState(null);

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
			} else {
				setCommentErrorMsg(data.message);
			}
		} catch (error) {
			setCommentErrorMsg(error.message);
		}
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
							rows="2"
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
							<Button outline gradientDuoTone="purpleToBlue" type="submit">
								Submit
							</Button>
						</div>
						{commentErrorMsg && (
							<Alert className="flex-auto mt-2" color="failure" withBorderAccent>
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
				<div className="text-sm text-teal-500 my-3 flex gap-2 dark:text-gray-500 pl-3">
					<p>You mush signed in to comment.</p>
					<Link className="text-blue-500 hover:underline" to={"/sign-in"}>
						Sign In
					</Link>
				</div>
			)}
		</div>
	);
};

export default CommentSection;
