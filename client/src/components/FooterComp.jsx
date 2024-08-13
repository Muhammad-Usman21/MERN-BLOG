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
import { HoverBorder } from "./extra/HoverBorder";

const FooterComp = () => {
	return (
		<Footer
			container
			className="rounded-none border-t-4 border-teal-700 dark:border-[#374151] bg-cover bg-center 
			bg-[url('../../h&f-light.jpg')] dark:bg-[url('../../footer-dark.jpg')]">
			<div className="w-full max-w-7xl mx-auto">
				<div className="flex flex-col items-center gap-8 w-full sm:flex-row sm:justify-between">
					<div className="mt-4 sm:mt-0">
						<Link
							to="/"
							className="font-semibold dark:text-white text-xl flex items-center">
							<HoverBorder>{"Usman's"}</HoverBorder>
							<span className="ml-2 text-3xl">Blog</span>
						</Link>
					</div>
					<div
						className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-8 mt-4 sm:mt-0 text-center
						bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-lg p-3">
						<div>
							<Footer.Title title="About" />
							<Footer.LinkGroup col className="space-y-2">
								<Footer.Link
									className="m-0 p-0"
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
							<Footer.LinkGroup col className="space-y-2">
								<Footer.Link href="#">Privacy Policy</Footer.Link>
								<Footer.Link href="#">Terms & Conditions</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Follow us" />
							<Footer.LinkGroup col className="space-y-2">
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
