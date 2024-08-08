import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
	BsFacebook,
	BsInstagram,
	BsTwitter,
	BsTwitterX,
	BsGithub,
	BsLinkedin,
	BsDiscord,
} from "react-icons/bs";

const FooterComp = () => {
	return (
		<Footer container className="border border-t-8 border-teal-800 dark:bg-[#121416]">
			<div className="w-full max-w-7xl mx-auto">
				<div className="flex flex-col items-center gap-8 w-full sm:flex-row sm:justify-between">
					<div className="mt-4 sm:mt-0">
						<Link
							to="/"
							className="self-center whitespace-nowrap font-semibold dark:text-white text-2xl">
							<span
								className="px-2 py-1 bg-gradient-to-r from-indigo-500 
                                via-purple-500 to-pink-500 rounded-lg text-white">
								{"Usman's"}
							</span>
							Blog
						</Link>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-8 mt-4 sm:mt-0">
						<div>
							<Footer.Title title="About" />
							<Footer.LinkGroup col>
								<Footer.Link
									href="/about"
									target="_blank"
									rel="noopener noreferrer">
									{"Usman's Blog"}
								</Footer.Link>
								<Footer.Link
									href="https://usmanestate.onrender.com/"
									target="_blank"
									rel="noopener noreferrer">
									My Project
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Legal" />
							<Footer.LinkGroup col>
								<Footer.Link href="#">Privacy Policy</Footer.Link>
								<Footer.Link href="#">Terms & Conditions</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Follow us" />
							<Footer.LinkGroup col>
								<Footer.Link
									href="https://www.linkedin.com"
									target="_blank"
									rel="noopener noreferrer">
									Linkedin
								</Footer.Link>
								<Footer.Link
									href="https://github.com"
									target="_blank"
									rel="noopener noreferrer">
									Github
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
				</div>
				<Footer.Divider />
				<div className="flex flex-col justify-center items-center gap-4 sm:flex-row sm:justify-between sm:px-2">
					<Footer.Copyright
						href="#"
						by="Usman's blog"
						year={new Date().getFullYear()}
					/>
					<div className="flex gap-4">
						<Footer.Icon href="#" icon={BsFacebook} />
						<Footer.Icon href="#" icon={BsInstagram} />
						<Footer.Icon href="#" icon={BsTwitter} />
						<Footer.Icon href="#" icon={BsTwitterX} />
						<Footer.Icon href="#" icon={BsLinkedin} />
						<Footer.Icon href="#" icon={BsGithub} />
						<Footer.Icon href="#" icon={BsDiscord} />
					</div>
				</div>
			</div>
		</Footer>
	);
};

export default FooterComp;
