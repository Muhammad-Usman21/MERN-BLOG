import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Button } from "flowbite-react";
import { useParams } from "react-router-dom";

const ProfileHeader = () => {
	const { userId } = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const [tab, setTab] = useState("");
	const location = useLocation();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await fetch(`/api/user/${userId}`);
				const data = await res.json();
				if (res.ok) {
					setUserData(data);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchUserData();
	}, [userId]);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		// console.log(tabFromUrl);
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	return (
		<>
			<div className="flex flex-col lg:flex-row justify-between items-center px-4 transition-all duration-300 gap-4 xl:sticky">
				<div className="flex lg:flex-row gap-4 items-center justify-center mb-4 lg:mb-0">
					<Link to={`/profile/${userId}?tab=user`} className="group">
						<img
							src={userData?.profilePicture}
							alt="user"
							className="rounded-full object-cover w-20 h-20 border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 transition-all duration-300 ease-in-out"
						/>
					</Link>
					<div className="flex flex-col gap-2">
						<Link
							to={`/profile/${userId}?tab=user`}
							className={`text-base sm:text-lg transition-colors duration-300 ease-in-out ${
								tab === "user"
									? "text-blue-500 dark:text-blue-500"
									: "text-gray-800 dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-400"
							}`}>
							@{userData?.username}
						</Link>
						{currentUser._id !== userData?._id && (
							<Button
								outline
								gradientDuoTone="purpleToPink"
								pill
								className="w-full focus:ring-1">
								Follow
							</Button>
						)}
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-5 md:gap-10 lg:gap-24 items-center justify-center">
					<div className="flex gap-8 lg:gap-10">
						<Link
							to={
								currentUser._id === userData?._id
									? `/profile/${userId}?tab=followers`
									: `/profile/${userId}?tab=user`
							}>
							<div
								className={`flex flex-col items-center text-base sm:text-lg font-medium gap-1 transition-colors duration-300 ease-in-out ${
									tab === "followers"
										? "text-blue-500 dark:text-blue-500"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
								}`}>
								<span>Followers</span>
								<span>34</span>
							</div>
						</Link>
						<Link
							to={
								currentUser._id === userData?._id
									? `/profile/${userId}?tab=following`
									: `/profile/${userId}?tab=user`
							}>
							<div
								className={`flex flex-col items-center text-base sm:text-lg font-medium gap-1 transition-colors duration-300 ease-in-out ${
									tab === "following"
										? "text-blue-500 dark:text-blue-500"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
								}`}>
								<span>Followings</span>
								<span>34</span>
							</div>
						</Link>
					</div>
					<div className="flex flex-row gap-8 lg:gap-10 items-center justify-center">
						<Link
							to={
								currentUser._id === userData?._id || currentUser.isAdmin
									? `/profile/${userId}?tab=likes`
									: `/profile/${userId}?tab=user`
							}>
							<div
								className={`flex flex-col items-center text-base sm:text-lg font-medium gap-1 transition-colors duration-300 ease-in-out ${
									tab === "likes"
										? "text-blue-500 dark:text-blue-500"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
								}`}>
								<span>Likes</span>
								<span>34</span>
							</div>
						</Link>
						<Link
							to={
								currentUser._id === userData?._id || currentUser.isAdmin
									? `/profile/${userId}?tab=comments`
									: `/profile/${userId}?tab=user`
							}>
							<div
								className={`flex flex-col items-center text-base sm:text-lg font-medium gap-1 transition-colors duration-300 ease-in-out ${
									tab === "comments"
										? "text-blue-500 dark:text-blue-500"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
								}`}>
								<span>Comments</span>
								<span>34</span>
							</div>
						</Link>
					</div>
					{userData?.isAdmin && (
						<Link to={`/profile/${userId}?tab=posts`}>
							<div
								className={`flex flex-col items-center text-base sm:text-lg font-medium gap-1 transition-colors duration-300 ease-in-out ${
									tab === "posts"
										? "text-blue-500 dark:text-blue-500"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
								}`}>
								<span>Posts</span>
								<span>34</span>
							</div>
						</Link>
					)}
				</div>
			</div>
		</>
	);
};

export default ProfileHeader;
