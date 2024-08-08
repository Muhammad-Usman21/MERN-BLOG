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
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {
	const path = useLocation().pathname;
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { theme } = useSelector((state) => state.theme);

	return (
		<Navbar className="border-b-2 dark:bg-[#121416]">
			<Link
				to="/"
				className="self-center whitespace-nowrap font-semibold dark:text-white text-xl">
				<span
					className="px-2 py-1 bg-gradient-to-r from-indigo-500 
                    via-purple-500 to-pink-500 rounded-lg text-white">
					{"Usman's"}
				</span>
				Blog
			</Link>
			<form>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"></TextInput>
			</form>
			<Button
				className="w-12 h-10 lg:hidden focus:ring-1 items-center"
				color="gray"
				pill>
				<AiOutlineSearch />
			</Button>
			<div className=" flex gap-2 md:order-2">
				<Button
					className="w-12 h-10 hidden sm:inline focus:ring-1 items-center"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}>
					{theme === "light" ? <FaMoon /> : <FaSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar img={currentUser.profilePicture} alt="user" rounded />
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
						<Dropdown.Item>Sign out</Dropdown.Item>
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
