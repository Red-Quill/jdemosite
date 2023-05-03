import React, { useEffect, useState } from 'react';
import axios from "axios";
import { interrupt } from 'jutils';
import TerminalSimulator,{ ShellExecutable } from "../../common/TerminalSimulator";



const tGlobalState = { tCode:"" };

const textDecoder = new TextDecoder();

const executeTextBoxCode = new ShellExecutable(async(process,tty,args) => {
	const hostname = window.location.hostname;
	const port = hostname === "localhost" ? 7890 : 443;
	const protocol = hostname === "localhost" ? "ws://" : "wss://";
	const websocket = new WebSocket(`${protocol}${hostname}:${port}/tdemo`);
	websocket.binaryType = "arraybuffer";
	const waitForConnectionToClose = interrupt();	
	websocket.addEventListener("open",(event) => {
		// send user input (keystrokes) outbound to webseocket and echo to terminal
		process.inputListener = (char) => {
			websocket.send(char);
			tty.printChar(char)
		};
		// send code to be execute in first message (server expects first message to be the code)
		websocket.send(tGlobalState.tCode);
	});
	// inbound from websocket to terminal simulator
	websocket.addEventListener("message",({ data }) => {
		const bytes = new Uint8Array(data);
		const type = bytes[0]
		const text = textDecoder.decode(bytes.slice(1));
		switch(type) {
			case 0: tty.newLine(); break;
			case 1: tty.setLine(text); break;
			case 2: {
				tty.setLine(text);
				tty.newLine();
			} break;
		};
	});
	websocket.addEventListener("close",(event) => {waitForConnectionToClose.release()});
	websocket.addEventListener("error",(event) => {
		tty.printText("Websocket connection to T demo server failed. I'm sorry.\n")
		waitForConnectionToClose.release()
	});
	// wait for the connection to close (normally or on error)
	await waitForConnectionToClose;
});

const Tscript = () => {
	const [ samples,setSamples ] = useState({ instructions:"",fizzbuzz:"",rock_paper_scissors:"" });
	const [ tCode,setTCode ] = useState("");

	const fetchSamples = async() => {
		const newSamples = {};
		const [ instructions,fizzbuzz,rock_paper_scissors ] = await Promise.all([
			axios("/media/t_code_samples/instructions.t"),
			axios("/media/t_code_samples/fizzbuzz.t"),
			axios("/media/t_code_samples/rock_paper_scissors.t"),
		]);
		newSamples.instructions = instructions.data || "";
		newSamples.fizzbuzz = fizzbuzz.data || "";
		newSamples.rock_paper_scissors = rock_paper_scissors.data || "";
		setSamples(newSamples);
		setTCode(instructions.data || "");
	};

	useEffect(() => {tGlobalState.tCode = tCode},[tCode]);
	useEffect(() => {fetchSamples()},[]);

	return (
		<div>
			<button onClick={() => setTCode(samples.instructions)}>Instructions</button>
			<button onClick={() => setTCode(samples.fizzbuzz)}>Fizzbuzz</button>
			<button onClick={() => setTCode(samples.rock_paper_scissors)}>Rock Paper Scissors</button>
			<textarea
				className="form-control"
				name="tcode"
				rows={8}
				onChange={({ target:{ value } }) => setTCode(value)}
				value={tCode}
			>
			</textarea>
			<p>Write "run" in the terminal simulator below and press enter.</p>
			<TerminalSimulator commands={{ run:executeTextBoxCode }}/>
		</div>
	);
};



export default Tscript;
