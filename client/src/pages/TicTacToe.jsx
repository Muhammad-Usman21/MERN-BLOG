import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

const TicTacToe = () => {
	const [dataX, setDataX] = useState([]);
	const [dataO, setDataO] = useState([]);
	const [value, setValue] = useState(null);
	const [gameOver, setGameOver] = useState(null);
	const [Xturn, setXturn] = useState(true);
	const [simple, setSimple] = useState(true);
	const [draw, setDraw] = useState(false);

	const [print, setPrint] = useState({
		b0: null,
		b1: null,
		b2: null,
		b3: null,
		b4: null,
		b5: null,
		b6: null,
		b7: null,
		b8: null,
	});

	const winning = [
		["b0", "b1", "b2"],
		["b3", "b4", "b5"],
		["b6", "b7", "b8"],
		["b0", "b3", "b6"],
		["b1", "b4", "b7"],
		["b2", "b5", "b8"],
		["b0", "b4", "b8"],
		["b2", "b4", "b6"],
	];

	const handleChange = (e) => {
		setValue(e.target.id);
	};

	useEffect(() => {
		if (value) {
			if (Xturn) {
				setDataX((prevDataX) => [...prevDataX, value]);
				setPrint((prevPrint) => ({
					...prevPrint,
					[value]: "X",
				}));
				setXturn(false);

				if (!simple && dataO.length === 4) {
					setDataO((prevDataO) => {
						const [firstMove, ...rest] = prevDataO;
						setPrint((prevPrint) => ({
							...prevPrint,
							[firstMove]: "empty",
						}));
						return rest;
					});
				}
			} else {
				setDataO((prevDataO) => [...prevDataO, value]);
				setPrint((prevPrint) => ({
					...prevPrint,
					[value]: "O",
				}));
				setXturn(true);

				if (!simple && dataX.length === 4) {
					setDataX((prevDataX) => {
						const [firstMove, ...rest] = prevDataX;
						setPrint((prevPrint) => ({
							...prevPrint,
							[firstMove]: "empty",
						}));
						return rest;
					});
				}
			}
		}
	}, [value]);

	useEffect(() => {
		if (dataX.length >= 3) {
			const checkWinning = (dataX, winning) => {
				return winning.filter((win) =>
					win.every((index) => dataX.includes(index))
				);
			};

			const result = checkWinning(dataX, winning);
			if (result.length > 0) {
				setGameOver("X");
				setXturn(true);
				// console.log(result);
				result.map((innerResult, outerIndex) => {
					innerResult.map((item, innerIndex) => {
						setPrint((prevPrint) => ({
							...prevPrint,
							[item]: "greenX",
						}));
					});
				});
				return;
			}
		}
		if (!simple && dataX.length === 4) {
			const [first, ...rest] = dataX;
			setPrint((prevPrint) => ({
				...prevPrint,
				[first]: "redX",
			}));
		}

		if (simple) {
			matchDraw();
		}
	}, [dataX]);

	useEffect(() => {
		if (dataO.length >= 3) {
			const checkWinning = (dataO, winning) => {
				return winning.filter((win) =>
					win.every((index) => dataO.includes(index))
				);
			};

			const result = checkWinning(dataO, winning);
			if (result.length > 0) {
				setGameOver("O");
				setXturn(false);
				// console.log(result);
				result.map((innerResult, outerIndex) => {
					innerResult.map((item, innerIndex) => {
						setPrint((prevPrint) => ({
							...prevPrint,
							[item]: "greenO",
						}));
					});
				});
				return;
			}
		}
		if (!simple && dataO.length === 4) {
			const [first, ...rest] = dataO;
			setPrint((prevPrint) => ({
				...prevPrint,
				[first]: "redO",
			}));
		}

		if (simple) {
			matchDraw();
		}
	}, [dataO]);

	const handleReset = () => {
		Object.keys(print).forEach((b) => {
			print[b] = null;
		});
		if (!gameOver && !draw) {
			setXturn(true);
		}
		setDataX([]);
		setDataO([]);
		setValue(null);
		setGameOver(null);
		setDraw(false);
	};

	const matchDraw = () => {
		if (simple) {
			if (dataX.length === 5 && dataO.length === 4) {
				setDraw(true);
				setXturn(false);
				return;
			} else if (dataO.length === 5 && dataX.length === 4) {
				setDraw(true);
				setXturn(true);
				return;
			}
		}
	};

	return (
		<div
			className="min-h-screen py-10 md:py-5 bg-cover bg-center flex flex-col md:flex-row md:justify-center gap-10 md:gap-20 mx-auto items-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg-dark.jpg')]">
			<div
				className="flex p-8 flex-col items-center gap-3 md:gap-5 md:mb-20 dark:shadow-whiteLg
				bg-transparent border-2 dark:border-white/20 border-white/40 backdrop-blur-[9px] rounded-lg shadow-2xl">
				<div className=" flex gap-3 md:gap-5">
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b0}
						b={"b0"}
					/>
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b1}
						b={"b1"}
					/>
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b2}
						b={"b2"}
					/>
				</div>
				<div className="flex gap-3 md:gap-5">
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b3}
						b={"b3"}
					/>
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b4}
						b={"b4"}
					/>
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b5}
						b={"b5"}
					/>
				</div>
				<div className="flex gap-3 md:gap-5">
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b6}
						b={"b6"}
					/>
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b7}
						b={"b7"}
					/>
					<Block
						handleChange={handleChange}
						gameOver={gameOver}
						btn={print.b8}
						b={"b8"}
					/>
				</div>
			</div>
			<div
				className="bg-transparent border-2 dark:border-white/20 border-white/40 backdrop-blur-[9px] md:w-52
            rounded-lg shadow-xl px-10 py-5 md:mb-20 gap-8 flex md:flex-col items-center justify-center dark:shadow-whiteLg">
				<div className="flex flex-col items-center justify-center">
					<span>{simple ? "SIMPLE MODE" : "COMPLEX MODE"}</span>
					<Button
						outline
						gradientDuoTone={"purpleToPink"}
						className="mt-3 md:mt-5 focus:ring-1"
						onClick={() => {
							setSimple(!simple);
							handleReset();
						}}>
						{simple ? "Try Complex" : "Try Simple"}
					</Button>
				</div>
				<div className="flex flex-col items-center justify-center">
					<span className="md:mt-16">
						{gameOver === "X" || gameOver === "O"
							? `Player ${gameOver} wins`
							: draw
							? "Its a draw"
							: Xturn
							? "Player X turn"
							: "Player O turn"}
					</span>
					<Button
						onClick={handleReset}
						outline
						gradientDuoTone={"purpleToBlue"}
						className="uppercase mt-3 md:mt-5 focus:ring-1">
						Reset
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TicTacToe;

const Block = ({ handleChange, gameOver, btn, b }) => {
	const isRed = btn?.includes("red");
	const isGreen = btn?.includes("green");
	const isDisabled = btn?.includes("X") || btn?.includes("O") || gameOver;
	const btnText = btn?.includes("X") ? " X" : btn?.includes("O") ? "O" : "";

	return (
		<button
			id={b}
			value={b}
			onClick={handleChange}
			// bg-gray-100 dark:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-800
			className={`${
				isRed
					? "text-red-500"
					: isGreen
					? "text-green-400"
					: "text-gray-600 dark:text-gray-300"
			} 	bg-transparent border-2 dark:border-white/40 border-white/80 backdrop-blur-[9px] shadow-lg
				w-20 h-20 md:w-32 md:h-32 text-5xl md:text-8xl rounded-lg hover:opacity-80 disabled:cursor-not-allowed
				disabled:bg-gray-300 dark:disabled:bg-slate-900 dark:shadow-whiteLg`}
			disabled={isDisabled}>
			{btnText}
		</button>
	);
};
