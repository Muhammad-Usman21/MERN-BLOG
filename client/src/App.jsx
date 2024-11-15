import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import TicTacToe from "./pages/TicTacToe";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

const App = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/profile/:userId" element={<Profile />} />
				</Route>
				<Route element={<AdminPrivateRoute />}>
					<Route path="/create-post" element={<CreatePost />} />
					<Route path="/update-post/:postId" element={<UpdatePost />} />
				</Route>
				<Route path="/post/:postSlug" element={<PostPage />} />
				<Route path="/search" element={<Search />} />
				<Route path="/tic-tac-toe" element={<TicTacToe />} />
			</Routes>
			<FooterComp />
		</BrowserRouter>
	);
};

export default App;
