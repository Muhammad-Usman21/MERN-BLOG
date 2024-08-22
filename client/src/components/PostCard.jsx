import { useState } from "react";
import { IoHeartSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [Post, setPost] = useState(post);
	const navigate = useNavigate();

	const onLike = async () => {
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/post/like-post/${Post._id}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (res.ok) {
				setPost((prevData) => ({
					...prevData,
					likes: data.likes,
					numberOfLikes: data.numberOfLikes,
				}));
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div
			className="group relative w-full border-teal-500 h-[420px] overflow-hidden
            hover:border-2 sm:w-[430px] transition-all dark:shadow-whiteLg
            bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
			<Link to={`/post/${Post.slug}`}>
				<img
					src={Post.image}
					alt={Post.title}
					className="h-[260px] w-full object-cover group-hover:h-[200px]
                    transition-all duration-300 z-20"
				/>
			</Link>
			<div className="p-3 flex flex-col gap-2">
				<p className="text-lg font-semibold line-clamp-2">{Post.title}</p>
				<span className="italic text-sm">{Post.category}</span>
				{currentUser && (
					<button
						type="button"
						onClick={() => onLike(Post._id)}
						className={`text-gray-400 hover:text-red-500 ${
							currentUser &&
							Post.likes.includes(currentUser._id) &&
							"!text-red-500"
						} self-end pr-2 pt-2`}>
						<IoHeartSharp className="text-3xl" />
					</button>
				)}
				<Link
					to={`/post/${Post.slug}`}
					className="z-10 group-hover:bottom-0 absolute bottom-[-200px] text-center
                    left-0 right-0 border border-teal-400 text-teal-500 hover:bg-teal-400
                    dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100
                    hover:text-white transition-all duration-300 py-2 rounded-md !rounded-tl-none !rounded-br-none m-2 mt-0">
					Read Article
				</Link>
			</div>
		</div>
	);
};

export default PostCard;
