import {
	Avatar,
	Button,
	Dropdown,
	DropdownDivider,
	Navbar,
	TextInput,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { HiMoon, HiSun } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { HoverBorder } from "./extra/HoverBorder";
import { signOutSuccess } from "../redux/user/userSlice";

const Header = () => {
	const path = useLocation().pathname;
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { theme } = useSelector((state) => state.theme);

	const handleSignOut = async () => {
		try {
			const res = await fetch("/api/auth/signout", {
				method: "POST",
			});
			const data = await res.json();

			if (!res.ok) {
				return console.log(data.message);
			} else {
				dispatch(signOutSuccess(data));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Navbar className="border-b-2 dark:bg-[#121416] lg:px-14">
			<Link
				to="/"
				className="font-semibold dark:text-white text-xl flex items-center">
				<HoverBorder>{"Usman's"}</HoverBorder>
				<span className="ml-2 text-3xl">Blog</span>
			</Link>
			<form>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"></TextInput>
			</form>
			<Button
				className="w-10 h-10 lg:hidden focus:ring-1 items-center"
				color="gray"
				pill>
				<AiOutlineSearch />
			</Button>
			<div className=" flex gap-2 md:order-2 items-center">
				<Button
					className="w-15 h-10 hidden sm:inline focus:ring-1 items-center"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}>
					{theme === "light" ? <HiMoon /> : <HiSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						className="z-20"
						arrowIcon={false}
						inline
						label={
							// <Avatar img={currentUser.profilePicture} alt="user" rounded />
							<HoverBorder containerClassName="p-0" className="p-0" as="div">
								<Avatar img={currentUser.profilePicture} alt="user" rounded />
							</HoverBorder>
						}>
						<Dropdown.Header>
							<span className="block text-sm">@{currentUser.username}</span>
							<span className="block text-sm font-medium">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={"/dashboard?tab=profile"}>
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<DropdownDivider />
						<Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button
							gradientDuoTone="purpleToBlue"
							outline
							className="focus:ring-1">
							Sign In
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Link to="/">
					<Navbar.Link active={path === "/"} as={"div"}>
						Home
					</Navbar.Link>
				</Link>
				<Link to="/about">
					<Navbar.Link active={path === "/about"} as={"div"}>
						About
					</Navbar.Link>
				</Link>
				<Link to="/projects">
					<Navbar.Link active={path === "/projects"} as={"div"}>
						Projects
					</Navbar.Link>
				</Link>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
