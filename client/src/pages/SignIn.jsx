import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const SignIn = () => {
	const [formData, setFormData] = useState({});
	const { loading, error: errorMessage } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		// console.log(e.target.value);
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			return dispatch(signInFailure("Please fill out all fields"));
		}
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				return dispatch(signInFailure(data.message));
			}
			if (res.ok) {
				dispatch(signInSuccess(data));
				navigate("/");
			}
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};

	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10">
				<div className="flex-1">
					<Link to="/" className="font-bold dark:text-white text-4xl">
						<span
							className="px-2 py-1 bg-gradient-to-r from-indigo-500 
                    via-purple-500 to-pink-500 rounded-lg text-white">
							{"Usman's"}
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						This is a demo project. You can sign in with your email and password
						or with Google.
					</p>
				</div>
				<div className="flex-1 pt-5 border-t-2 md:pt-0 md:border-t-0 md:pl-5 md:border-l-2">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
							<TextInput
								type="password"
								placeholder="Password"
								id="password"
								onChange={handleChange}
							/>
						</div>
						<Button
							gradientDuoTone="purpleToPink"
							type="submit"
							className="uppercase"
							disabled={loading}>
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
						<Alert className="mt-4" color="failure">
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignIn;
