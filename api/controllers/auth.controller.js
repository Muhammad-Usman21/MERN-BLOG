import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
	// console.log(req.body);
	const { username, email, password, confirmPassword } = req.body;

	if (
		!username ||
		!email ||
		!password ||
		username === "" ||
		email === "" ||
		password === ""
	) {
		return next(errorHandler(400, "All fields are required"));
	}

	if (username.includes(" ")) {
		return next(errorHandler(400, "Username cannot contains spaces!"));
	} else if (username !== username.toLowerCase()) {
		return next(errorHandler(400, "Username must be lowercase!"));
	} else if (username.length < 5 || username.length > 20) {
		return next(
			errorHandler(400, "Username must be between 5 to 20 characters!")
		);
	} else if (!username.match(/^[a-z0-9]+$/)) {
		return next(
			errorHandler(400, "Username can only contains letters and numbers!")
		);
	}

	if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
		return next(errorHandler(400, "Enter a valid email (example@example.com)"));
	} else if (email !== email.toLowerCase()) {
		return next(errorHandler(400, "Email must be lowercase!"));
	}

	if (password.length < 9) {
		return next(errorHandler(400, "Password must be atleast 8 characters!"));
	} else if (
		!(
			password.match(/^[a-z]+$/) &&
			password.match(/^[A-Z]+$/) &&
			password.match(/^[0-9]+$/)
		)
	) {
		return next(
			errorHandler(
				400,
				"The password must contain numbers, and also both uppercase and lowercase letters.\nAnd some special characters are recommended too!"
			)
		);
	}

	if (password !== confirmPassword) {
		return next(errorHandler(400, "Your password is'nt same. Check again!"));
	}

	const checkUsername = await User.findOne({ username });
	if (checkUsername) {
		return next(errorHandler(400, "Username already taken. Try another one!"));
	}

	const checkEmail = await User.findOne({ email });
	if (checkEmail) {
		return next(errorHandler(400, "Email already exists. Try another one!"));
	}

	const hashedPassword = bcryptjs.hashSync(password, 10);

	const newUser = new User({
		username,
		email,
		password: hashedPassword,
	});

	try {
		await newUser.save();
		res.status(201).json("User created successfully");
	} catch (error) {
		next(error);
	}
};

export const signin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password || email === "" || password === "") {
		return next(errorHandler(400, "All fields are required"));
	}

	try {
		const validUser = await User.findOne({ email });
		if (!validUser) {
			return next(errorHandler(404, "User not found"));
		}
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) {
			return next(errorHandler(400, "Invalid password"));
		}
		const { password: pass, ...restInfo } = validUser._doc;

		const token = jwt.sign(
			{
				id: validUser._id,
			},
			process.env.JWT_SECRET
		);

		res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.json(restInfo);
	} catch (error) {
		next(error);
	}
};

export const google = async (req, res, next) => {
	const { email, name, googlePhotoUrl } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
			const { password, ...restInfo } = user._doc;
			res
				.status(200)
				.cookie("access_token", token, { httpOnly: true })
				.json(restInfo);
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) +
				Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
			const newUser = new User({
				username:
					name.toLowerCase().split(" ").join("") +
					Math.random().toString(9).slice(-4),
				email,
				password: hashedPassword,
				profilePicture: googlePhotoUrl,
			});
			await newUser.save();
			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
			res
				.status(200)
				.cookie("access_token", token, {
					httpOnly: true,
				})
				.json(restInfo);
		}
	} catch (error) {
		next(error);
	}
};
