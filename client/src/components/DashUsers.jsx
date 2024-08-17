import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
	const { currentUser } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.theme);
	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState(null);
	const [getUsersLoading, setGetUsersLoading] = useState(false);

	useEffect(() => {
		setGetUsersLoading(true);
		const fetchUsers = async () => {
			try {
				const res = await fetch(`/api/user/getusers`);
				const data = await res.json();
				if (res.ok) {
					setUsers(data.users);
					if (data.users.length < 10) {
						setShowMore(false);
					}
					setGetUsersLoading(false);
				}
			} catch (error) {
				console.log(error.message);
				setGetUsersLoading(false);
			}
		};

		if (currentUser.isAdmin) {
			fetchUsers();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = users.length;
		try {
			const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
			const data = await res.json();
			if (res.ok) {
				setUsers((prevUsers) => [...prevUsers, ...data.users]);
				if (data.posts.length < 10) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteUserSubmit = async () => {};

	return (
		<div
			className="p-5 w-full bg-cover bg-center min-h-screen
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			{getUsersLoading ? (
				<div className="flex mt-20 justify-center">
					<Spinner size="xl" />
				</div>
			) : currentUser.isAdmin && users.length > 0 ? (
				<>
					<div
						className="overflow-x-scroll p-4 xl:overflow-visible md:max-w-md lg:max-w-5xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
							rounded-lg shadow-lg">
							<Table.Head className=" xl:sticky xl:top-[68px]">
								<Table.HeadCell>Date created</Table.HeadCell>
								<Table.HeadCell>User Image</Table.HeadCell>
								<Table.HeadCell>Username</Table.HeadCell>
								<Table.HeadCell>Email</Table.HeadCell>
								<Table.HeadCell>Admin</Table.HeadCell>
								<Table.HeadCell>Delete</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{users.map((user) => (
									<Table.Row key={user._id} className="border border-gray-400">
										<Table.Cell>
											{new Date(user.createdAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell>
											<img
												src={user.profilePicture}
												alt={user.username}
												className="w-10 h-10 object-cover bg-gray-500 rounded-full"
											/>
										</Table.Cell>
										<Table.Cell>
											<span className="text-gray-900 dark:text-gray-300">
												{user.username}
											</span>
										</Table.Cell>
										<Table.Cell>{user.email}</Table.Cell>
										<Table.Cell>
											{user.isAdmin ? (
												<FaCheck className="text-green-500" />
											) : (
												<FaTimes className="text-red-500" />
											)}
										</Table.Cell>
										<Table.Cell>
											<span
												onClick={() => {
													setShowModal(true);
													setUserIdToDelete(user._id);
												}}
												className="font-medium text-red-500 hover:cursor-pointer">
												Delete
											</span>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						{showMore && (
							<div className="flex w-full">
								<button
									onClick={handleShowMore}
									className="text-teal-500 dark:text-gray-400 mx-auto text-sm py-4">
									Show more
								</button>
							</div>
						)}
					</div>
				</>
			) : (
				<div
					className="max-w-xl w-full mx-auto bg-transparent border-2 mt-10
				border-white/40 dark:border-white/20 rounded-lg shadow-lg backdrop-blur-[9px]">
					<p className="p-10 text-center">There are no users yet</p>
				</div>
			)}

			<Modal
				className={`${theme}`}
				show={showModal}
				onClose={() => {
					setShowModal(false);
				}}
				popup
				size="lg">
				<Modal.Header />
				<Modal.Body>
					<form
						className={`flex flex-col text-center ${theme}`}
						onSubmit={handleDeleteUserSubmit}>
						<div className="flex items-center mb-8 gap-8 self-center">
							<HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200" />
							<span className="text-2xl text-gray-600 dark:text-gray-200">
								Delete User
							</span>
						</div>
						<h3 className="my-5 text-lg text-gray-600 dark:text-gray-300">
							Are you sure you want to delete this User?
						</h3>
						<div className="flex justify-around">
							<Button type="submit" color="failure" className="focus:ring-1">
								{"Yes, i'm sure"}
							</Button>
							<Button
								type="button"
								color="gray"
								onClick={() => setShowModal(false)}
								className="focus:ring-1 dark:text-gray-300">
								No, cancel
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default DashUsers;
