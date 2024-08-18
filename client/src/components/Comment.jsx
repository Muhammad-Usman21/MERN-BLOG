import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit }) => {
	const [user, setUser] = useState({});
	const { currentUser } = useSelector((state) => state.user);
	const [isEditing, setIsEdititng] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/user/${comment.userId}`);
				const data = await res.json();
				if (res.ok) {
					setUser(data);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getUser();
	}, [comment]);

	const handleEdit = () => {
		setIsEdititng(true);
		setEditedContent(comment.content);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: editedContent,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setIsEdititng(false);
				onEdit(comment, editedContent);
				return;
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="flex p-4 border-b dark:border-gray-600 text-sm">
			<div className="flex-shrink-0 mr-3">
				<img
					className="w-10 h-10 object-cover rounded-full bg-gray-200"
					src={user.profilePicture}
					alt={user.username}
				/>
			</div>
			<div className="flex-1">
				<div className="flex items-center mb-1">
					<span className="font-bold mr-1 text-xs truncate">
						{user ? `@${user.username}` : "anonymous user"}
					</span>
					<span className="text-gray-500 text-xs">
						{moment(comment.createdAt).fromNow()}
					</span>
				</div>
				{isEditing ? (
					<form onSubmit={handleEditSubmit}>
						<Textarea
							className="mb-2 mt-1"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
						/>
						<div className="flex justify-end gap-2 text-xs">
							<Button
								type="submit"
								size="sm"
								gradientDuoTone="purpleToBlue"
								className="px-2 focus:ring-1">
								Save
							</Button>
							<Button
								type="button"
								size="sm"
								gradientDuoTone="purpleToBlue"
								outline
								onClick={() => setIsEdititng(false)}
								className="focus:ring-1">
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<>
						<p className="text-gray-500 pb-2">{comment.content}</p>
						<div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
							<button
								type="button"
								onClick={() => onLike(comment._id)}
								className={`text-gray-400 hover:text-blue-500 ${
									currentUser &&
									comment.likes.includes(currentUser._id) &&
									"!text-blue-500"
								}`}>
								<FaThumbsUp className="text-sm" />
							</button>
							{comment.numberOfLikes > 0 && (
								<p className="text-gray-400">
									{comment.numberOfLikes +
										" " +
										(comment.numberOfLikes === 1 ? "like" : "likes")}
								</p>
							)}

							{currentUser &&
								(currentUser._id === comment.userId ||
									(currentUser.isAdmin && !user.isAdmin)) && (
									<button
										type="button"
										onClick={handleEdit}
										className="text-gray-400 hover:text-blue-500">
										Edit
									</button>
								)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Comment;
