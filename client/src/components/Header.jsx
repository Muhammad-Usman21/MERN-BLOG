import {
	Avatar,
	Button,
	Dropdown,
	DropdownDivider,
	Navbar,
	TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { HiMoon, HiSun } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { HoverBorder } from "./extra/HoverBorder";
import { signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

const Header = () => {
	const path = useLocation().pathname;
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { theme } = useSelector((state) => state.theme);
	const [searchTerm, setSearchTerm] = useState("");
	const location = useLocation();
	const navigate = useNavigate();

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

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromURL = urlParams.get("searchTerm");
		setSearchTerm(searchTermFromURL ? searchTermFromURL : "");
	}, [location.search]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	return (
		<Navbar
			className="border-b-2 border-teal-600 lg:px-14 bg-cover bg-center sticky top-0 z-20
			bg-[url('../../h&f-light.jpg')] dark:bg-[url('../../header-dark.jpg')]">
			<Link
				to="/"
				className="font-semibold dark:text-white text-md sm:text-xl flex items-center">
				<HoverBorder>{"Usman's"}</HoverBorder>
				<span className="ml-1 text-xl sm:ml-2 sm:3xl">Blog</span>
			</Link>
			<form
				className={`header-search-form ${theme}`}
				onSubmit={handleSearchSubmit}>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</form>
			<Link to={"/search"}>
				<Button
					className="w-8 h-8 sm:w-10 sm:h-10 lg:hidden focus:ring-1 items-center bg-transparent border-teal-400"
					color="gray"
					pill>
					<AiOutlineSearch />
				</Button>
			</Link>
			<div className=" flex gap-2 md:order-2 items-center">
				<Button
					className="w-8 h-8 sm:w-10 sm:h-10 focus:ring-1 items-center bg-transparent border-teal-400"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}>
					{theme === "light" ? <HiMoon /> : <HiSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						className={`z-20 ${theme}`}
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
			<Navbar.Collapse className={`${theme}`}>
				<Navbar.Link className="h-0 p-0 m-0"></Navbar.Link>
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
