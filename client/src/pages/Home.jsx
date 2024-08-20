import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Home = () => {
	const [recentPosts, setRecentPosts] = useState(null);

	useEffect(() => {
		try {
			const fetchRecentPosts = async () => {
				const res = await fetch("/api/post/getposts?limit=9");
				const data = await res.json();
				if (res.ok) {
					setRecentPosts(data.posts);
				} else {
					console.log(data.message);
				}
			};

			fetchRecentPosts();
		} catch (error) {
			console.log(error.message);
		}
	}, []);

	return (
		<div
			className="min-h-screen py-20 bg-cover bg-center 
			bg-[url('../../bg2-light.jpg')] dark:bg-[url('../../post-dark.webp')]">
			<div
				className="flex flex-col gap-6 px-10 p-28 max-w-5xl dark:shadow-whiteLg mx-4 sm:mx-7 md:mx-10 lg:mx-auto
				    			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
				<h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
				<p className="text-gray-500 text-sm lg:text-base">
					Here you will find a variety of articles and tutorials on topics such
					as web developments, programming languages, and also on movies, animes
					and netflix shows.
				</p>
				<p>
					<Link
						to={"/search"}
						className="text-sm md:text-base text-teal-400 dark:text-gray-400 font-bold hover:underline">
						View All
					</Link>
				</p>
			</div>
			<div className="my-12 mx-4">
				<CallToAction />
			</div>
			<div
				className="mx-4 sm:mx-7 md:mx-10 p-3 flex flex-col gap-8 py-7 dark:shadow-whiteLg
				    			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
				{recentPosts?.length > 0 && (
					<div className="flex flex-col gap-8">
						<h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
						<div className="flex flex-wrap gap-5 justify-center">
							{recentPosts.map((post) => (
								<PostCard key={post._id} post={post} />
							))}
						</div>
						<span className="text-center">
							<Link
								to={"/search"}
								className="text-lg text-teal-400 dark:text-gray-400 ">
								View all Posts
							</Link>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
