import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { HoverBorder } from "../components/extra/HoverBorder";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { MdCancelPresentation } from "react-icons/md";

const SignUp = () => {
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!formData.username ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword
		) {
			return setErrorMessage("All fields are required!");
		} else if (formData.password !== formData.confirmPassword) {
			return setErrorMessage("Your password isn't same. Try again!");
		}

		try {
			setLoading(true);
			setErrorMessage(null);
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				setErrorMessage(data.message);
				setLoading(false);
				return;
			}
			if (res.ok) {
				setLoading(false);
				navigate("/sign-in");
			}
		} catch (error) {
			setErrorMessage(error.message);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 max-w-3xl md:mx-auto flex-col md:flex-row md:items-center gap-10 mx-5 sm:mx-12">
				<div className="flex-1">
					<Link
						to="/"
						className="font-semibold dark:text-white text-3xl flex items-center">
						<HoverBorder>{"Usman's"}</HoverBorder>
						<span className="ml-2 text-4xl">Blog</span>
					</Link>
					<p className="text-sm mt-5">
						This is a demo project. You can sign up with your email and password
						or with Google.
					</p>
				</div>
				<div className="flex-1 pt-5 border-t-2 md:pt-0 md:border-t-0 md:pl-5 md:border-l-2">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Your username" />
							<TextInput
								type="text"
								placeholder="Username"
								id="username"
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value="Your email" />
							<TextInput
								type="email"
								placeholder="name@company.com"
								id="email"
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value="Your password" />
							<div className="flex items-center gap-1">
								<TextInput
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									id="password"
									onChange={handleChange}
									className="flex-auto"
								/>
								<Button
									className="w-10 h-10 focus:ring-1 items-center rounded-lg"
									color="gray"
									onMouseEnter={() => setShowPassword(true)}
									onMouseLeave={() => setShowPassword(false)}>
									{showPassword ? <BiSolidShow /> : <BiSolidHide />}
								</Button>
							</div>
						</div>
						<div>
							<Label value="Confirm password" />
							<TextInput
								type="password"
								placeholder="Confirm Password"
								id="confirmPassword"
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
								"Sign up"
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-sm mt-4">
						<span>Have an account?</span>
						<Link to="/sign-in" className="text-blue-500">
							Sign In
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

export default SignUp;
