import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, "You are not allowed to create a post."));
	}

	if (!req.body.title || !req.body.content) {
		return next(errorHandler(400, "Title and Content are required fields!"));
	}

	const title = req.body.title;
	const checkTitle = await Post.findOne({ title });
	if (checkTitle) {
		return next(
			errorHandler(
				400,
				"This Title already exists. Try another one!\nTry not to use special characters in title."
			)
		);
	}

	const slug = req.body.title
		.split(" ")
		.join("-")
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]/g, "-");

	const checkSlug = await Post.findOne({ slug });
	if (checkSlug) {
		return next(
			errorHandler(400, "This title already exists. Try another one!")
		);
	}

	const newPost = new Post({
		...req.body,
		slug,
		userId: req.user.id,
	});

	try {
		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (error) {
		next(error);
	}
};

export const getposts = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === "asc" ? 1 : -1;

		const posts = await Post.find({
			...(req.query.userId && { userId: req.query.userId }),
			...(req.query.category && { category: req.query.category }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.postId && { _id: req.query.postId }),
			...(req.query.searchTerm && {
				$or: [
					{ title: { $regex: req.query.searchTerm, $option: "i" } },
					{ content: { $regex: req.query.searchTerm, $option: "i" } },
				],
			}),
		})
			.sort({ updatedAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		const totalPosts = await Post.countDocuments();

		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthPosts = await Post.countDocuments({
			updatedAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			posts,
			totalPosts,
			lastMonthPosts,
		});
	} catch (error) {
		next(error);
	}
};

export const deletepost = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler("You are not allowed to delete this post"));
	}
	try {
		await Post.findByIdAndDelete(req.params.postId);
		res.status(200).json("The post has been deleted");
	} catch (error) {
		next(error);
	}
};

export const updatepost = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler("You are not allowed to update this post"));
	}
	if (!req.body.title || !req.body.content) {
		return next(errorHandler(400, "Title and Content are required fields!"));
	}

	const title = req.body.title;
	const slug = req.body.title
		.split(" ")
		.join("-")
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]/g, "-");

	const checkTitle = await Post.findOne({ title });
	const checkPost = await Post.findById(req.params.postId);
	if (checkTitle && title !== checkPost?.title) {
		return next(
			errorHandler(400, "This title already exists. Try another one!")
		);
	} else if (!checkTitle) {
		const checkSlug = await Post.findOne({ slug });
		if (checkSlug) {
			return next(
				errorHandler(
					400,
					"This title already exists. Try another one!\nTry not to use special characters in title."
				)
			);
		}
	}

	try {
		const updatedPost = await Post.findByIdAndUpdate(
			req.params.postId,
			{
				$set: {
					title: req.body.title,
					content: req.body.content,
					category: req.body.category,
					image: req.body.image,
					slug,
				},
			},
			{ new: true }
		);
		res.status(200).json(updatedPost);
	} catch (error) {
		next(error);
	}
};
