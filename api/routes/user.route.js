import express from "express";
import {
	test,
	updateUser,
	deleteUser,
	getUsers,
	getUser,
	followUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/getusers", verifyToken, getUsers);
router.get("/getuser/:userId", verifyToken, getUser);
router.put("/followUser/:userId", verifyToken, followUsers);

export default router;
