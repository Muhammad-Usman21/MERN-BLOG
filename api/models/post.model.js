import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			requird: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		content: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default:
				"https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
		},
		category: {
			type: String,
			default: "uncategorized",
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		likes: {
			type: Array,
			default: [],
		},
		numberOfLikes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
