import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
	const [searchData, setSearchData] = useState({
		searchTerm: "",
		sort: "desc",
		category: "",
	});
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const sortFromUrl = urlParams.get("sort");
		const categoryFromUrl = urlParams.get("category");
		if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
			setSearchData({
				...searchData,
				searchTerm: searchTermFromUrl ? searchTermFromUrl : "",
				sort: sortFromUrl ? sortFromUrl : "desc",
				category: categoryFromUrl ? categoryFromUrl : "",
			});
		}

		const fetchPosts = async () => {
			try {
				setLoading(true);
				const searchQuery = urlParams.toString();
				const res = await fetch(`/api/post/getposts-public?${searchQuery}`);
				const data = await res.json();
				if (res.ok) {
					setPosts(data);
					setLoading(false);
					if (data?.length === 9) {
						setShowMore(true);
					} else {
						setShowMore(false);
					}
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchPosts();
	}, [location.search]);

	const handleChange = (e) => {
		if (e.target.id === "searchTerm") {
			setSearchData({ ...searchData, searchTerm: e.target.value });
		}
		if (e.target.id === "sort") {
			const order = e.target.value || "desc";
			setSearchData({ ...searchData, sort: order });
		}
		if (e.target.id === "category") {
			const category = e.target.value || "";
			setSearchData({ ...searchData, category });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchData.searchTerm);
		urlParams.set("sort", searchData.sort);
		urlParams.set("category", searchData.category);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	const handleShowMore = async () => {
		try {
			const numberOfPosts = posts.length;
			const startIndex = numberOfPosts;
			const urlParams = new URLSearchParams(location.search);
			urlParams.set("startIndex", startIndex);
			const searchQuery = urlParams.toString();
			const res = await fetch(`/api/post/getposts-public?${searchQuery}`);
			const data = await res.json();
			if (res.ok) {
				setPosts([...posts, ...data]);
				setLoading(false);
				if (data.length === 9) {
					setShowMore(true);
				} else {
					setShowMore(false);
				}
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div
			className="min-h-screen w-full bg-cover bg-center py-4
			bg-[url('../../bg2-light.jpg')] dark:bg-[url('../../post-dark.webp')]">
			<div
				className="p-4 lg:px-10 py-4 max-w-7xl dark:shadow-whiteLg mx-4 sm:mx-7 md:mx-10 lg:mx-auto lg:sticky top-[64px] md:top-[68px] z-10
				    bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col lg:flex-row lg:justify-between items-center gap-3">
					<div className="flex items-center gap-2 w-full lg:w-auto">
						<Label className="w-24 lg:w-auto">Search Term:</Label>
						<TextInput
							placeholder="Search..."
							id="searchTerm"
							type="text"
							value={searchData.searchTerm}
							onChange={handleChange}
							className="lg:w-96 w-full"
						/>
					</div>
					<div className="flex w-full lg:w-auto justify-between lg:gap-10">
						<div className="flex items-center gap-2">
							<Label>Category:</Label>
							<TextInput
								placeholder="uncategorized"
								id="category"
								type="text"
								value={searchData.category}
								onChange={handleChange}
								className="lg:w-auto sm:w-56"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Label>Sort:</Label>
							<Select
								onChange={handleChange}
								value={searchData.sort}
								id="sort"
								className="lg:w-auto sm:w-36 xl:w-40">
								<option value="desc">Latest</option>
								<option value="asc">Oldest</option>
							</Select>
						</div>
					</div>
					<Button
						className="w-full lg:w-24 xl:w-28 focus:ring-1"
						type="submit"
						outline
						gradientDuoTone="purpleToPink">
						Search
					</Button>
				</form>
			</div>
			<div
				className="px-10 py-5 my-10 dark:shadow-whiteLg mx-4 sm:mx-7 md:mx-10
				    bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
				<h1 className="text-3xl text-center border-b-2 border-gray-400 py-5">
					Post Results
				</h1>
				{loading && (
					<div className="py-10 text-center">
						<Spinner size="xl" />
					</div>
				)}
				{!loading && posts.length === 0 && (
					<div className="py-10 text-center">
						<p>No posts found</p>
					</div>
				)}
				{!loading && posts.length > 0 && (
					<>
						<div className="flex flex-wrap gap-5 justify-center py-10">
							{posts.map((post) => (
								<PostCard key={post._id} post={post} />
							))}
						</div>
						{showMore && (
							<div className="flex w-full">
								<button
									onClick={handleShowMore}
									className="text-teal-500 dark:text-gray-400 mx-auto text-sm pb-4">
									Show more
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Search;
