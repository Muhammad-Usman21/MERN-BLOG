import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { IoHeartSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PostPage = () => {
	const { postSlug } = useParams();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [post, setPost] = useState(null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [recentPosts, setRecentPosts] = useState(null);
	const { currentUser } = useSelector((state) => state.user);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	// console.log(post);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				setErrorMsg(null);
				const res = await fetch(`/api/post/getposts-public?slug=${postSlug}`);
				const data = await res.json();
				if (!res.ok) {
					setErrorMsg(data.message);
					setLoading(false);
					return;
				}
				if (res.ok) {
					setPost(data[0]);
					setLoading(false);
				}
			} catch (error) {
				setErrorMsg(error.message);
				setLoading(false);
			}
		};

		fetchPost();
	}, [postSlug]);

	useEffect(() => {
		try {
			const fetchRecentPosts = async () => {
				const res = await fetch("/api/post/getposts-public?limit=3");
				const data = await res.json();
				if (res.ok) {
					setRecentPosts(data);
				} else {
					console.log(data.message);
				}
			};

			fetchRecentPosts();
		} catch (error) {
			console.log(error.message);
		}
	}, []);

	useEffect(() => {
		const fetchUser = async () => {
			if (post) {
				try {
					const res = await fetch(`/api/user/getuser/${post.userId}`);
					const data = await res.json();
					if (!res.ok) {
						console.log(data.message);
						return;
					}
					if (res.ok) {
						setUser(data);
					}
				} catch (error) {
					console.log(error.message);
				}
			}
		};

		fetchUser();
	}, [post]);

	const onLike = async () => {
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/post/like-post/${post._id}`, {
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
			className="min-h-screen py-20 bg-cover bg-center 
			bg-[url('../../post-light.webp')] dark:bg-[url('../../post-dark.webp')]">
			{loading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				post && (
					<>
						<main
							className="flex p-2 max-w-6xl mx-10 sm:mx-14 md:mx-20 lg:mx-auto flex-col gap-4 dark:shadow-whiteLg
				    			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
							<h1
								className="text-3xl mt-10 p-4 text-center font-serif max-w-2xl mx-auto lg:text-4xl dark:shadow-whiteLg
                         			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
								{post.title}
							</h1>
							<Link
								to={`/search?category=${post.category}`}
								className="self-center mt-5">
								<Button color="gray" pill size="xs" className="focus:ring-1">
									{post.category}
								</Button>
							</Link>

							{currentUser && (
								<div className="flex items-center justify-between max-w-2xl self-center w-full p-2 mt-3">
									<div className="flex items-center gap-1 text-gray-500 text-sm">
										<p>Post by:</p>
										<img
											className="h-8 w-8 object-cover rounded-full ml-1"
											src={user?.profilePicture}
											alt=""
										/>
										<Link
											to={`/profile/${user?._id}?tab=user`}
											className="text-cyan-600 hover:underline">
											@{user?.username}
										</Link>
									</div>
									<div className="flex gap-2 items-center">
										<button
											type="button"
											onClick={() => onLike(post._id)}
											className={`text-gray-400 hover:text-red-500 ${
												currentUser &&
												post.likes.includes(currentUser._id) &&
												"!text-red-500"
											}`}>
											<IoHeartSharp className="text-3xl" />
										</button>
										{post.numberOfLikes > 0 && (
											<p className="text-gray-400 text-sm">
												{post.numberOfLikes +
													" " +
													(post.numberOfLikes === 1 ? "like" : "likes")}
											</p>
										)}
									</div>
								</div>
							)}

							<img
								src={post.image}
								alt={post.title}
								className={`mt-7 p-3 max-h-full w-full object-cover ${
									!imageLoaded && "hidden"
								}`}
								onLoad={() => setImageLoaded(true)}
							/>
							{!imageLoaded && (
								<div
									role="status"
									className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
									<div className="flex items-center justify-center w-full h-[600px] bg-gray-300 rounded dark:bg-gray-700 mt-10">
										<svg
											className="w-56 h-56 text-gray-200 dark:text-gray-600"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 18">
											<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
										</svg>
									</div>
								</div>
							)}

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

							<div className="max-w-4xl md:mx-auto w-full">
								<CallToAction />
							</div>

							<CommentSection postId={post._id} />
						</main>
						<div
							className="flex flex-col justify-center items-center my-10 mx-10 sm:mx-14 p-5 dark:shadow-whiteLg
							bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
							<h1 className="text-2xl my-5">Recent Articles</h1>
							<div className="flex flex-wrap gap-5 my-5 justify-center">
								{recentPosts &&
									recentPosts.map((post) => (
										<PostCard key={post._id} post={post} />
									))}
							</div>
						</div>
					</>
				)
			)}
		</div>
	);
};

export default PostPage;
