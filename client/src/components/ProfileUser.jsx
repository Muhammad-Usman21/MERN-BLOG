import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ProfileUser = () => {
	const { userId } = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const [userData, setUserData] = useState({});

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

	return <div>{userData.about && userData.about !== ""}</div>;
};

export default ProfileUser;
