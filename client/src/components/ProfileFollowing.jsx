import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const ProfileFollowing = ({ removeFollowings }) => {
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

	const handleFollowingUserToRemove = async (followingUserId) => {
		try {
			const res = await fetch(`/api/user/followUser/${followingUserId}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (res.ok) {
				removeFollowings(userData.followings.length - 1);
				setUserData((prevData) => ({
					...prevData,
					followings: data.selfUser.followings,
				}));
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const getFollowingUser = async (userId) => {
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
		userData?.followings?.forEach((followingId) => {
			getFollowingUser(followingId);
		});
	}, [userData?.followings]);

	return (
		<div>
			{currentUser._id === userData?._id && userData?.followings.length > 0 ? (
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
								{userData?.followings.map((followingId) => (
									<Table.Row
										key={followingId}
										className="border border-gray-400">
										<Table.Cell>
											<Link to={`/profile/${followingId}`}>
												<img
													src={userDetails?.[followingId]?.profilePicture}
													alt={userDetails?.[followingId]?.username}
													className="w-10 h-10 object-cover bg-gray-500 rounded-full"
												/>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<Link to={`/profile/${followingId}`}>
												<span
													className={`text-gray-900 dark:text-gray-300 font-medium
													`}>
													{userDetails?.[followingId]?.username}
												</span>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<button
												onClick={() => {
													handleFollowingUserToRemove(followingId);
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
					<p className="p-10 text-center">You follow no users yet</p>
				</div>
			)}
		</div>
	);
};

export default ProfileFollowing;
