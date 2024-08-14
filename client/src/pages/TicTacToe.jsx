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
			const result = (dataX, winning) => {
				return winning.some((win) =>
					win.every((index) => dataX.includes(index))
				);
			};
			if (result(dataX, winning)) {
				setGameOver("X");
				setXturn(true);
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
			const result = (dataO, winning) => {
				return winning.some((win) =>
					win.every((index) => dataO.includes(index))
				);
			};
			if (result(dataO, winning)) {
				setGameOver("O");
				setXturn(false);
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
				className="flex p-8 flex-col items-center gap-3 md:gap-5 md:mb-20
				bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-lg">
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
				className="bg-transparent border-2 border-white/20 backdrop-blur-[9px] md:w-52
            rounded-lg shadow-lg px-10 py-5 md:mb-20 gap-8 flex md:flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center">
					<span>{simple ? "SIMPLE MODE" : "COMPLEX MODE"}</span>
					<Button
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
	const isDisabled = btn?.includes("X") || btn?.includes("O") || gameOver;
	const btnText = btn?.includes("X") ? " X" : btn?.includes("O") ? "O" : "";

	return (
		<button
			id={b}
			value={b}
			onClick={handleChange}
			className={`w-20 h-20 md:w-32 md:h-32 text-5xl md:text-8xl rounded-lg bg-cyan-300 
                        disabled:bg-cyan-600 hover:opacity-80 disabled:cursor-not-allowed
                        ${isRed ? "text-red-600" : "text-white"}`}
			disabled={isDisabled}>
			{btnText}
		</button>
	);
};
