import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
	countLikesByUser,
	create,
	deletepost,
	getposts,
	postLikes,
	updatepost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.put("/like-post/:postId", verifyToken, postLikes);
router.get("/get-totalLikes/:userId", countLikesByUser);

export default router;
