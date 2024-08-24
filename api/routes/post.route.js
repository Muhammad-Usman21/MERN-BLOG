import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
	countPostsLikedByUser,
	createPost,
	deletePost,
	getPosts,
	getPostsLikedByUser,
	getPostsPublic,
	postLikes,
	countTotalPostsByUser,
	updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getposts-public", getPostsPublic);
router.post("/create-post", verifyToken, createPost);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost);
router.put("/update-post/:postId/:userId", verifyToken, updatePost);
router.get("/getposts", verifyToken, getPosts);
router.put("/like-post/:postId", verifyToken, postLikes);
router.get(
	"/countTotalPostsByUser/:userId",
	verifyToken,
	countTotalPostsByUser
);
router.get("/getPostsLikedByUser", verifyToken, getPostsLikedByUser);
router.get(
	"/countPostsLikedByUser/:userId",
	verifyToken,
	countPostsLikedByUser
);

export default router;
