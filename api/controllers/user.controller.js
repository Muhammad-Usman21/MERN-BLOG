import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
	res.json({ message: "API is working!" });
};

export const updateUser = async (req, res, next) => {
	// console.log(req.user);
	if (req.user.id !== req.params.userId) {
		return next(errorHandler(403, "You are not allowed to update this user"));
	}

	let hashedPassword, isGoogleAuth;
	const {
		username,
		email,
		currentPassword,
		password,
		confirmPassword,
		profilePicture,
		forgetPassword,
	} = req.body;

	const validUser = await User.findById(req.params.userId);
	if (!validUser) {
		return next(errorHandler(404, "Oops! User not found."));
	}

	if (!validUser.googleAuth && !forgetPassword) {
		if (!currentPassword || currentPassword === "") {
			return next(
				errorHandler(
					400,
					"Enter your current password for update your profile."
				)
			);
		} else {
			const validPassword = bcryptjs.compareSync(
				currentPassword,
				validUser.password
			);
			if (!validPassword) {
				return next(errorHandler(400, "Invalid password. Try again!"));
			}
		}
	}

	if (password || password === "") {
		if (password !== confirmPassword) {
			return next(errorHandler(400, "Your password isn't same. Try again!"));
		}
		if (password.length < 8) {
			return next(errorHandler(400, "Password must be atleast 8 characters!"));
		}
		if (
			!(
				/[a-z]/.test(password) &&
				/[A-Z]/.test(password) &&
				/[0-9]/.test(password)
			)
		) {
			return next(
				errorHandler(
					400,
					"The password must contain numbers, and also both uppercase and lowercase letters.\nAnd some special characters are recommended too!"
				)
			);
		}

		hashedPassword = bcryptjs.hashSync(password, 10);
		isGoogleAuth = false;
	}

	if (username || username === "") {
		if (username.includes(" ")) {
			return next(errorHandler(400, "Username cannot contains spaces!"));
		}
		if (username !== username.toLowerCase()) {
			return next(errorHandler(400, "Username must be lowercase!"));
		}
		if (username.length < 5 || username.length > 30) {
			return next(
				errorHandler(400, "Username must be between 5 to 30 characters!")
			);
		}
		if (!username.match(/^[a-z0-9]+$/)) {
			return next(
				errorHandler(400, "Username can only contains letters and numbers!")
			);
		}

		const checkUsername = await User.findOne({ username });
		if (checkUsername) {
			return next(
				errorHandler(400, "Username already taken. Try another one!")
			);
		}
	}

	if (email || email === "") {
		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			return next(errorHandler(400, "Enter a valid email (name@company.com)"));
		}
		if (email !== email.toLowerCase()) {
			return next(errorHandler(400, "Email must be lowercase!"));
		}

		const checkEmail = await User.findOne({ email });
		if (checkEmail) {
			return next(errorHandler(400, "Email already exists. Try another one!"));
		}
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.userId,
			{
				$set: {
					username,
					email,
					password: hashedPassword,
					googleAuth: isGoogleAuth,
					profilePicture,
				},
			},
			{ new: true }
		);

		const { password: pass, ...restInfo } = updatedUser._doc;
		res.status(200).json(restInfo);
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.userId && !req.user.isAdmin) {
		return next(errorHandler(403, "You are not allowed to delete this user"));
	}

	const { inputPassword } = req.body;

	const validUser = await User.findById(req.user.id);
	if (!validUser) {
		return next(errorHandler(404, "Oops! User not found."));
	}

	if (!validUser.googleAuth) {
		if (!inputPassword || inputPassword === "") {
			return next(errorHandler(400, "Password required!"));
		} else {
			const validPassword = bcryptjs.compareSync(
				inputPassword,
				validUser.password
			);
			if (!validPassword) {
				return next(errorHandler(400, "Invalid password. Try again!"));
			}
		}
	}

	const validUserAdmin = await User.findById(req.params.userId);
	if (
		validUserAdmin?.isAdmin &&
		req.user.isAdmin &&
		req.params.userId !== req.user.id
	) {
		return next(errorHandler(400, "You can't delete any Admin User!"));
	}

	try {
		await User.findByIdAndDelete(req.params.userId);
		if (req.params.userId === req.user.id) {
			res.clearCookie("access_token");
		}
		res.status(200).json("User has been deleted");
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, "You are not allowed to see all users"));
	}

	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 10;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		const users = await User.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		const usersWithoutPassword = users.map((user) => {
			const { password, ...rest } = user._doc;
			return rest;
		});

		const totalUsers = await User.countDocuments();

		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthUsers = await User.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			users: usersWithoutPassword,
			totalUsers,
			lastMonthUsers,
		});
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			return next(errorHandler("User not found!"));
		}

		const { password, email, ...restInfo } = user._doc;
		res.status(200).json(restInfo);
	} catch (error) {
		next(error);
	}
};

export const followUsers = async (req, res, next) => {
	try {
		const currentUser = await User.findById(req.user.id);
		const profileUser = await User.findById(req.params.userId);
		if (!currentUser || !profileUser) {
			return next(errorHandler(404, "User not found"));
		}

		const currentUserIndex = profileUser.followers.indexOf(currentUser._id);
		const profileUserIndex = currentUser.followings.indexOf(profileUser._id);
		if (currentUserIndex === -1 && profileUserIndex === -1) {
			profileUser.followers.push(currentUser._id);
			profileUser.numberOfFollowers += 1;
			currentUser.followings.push(profileUser._id);
			currentUser.numberOfFollowings += 1;
		} else if (currentUserIndex >= 0 && profileUserIndex >= 0) {
			profileUser.followers.splice(currentUserIndex, 1);
			profileUser.numberOfFollowers -= 1;
			currentUser.followings.splice(profileUserIndex, 1);
			currentUser.numberOfFollowings -= 1;
		} else {
			return next(errorHandler(400, "Something went wrong!"));
		}

		await currentUser.save();
		await profileUser.save();
		res.status(200).json({ profileUser, selfUser: currentUser });
	} catch (error) {
		next(error);
	}
};

export const removeFollowers = async (req, res, next) => {
	try {
		const currentUser = await User.findById(req.user.id);
		const profileUser = await User.findById(req.params.userId);
		if (!currentUser || !profileUser) {
			return next(errorHandler(404, "User not found"));
		}

		const currentUserIndex = profileUser.followings.indexOf(currentUser._id);
		const profileUserIndex = currentUser.followers.indexOf(profileUser._id);
		if (currentUserIndex >= 0 && profileUserIndex >= 0) {
			profileUser.followings.splice(currentUserIndex, 1);
			profileUser.numberOfFollowings -= 1;
			currentUser.followers.splice(profileUserIndex, 1);
			currentUser.numberOfFollowers -= 1;
		} else {
			return next(errorHandler(400, "Something went wrong!"));
		}

		await currentUser.save();
		await profileUser.save();
		res.status(200).json({ profileUser, selfUser: currentUser });
	} catch (error) {
		next(error);
	}
};
