import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const ProfileFollowers = ({ removeFollowers }) => {
	const { userId } = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const [userData, setUserData] = useState({});
	const [userDetails, setUserDetails] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await fetch(`/api/user/getuser/${userId}`);
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

	const handleFollowerUserToRemove = async (followerUserId) => {
		try {
			const res = await fetch(`/api/user/removeFollower/${followerUserId}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (res.ok) {
				removeFollowers(userData.followers.length - 1);
				setUserData((prevData) => ({
					...prevData,
					followers: data.selfUser.followers,
				}));
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const getFollowerUser = async (userId) => {
		if (!userDetails[userId]) {
			try {
				const res = await fetch(`/api/user/getuser/${userId}`);
				const data = await res.json();
				if (res.ok) {
					setUserDetails((prevState) => ({
						...prevState,
						[userId]: data,
					}));
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		}
	};

	useEffect(() => {
		userData?.followers?.forEach((followerId) => {
			getFollowerUser(followerId);
		});
	}, [userData?.followers]);

	return (
		<div>
			{currentUser._id === userData?._id && userData?.followers.length > 0 ? (
				<>
					<div
						className="overflow-x-scroll p-4 lg:overflow-visible md:max-w-md lg:max-w-6xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 flex flex-col gap-4
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:shadow-whiteLg
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className=" lg:sticky lg:top-[175px]">
								<Table.HeadCell>User Image</Table.HeadCell>
								<Table.HeadCell>Username</Table.HeadCell>
								<Table.HeadCell>Remove User</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{userData?.followers.map((followerId) => (
									<Table.Row
										key={followerId}
										className="border border-gray-400">
										<Table.Cell>
											<Link to={`/profile/${followerId}`}>
												<img
													src={userDetails?.[followerId]?.profilePicture}
													alt={userDetails?.[followerId]?.username}
													className="w-10 h-10 object-cover bg-gray-500 rounded-full"
												/>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<Link to={`/profile/${followerId}`}>
												<span
													className={`text-gray-900 dark:text-gray-300 font-medium
													`}>
													{userDetails?.[followerId]?.username}
												</span>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<button
												onClick={() => {
													handleFollowerUserToRemove(followerId);
												}}
												className="font-medium text-red-500 hover:cursor-pointer">
												Remove
											</button>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				</>
			) : (
				<div
					className="max-w-xl w-full mx-auto bg-transparent border-2 mt-10 dark:shadow-whiteLg
					border-white/40 dark:border-white/20 rounded-lg shadow-lg backdrop-blur-[9px]">
					<p className="p-10 text-center">You have no followers yet</p>
				</div>
			)}
		</div>
	);
};

export default ProfileFollowers;
