import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import OAuth from "../components/OAuth";
import { HoverBorder } from "../components/extra/HoverBorder";
import { MdCancelPresentation } from "react-icons/md";

const SignIn = () => {
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		// console.log(e.target.value);
		setLoading(false);
		setErrorMessage(null);
		// setFormData({ ...formData, [e.target.id]: e.target.value });
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.id]: e.target.value,
		}));
	};

	// console.log(formData);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.userInfo || !formData.password) {
			return setErrorMessage("All fields are required!");
		}
		try {
			setLoading(true);
			setErrorMessage(null);
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				setLoading(false);
				setErrorMessage(data.message);
				return;
			}
			if (res.ok) {
				setLoading(false);
				dispatch(signInSuccess(data));
				navigate("/");
			}
		} catch (error) {
			setErrorMessage(error.message);
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen py-20 bg-cover bg-center 
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg-dark.jpg')]">
			<div
				className="flex p-10 max-w-3xl mx-10 sm:mx-14 md:mx-20 lg:mx-auto flex-col md:flex-row md:items-center gap-10
				bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-lg">
				<div className="flex-1">
					<Link
						to="/"
						className="font-semibold dark:text-white text-3xl flex items-center">
						<HoverBorder>{"Usman's"}</HoverBorder>
						<span className="ml-2 text-4xl">Blog</span>
					</Link>
					<p className="text-sm mt-5">
						This is a demo project. You can sign in with your email and password
						or with Google.
					</p>
				</div>
				<div className="flex-1 pt-5 border-t-2 md:pt-0 md:border-t-0 md:pl-5 md:border-l-2">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Sign in with username or email" />
							<TextInput
								type="text"
								placeholder="Username or Email"
								id="userInfo"
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value="Your password" />
							<TextInput
								type="password"
								placeholder="Password"
								id="password"
								onChange={handleChange}
							/>
						</div>
						<Button
							gradientDuoTone="purpleToBlue"
							type="submit"
							className="uppercase focus:ring-1 mt-1"
							disabled={loading || errorMessage}>
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Loading...</span>
								</>
							) : (
								"Sign in"
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-sm mt-4">
						<span>Dont have an account?</span>
						<Link to="/sign-up" className="text-blue-500">
							Sign Up
						</Link>
					</div>
					{errorMessage && (
						<div className="flex items-center gap-1 mt-4">
							<Alert className="flex-auto" color="failure" withBorderAccent>
								<div className="flex gap-3">
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => setErrorMessage(null)}
										/>
									</span>
									<span>{errorMessage}</span>
								</div>
							</Alert>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignIn;
