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
				<div className="flex flex-col items-center gap-4 w-full sm:flex-row sm:justify-between">
					<div className="mt-4 sm:mt-0">
						<Link
							to="/"
							className="font-semibold dark:text-white text-xl flex items-center
							bg-transparent border-2 border-white/60 dark:border-white/20 dark:p-[14px] 
							backdrop-blur-[9px] rounded-full shadow-xl p-3 pr-4 dark:shadow-whiteLg">
							<HoverBorder>{"Usman's"}</HoverBorder>
							<span className="ml-2 text-3xl">Blog</span>
						</Link>
					</div>
					<div
						className="grid grid-cols-2 gap-8 lg:grid-cols-4 sm:gap-10 mt-4 sm:mt-0 text-center dark:shadow-whiteLg
						bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl px-7 py-4">
						<div>
							<Footer.Title title="My Projects" />
							<Footer.LinkGroup col className="space-y-2">
								<Footer.Link
									className="m-0 p-0"
									href="/"
									target="_blank"
									rel="noopener noreferrer">
									{"Usman's Blog"}
								</Footer.Link>
								<Footer.Link
									href="https://usmanestate.onrender.com/"
									target="_blank"
									rel="noopener noreferrer">
									Real Estate
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="My Games" />
							<Footer.LinkGroup col className="space-y-2">
								<Footer.Link
									className="m-0 p-0"
									href="/tic-tac-toe"
									target="_blank"
									rel="noopener noreferrer">
									Tic Tac Toe
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Follow me" />
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
						<div>
							<Footer.Title title="Legal" />
							<Footer.LinkGroup col className="space-y-2">
								<Footer.Link href="#">Privacy Policy</Footer.Link>
								<Footer.Link href="#">Terms & Conditions</Footer.Link>
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
						<Footer.Icon
							href="#"
							icon={BsFacebook}
							className="hover:text-blue-500 dark:hover:text-blue-500"
						/>
						<Footer.Icon
							href="#"
							icon={BsInstagram}
							className="hover:text-pink-500 dark:hover:text-pink-500"
						/>
						<Footer.Icon
							href="#"
							icon={BsTwitter}
							className="hover:text-blue-500 dark:hover:text-blue-500"
						/>
						<Footer.Icon href="#" icon={BsTwitterX} />
						<Footer.Icon
							href="#"
							icon={BsLinkedin}
							className="hover:text-blue-500 dark:hover:text-blue-500"
						/>
						<Footer.Icon href="#" icon={BsGithub} />
						<Footer.Icon
							href="#"
							icon={BsDiscord}
							className="hover:text-blue-500 dark:hover:text-blue-500"
						/>
					</div>
				</div>
			</div>
		</Footer>
	);
};

export default FooterComp;
