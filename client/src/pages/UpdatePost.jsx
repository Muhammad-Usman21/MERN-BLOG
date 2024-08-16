import {
	Alert,
	Button,
	FileInput,
	Select,
	Spinner,
	TextInput,
} from "flowbite-react";
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
import { MdCancelPresentation } from "react-icons/md";

const UpdatePost = () => {
	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState(null);
	const [updateErrorMsg, setUpdateErrorMsg] = useState(null);
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();
	const { postId } = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const [imageUploading, setImageUploading] = useState(false);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [getPostErrorMsg, setGetPostErrorMsg] = useState(null);
	const [getPostLoading, setGetPostLoading] = useState(false);
	const { theme } = useSelector((state) => state.theme);

	useEffect(() => {
		setGetPostErrorMsg(null);
		setGetPostLoading(true);
		try {
			const fetchPost = async () => {
				const res = await fetch(`/api/post/getposts?postId=${postId}`);
				const data = await res.json();
				if (!res.ok) {
					setGetPostErrorMsg(data.message);
					setGetPostLoading(false);
					return;
				}
				if (res.ok) {
					setGetPostLoading(false);
					setFormData(data.posts[0]);
				}
			};

			fetchPost();
		} catch (error) {
			setGetPostErrorMsg(error.message);
			setGetPostLoading(false);
		}
	}, [postId]);

	const handleUploadImage = async () => {
		setImageUploadErrorMsg(null);
		setImageUploading(true);

		try {
			if (!file) {
				setImageUploading(false);
				setImageUploadErrorMsg("Please select an image!");
				return;
			}
			if (!file.type.includes("image/")) {
				setImageUploading(false);
				setImageUploadErrorMsg(
					"File type isn't image.\nPlease select an image file!"
				);
				return;
			}
			if (file.size >= 2 * 1024 * 1024) {
				setImageUploading(false);
				setImageUploadErrorMsg("Image size must be less than 2 MBs!");
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
					setImageUploading(false);
					setImageUploadProgress(null);
					setImageUploadErrorMsg("Image Upload Failed. Try Again!");
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setImageUploadProgress(null);
						setFormData({ ...formData, image: downloadURL });
						setImageUploading(false);
					});
				}
			);
		} catch (error) {
			setImageUploadErrorMsg("Image upload failed. Try Again!");
			setImageUploading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUpdateLoading(true);

		if (!formData.title || !formData.content) {
			setUpdateLoading(false);
			setUpdateErrorMsg("Title and Content are required fields!");
		}

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
				setUpdateLoading(false);
				setUpdateErrorMsg(data.message);
				return;
			} else {
				setUpdateLoading(false);
				setUpdateErrorMsg(null);
				navigate(`/post/${data.slug}`);
			}
		} catch (error) {
			setUpdateLoading(false);
			setUpdateErrorMsg(error.message);
		}
	};

	return (
		<div
			className="min-h-screen bg-cover bg-center py-14 
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg-dark.jpg')]">
			<div
				className="flex flex-col gap-4 p-7 max-w-3xl mx-7 sm:p-10 sm:mx-12 md:mx-auto
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
				<h1 className="text-center text-3xl mb-7 font-semibold">
					Update a post
				</h1>
				{getPostLoading && (
					<div className="self-center mb-96">
						<Spinner size="xl" />
					</div>
				)}
				{!getPostErrorMsg && !getPostLoading && (
					<form
						className={`flex flex-col gap-4 ${theme}`}
						onSubmit={handleSubmit}>
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
							<TextInput
								type="text"
								placeholder="Category"
								id="category"
								onChange={(e) =>
									setFormData({ ...formData, category: e.target.value })
								}
								value={
									formData.category !== "uncategorized" ? formData.category : ""
								}
							/>
							{/* <Select
							value={formData.category}
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}>
							<option value="uncategorized">Select a category</option>
							<option value="javascript">JavaScript</option>
							<option value="reactjs">React.js</option>
							<option value="nodejs">Node.js</option>
							<option value="tailwindcss">Tailwind CSS</option>
						</Select> */}
						</div>
						<div
							className="flex flex-col sm:flex-row gap-4 items-center justify-between 
						bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3">
							<FileInput
								type="file"
								accept="image/*"
								onChange={(e) => setFile(e.target.files[0])}
								className="w-full sm:w-auto"
							/>
							<Button
								type="button"
								gradientDuoTone="purpleToBlue"
								size="sm"
								outline
								className="focus:ring-1 w-full sm:w-auto"
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
							<Alert className="flex-auto" color="failure" withBorderAccent>
								<div className="flex justify-between">
									<span>{imageUploadErrorMsg}</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => setImageUploadErrorMsg(null)}
										/>
									</span>
								</div>
							</Alert>
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
							className="h-72 mb-16 sm:mb-12"
							required
							onChange={(value) => setFormData({ ...formData, content: value })}
							value={formData.content}
						/>
						<Button
							type="submit"
							gradientDuoTone="purpleToPink"
							outline
							className="focus:ring-1 uppercase"
							disabled={updateLoading || imageUploading}>
							{updateLoading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Loading...</span>
								</>
							) : (
								"Update"
							)}
						</Button>
					</form>
				)}
				{(getPostErrorMsg || updateErrorMsg) && (
					<Alert className="flex-auto" color="failure" withBorderAccent>
						<div className="flex justify-between">
							<span>{getPostErrorMsg || updateErrorMsg}</span>
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() => {
										setGetPostErrorMsg(null);
										setUpdateErrorMsg(null);
									}}
								/>
							</span>
						</div>
					</Alert>
				)}
			</div>
		</div>
	);
};

export default UpdatePost;
