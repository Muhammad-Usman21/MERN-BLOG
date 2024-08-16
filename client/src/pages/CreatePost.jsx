import {
	Alert,
	Button,
	FileInput,
	Select,
	Spinner,
	TextInput,
} from "flowbite-react";
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { MdCancelPresentation } from "react-icons/md";
import { useSelector } from "react-redux";

const CreatePost = () => {
	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState(null);
	const [publishErrorMsg, setPublishErrorMsg] = useState(null);
	const [imageUploading, setImageUploading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();
	const { theme } = useSelector((state) => state.theme);

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
		setPublishErrorMsg(null);
		setLoading(true);

		if (!formData.title || !formData.content) {
			setLoading(false);
			setPublishErrorMsg("Title and Content are required fields!");
		}

		try {
			const res = await fetch("/api/post/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				setLoading(false);
				setPublishErrorMsg(data.message);
				return;
			} else {
				setLoading(false);
				setPublishErrorMsg(null);
				navigate(`/post/${data.slug}`);
			}
		} catch (error) {
			setPublishErrorMsg(error.message);
			setLoading(false);
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
					Create a post
				</h1>
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
						/>
						<TextInput
							type="text"
							placeholder="Category"
							id="category"
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}
						/>
						{/* <Select
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
					/>
					<Button
						type="submit"
						gradientDuoTone="purpleToPink"
						outline
						className="focus:ring-1 uppercase"
						disabled={loading || imageUploading}>
						{loading ? (
							<>
								<Spinner size="sm" />
								<span className="pl-3">Loading...</span>
							</>
						) : (
							"Publish"
						)}
					</Button>
				</form>
				{publishErrorMsg && (
					<Alert className="flex-auto" color="failure" withBorderAccent>
						<div className="flex justify-between">
							<span>{publishErrorMsg}</span>
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() => setPublishErrorMsg(null)}
								/>
							</span>
						</div>
					</Alert>
				)}
			</div>
		</div>
	);
};

export default CreatePost;
