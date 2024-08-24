import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
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

export const getPostsPublic = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		const posts = await Post.find({
			...(req.query.userId && { userId: req.query.userId }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.postId && { _id: req.query.postId }),
			...(req.query.category && {
				category: { $regex: req.query.category, $options: "i" },
			}),
			...(req.query.searchTerm && {
				$or: [
					{ title: { $regex: req.query.searchTerm, $options: "i" } },
					{ content: { $regex: req.query.searchTerm, $options: "i" } },
				],
			}),
		})
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		res.status(200).json(posts);
	} catch (error) {
		next(error);
	}
};

export const getPosts = async (req, res, next) => {
	try {
		if (!req.user.isAdmin) {
			return next(errorHandler(403, "You cant get all info"));
		}

		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 10;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		const posts = await Post.find({
			...(req.query.userId && { userId: req.query.userId }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.postId && { _id: req.query.postId }),
			...(req.query.category && {
				category: { $regex: req.query.category, $options: "i" },
			}),
			...(req.query.searchTerm && {
				$or: [
					{ title: { $regex: req.query.searchTerm, $options: "i" } },
					{ content: { $regex: req.query.searchTerm, $options: "i" } },
				],
			}),
		})
			.sort({ createdAt: sortDirection })
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
			createdAt: { $gte: oneMonthAgo },
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

export const deletePost = async (req, res, next) => {
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

export const updatePost = async (req, res, next) => {
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

export const postLikes = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.postId);
		if (!post) {
			return next(errorHandler(404, "Post not found"));
		}
		const userIndex = post.likes.indexOf(req.user.id);
		if (userIndex === -1) {
			post.numberOfLikes += 1;
			post.likes.push(req.user.id);
		} else {
			post.numberOfLikes -= 1;
			post.likes.splice(userIndex, 1);
		}
		await post.save();
		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};

export const countTotalPostsByUser = async (req, res, next) => {
	try {
		const totalPostsByUser = await Post.countDocuments({
			userId: req.params.userId,
		});

		res.status(200).json(totalPostsByUser);
	} catch (error) {
		next(error);
	}
};

export const countPostsLikedByUser = async (req, res, next) => {
	try {
		const userLikeCount = await Post.countDocuments({
			likes: req.params.userId,
		});

		res.status(200).json(userLikeCount);
	} catch (error) {
		next(error);
	}
};

export const getPostsLikedByUser = async (req, res, next) => {
	try {
		if (!req.user.isAdmin && req.user.id !== req.params.userId) {
			return next(errorHandler(400, "You cant see all posts liked by a user"));
		}

		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 10;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		const likedPosts = await Post.find({ likes: req.query.userId })
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		res.status(200).json(likedPosts);
	} catch (error) {
		next(error);
	}
};
