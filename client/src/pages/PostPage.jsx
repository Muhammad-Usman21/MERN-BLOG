import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PostPage = () => {
	const { postSlug } = useParams();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [post, setPost] = useState(null);

	console.log(post);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				setErrorMsg(null);
				const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
				const data = await res.json();
				if (!res.ok) {
					setErrorMsg(data.message);
					setLoading(false);
					return;
				}
				if (res.ok) {
					setPost(data.posts[0]);
					setLoading(false);
				}
			} catch (error) {
				setErrorMsg(error.message);
				setLoading(false);
			}
		};

		fetchPost();
	}, [postSlug]);

	return (
		<div
			className="min-h-screen py-20 bg-cover bg-center 
			bg-[url('../../post-light.webp')] dark:bg-[url('../../post-dark.webp')]">
			{loading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				post && (
					<main
						className="flex p-2 max-w-6xl mx-10 sm:mx-14 md:mx-20 lg:mx-auto flex-col gap-4
				    bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
						<h1
							className="text-3xl mt-10 p-4 text-center font-serif max-w-2xl mx-auto lg:text-4xl
                         bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
							{post.title}
						</h1>
						<Link
							to={`/search?category=${post.category}`}
							className="self-center mt-5">
							<Button color="gray" pill size="xs">
								{post.category}
							</Button>
						</Link>
						<img
							src={post.image}
							alt={post.title}
							className="mt-10 p-3 max-h-full w-full object-cover"
						/>
						<div
							className="flex justify-between p-3 border-b border-slate-500
                            mx-auto w-full max-w-2xl text-xs">
							<span>{new Date(post.createdAt).toLocaleDateString()}</span>
							<span className="italic">
								{(post.content.length / 1000).toFixed(0)} mins read
							</span>
						</div>
						<div
							className="p-3 max-w-2xl mx-auto w-full post-content"
							dangerouslySetInnerHTML={{ __html: post.content }}></div>
					</main>
				)
			)}
		</div>
	);
};

export default PostPage;
