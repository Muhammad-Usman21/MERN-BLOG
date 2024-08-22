import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProfileUser from "../components/ProfileUser";
import ProfileHeader from "../components/ProfileHeader";
import ProfileFollowers from "../components/ProfileFollowers";
import ProfileFollowing from "../components/ProfileFollowing";
import ProfileLikes from "../components/ProfileLikes";
import ProfileComments from "../components/ProfileComments";
import ProfilePosts from "../components/ProfilePosts";

const Profile = () => {
	const location = useLocation();
	const [tab, setTab] = useState("");
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		// console.log(tabFromUrl);
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	return (
		<div
			className="min-h-screen py-5 bg-cover bg-center 
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg-dark.jpg')]">
			<div
				className="flex px-10 py-3 max-w-7xl mx-10 sm:mx-14 md:mx-20 lg:mx-auto flex-col xl:sticky xl:top-[68px] z-20
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl dark:shadow-whiteLg">
				<ProfileHeader />
			</div>
			<div
				className="flex p-10 max-w-7xl mx-10 sm:mx-14 md:mx-20 lg:mx-auto flex-col mt-5
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl dark:shadow-whiteLg">
				{(tab === "user" || !tab) && <ProfileUser />}
				{tab === "followers" && <ProfileFollowers />}
				{tab === "following" && <ProfileFollowing />}
				{tab === "likes" && <ProfileLikes />}
				{tab === "comments" && <ProfileComments />}
				{currentUser.isAdmin && tab === "posts" && <ProfilePosts />}
			</div>
		</div>
	);
};

export default Profile;
