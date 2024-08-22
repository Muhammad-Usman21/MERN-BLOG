import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashMyPosts from "../components/DashMyPosts";
import { useSelector } from "react-redux";

const Dashboard = () => {
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
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="md:w-64">
				<DashSidebar />
			</div>
			{tab === "profile" && <DashProfile />}
			{currentUser.isAdmin && tab === "myposts" && <DashMyPosts />}
			{currentUser.isAdmin && tab === "posts" && <DashPosts />}
			{currentUser.isAdmin && tab === "users" && <DashUsers />}
			{currentUser.isAdmin && tab === "comments" && <DashComments />}
			{currentUser.isAdmin && (tab === "dash" || !tab) && <DashboardComp />}
		</div>
	);
};

export default Dashboard;
