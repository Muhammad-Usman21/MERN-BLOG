import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
	return (
		<div
			className="group relative w-full border-teal-500 h-[400px] overflow-hidden
            hover:border-2 sm:w-[430px] transition-all dark:shadow-whiteLg
            bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
			<Link to={`/post/${post.slug}`}>
				<img
					src={post.image}
					alt={post.title}
					className="h-[260px] w-full object-cover group-hover:h-[200px]
                    transition-all duration-300 z-20"
				/>
			</Link>
			<div className="p-3 flex flex-col gap-2">
				<p className="text-lg font-semibold line-clamp-2">{post.title}</p>
				<span className="italic text-sm">{post.category}</span>
				<Link
					to={`/post/${post.slug}`}
					className="z-10 group-hover:bottom-0 absolute bottom-[-200px] text-center
                    left-0 right-0 border border-teal-400 text-teal-500 hover:bg-teal-400
                    dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100
                    hover:text-white transition-all duration-300 py-2 rounded-md !rounded-tl-none !rounded-br-none m-2">
					Read Article
				</Link>
			</div>
		</div>
	);
};

export default PostCard;
