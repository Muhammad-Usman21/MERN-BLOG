import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState(null);
	const [publishErrorMsg, setPublishErrorMsg] = useState(null);
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();
	const { postId } = useParams();
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		try {
			const fetchPost = async () => {
				const res = await fetch(`/api/post/getposts?postId=${postId}`);
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
					setPublishErrorMsg(data.message);
					return;
				}
				if (res.ok) {
					setPublishErrorMsg(null);
					setFormData(data.posts[0]);
				}
			};

			fetchPost();
		} catch (error) {
			console.log(error.message);
		}
	}, [postId]);

	const handleUploadImage = async () => {
		setImageUploadErrorMsg(null);
		try {
			if (!file) {
				setImageUploadErrorMsg("Please select an image.");
				return;
			}
			const storage = getStorage(app);
			const fileName = new Date().getTime() + "-" + file.name;
			const storgeRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storgeRef, file);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImageUploadProgress(progress.toFixed(0));
				},
				(error) => {
					setImageUploadErrorMsg("Image Upload Failed");
					setImageUploadProgress(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setImageUploadProgress(null);
						setFormData({ ...formData, image: downloadURL });
					});
				}
			);
		} catch (error) {
			setImageUploadErrorMsg("Image upload failed");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(
				`/api/post/updatepost/${formData._id}/${currentUser._id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);
			const data = await res.json();
			if (!res.ok) {
				setPublishErrorMsg(data.message);
				return;
			} else {
				setPublishErrorMsg(null);
				navigate(`/post/${data.slug}`);
			}
		} catch (error) {
			setPublishErrorMsg(error.message);
		}
	};

	return (
		<div
			className="min-h-screen bg-cover bg-center py-14 
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg-dark.jpg')]">
			<div
				className="p-7 max-w-3xl mx-7 sm:p-10 sm:mx-12 md:mx-auto
				bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-lg">
				<h1 className="text-center text-3xl mb-7 font-semibold">
					Update a post
				</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-4 sm:flex-row justify-between">
						<TextInput
							type="text"
							placeholder="Title"
							required
							id="title"
							className="flex-1"
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							value={formData.title}
						/>
						<Select
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}
							value={formData.category}>
							<option value="uncategorized">Select a category</option>
							<option value="javascript">JavaScript</option>
							<option value="reactjs">React.js</option>
							<option value="nodejs">Node.js</option>
							<option value="tailwindcss">Tailwind CSS</option>
						</Select>
					</div>
					<div
						className="flex gap-4 items-center justify-between 
					border-4 border-teal-500 border-dotted p-3">
						<FileInput
							type="file"
							accept="image/*"
							onChange={(e) => setFile(e.target.files[0])}
						/>
						<Button
							type="button"
							gradientDuoTone="purpleToBlue"
							size="sm"
							outline
							className="focus:ring-1"
							onClick={handleUploadImage}
							disabled={imageUploadProgress}>
							{imageUploadProgress ? (
								<div className="flex items-center">
									<CircularProgressbar
										className="h-5"
										value={imageUploadProgress}
									/>
									<span className="ml-1">Uploading...</span>
								</div>
							) : (
								"Upload Image"
							)}
						</Button>
					</div>
					{imageUploadErrorMsg && (
						<Alert color="failure">{imageUploadErrorMsg}</Alert>
					)}
					{formData.image && (
						<img
							src={formData.image}
							alt="upload"
							className="w-full h-72 object-cover border 
						border-gray-500 dark:border-gray-300"
						/>
					)}
					<ReactQuill
						theme="snow"
						placeholder="Write something...."
						className="h-72 mb-12"
						required
						onChange={(value) => setFormData({ ...formData, content: value })}
						value={formData.content}
					/>
					<Button
						type="submit"
						gradientDuoTone="purpleToPink"
						outline
						className="focus:ring-1 uppercase">
						Update
					</Button>
				</form>
				{publishErrorMsg && (
					<Alert className="mt-5" color="failure">
						{publishErrorMsg}
					</Alert>
				)}
			</div>
		</div>
	);
};

export default UpdatePost;
