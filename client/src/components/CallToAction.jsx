import { Button } from "flowbite-react";

const CallToAction = () => {
	return (
		<div
			className="flex flex-col md:flex-row p-3 justify-center items-center my-5
                rounded-tl-3xl rounded-bl-none rounded-br-3xl rounded-tr-none text-center
                bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
			<div className="flex flex-col justify-center flex-1 p-3 sm:p-5 md:p-7">
				<h2 className="text-2xl">Want to learn more about MERN?</h2>
				<p className="text-gray-500 my-2">
					Checkout these resources with MERN full stack projects
				</p>
				<Button
					gradientDuoTone="purpleToPink"
					className="rounded-tl-xl rounded-bl-none rounded-br-xl rounded-tr-none">
					<a
						href="https://www.google.com.pk/"
						target="_blank"
						rel="noopener noreferrer">
						Learn More
					</a>
				</Button>
			</div>
			<div className="p-3 sm:p-5 md:p-7 flex-1">
				<img src="https://miro.medium.com/v2/resize:fit:1200/1*tIQ7Mi_kpkLyL9RycQeK-w.png" />
			</div>
		</div>
	);
};

export default CallToAction;
