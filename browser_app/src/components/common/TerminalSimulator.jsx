import React, { useEffect, useRef, useState } from 'react'
import { isBrowser, isMobile } from 'react-device-detect';
import { interrupt } from 'jutils';



class TerminalEmulator {
	#lines;
	#currentLine;
	#executionStack;
	#diplayListenerCounter;
	#displayListeners;
	#commands;

	constructor(commands={}) {
		this.#lines = [];
		this.#currentLine = "";
		this.#executionStack = [];
		this.#diplayListenerCounter = 0;
		this.#displayListeners = {};
		this.#commands = { ...commands,..._commands };
	};

	newLine = () => {
		this.#lines.push(this.#currentLine);
		this.#currentLine = "";
	};
	#clear = () => {
		this.#lines = [];
		this.#currentLine = "";
	};
	#addText = (char) => this.#currentLine += char;
	#delChar = () => this.#currentLine = this.#currentLine.slice(0,~0);

	// --> services
	input = async() => {
		let line = "";
		const waitForEnter = interrupt();
		const inputListener = (char) => {
			switch(char) {
				case "\b" : {
					if(line.length > 0) {
						line = line.slice(0,~0)
						this.#delChar();
						this.#notifyListeners()
					};
				} break;
				case "\n" : {
					this.newLine();
					this.#notifyListeners()
					waitForEnter.release();
				} break;
				default : {
					line += char;
					this.#addText(char)
					this.#notifyListeners()
				};
			};
		};

		this.#executionStack.push({ inputListener });
		await waitForEnter;
		this.#executionStack.pop()
		return line;
	};

	printChar = (char) => {
		if(char === "\n") this.newLine();
		else if(char === "\b") this.#delChar();
		else this.#addText(char);
		this.#notifyListeners();
	};

	printText = (text) => {
		const newText = this.#currentLine + text;
		const newLines = newText.split("\n");
		this.#addText(newLines[0]);
		for(const line of newLines.slice(1)) {
			this.newLine();
			this.#addText(line)
		};
		this.#notifyListeners();
	};

	setLine = (text) => {
		this.#currentLine = text;
		this.#notifyListeners();
	};

	clear = () => {
		this.#clear();
		this.#notifyListeners();
	};

	run = async(command,args) => {
		this.#executionStack.push(command);
		await command.fn({ printText:this.printText,printChar:this.printChar,input:this.input,clear:this.clear,execute:this.run,command:this.command,setLine:this.setLine,newLine:this.newLine },args);
		this.#executionStack.pop();
	};

	command = (commandName) => this.#commands[commandName];
	// <-- services



	// --> for user interface
	init = (command,args,noError=false) => {
		if(this.#executionStack.length !== 0) {if(noError) return; else throw new Error("Terminal is already initialized");};
		this.run(command,args);
	};

	pushChar = (char) => {
		const process = this.#executionStack[this.#executionStack.length-1];
		if(process && process.inputListener) process.inputListener(char);
		else this.printChar(char);
	};
	
	pullText = () => {
		let string = "";
		for(const line of this.#lines) string += line + "\n";
		string += this.#currentLine;
		return string;
	};

	// ----> listeners
	registerListenerFunction = (listenerFunction) => {
		listenerFunction._listenerId = this.#diplayListenerCounter++;
		this.#displayListeners[listenerFunction._listenerId] = listenerFunction;
	};

	#notifyListeners = () => {
		for(const listener of Object.values(this.#displayListeners)) listener();
	};

	removeListenerFunction = (listenerFunction) => {
		delete this.#displayListeners[listenerFunction._listenerId];
	};
	// <---- listeners
	// <-- for user interface
}

//////////////////

class ShellExecutable {
	#executable;
	inputListener;

	constructor(executable) {
		this.#executable = executable;
		this.inputListener = null;
	}

	fn = async(tty,args) => await this.#executable(this,tty,args);
}

const xx_shell = new ShellExecutable(async(process,tty,args) => {
	while(true) {
		tty.printText(`user@${window.location.hostname}:/$ `);
		const commandName = await tty.input();
		if(!commandName) continue;
		if(commandName === "exit") break;
		else {
			const command = tty.command(commandName);
			if(command) await tty.execute(command,[]);
			else tty.printText(`${commandName}: command not found\n`);
		}
	};
});

const xx_clear = new ShellExecutable(async(process,tty,args) => tty.clear());

const xx_tester = new ShellExecutable(async(process,tty,args) => {
	let waiterResolve = null;
	const waiter = new Promise( (resolve,reject) => waiterResolve=resolve );
	const websocket = new WebSocket("ws://localhost:7890/");
	// redirect input from websocket to terminal simulator
	websocket.addEventListener("open",(event) => {
		process.inputListener = (char) => {websocket.send(char);tty.printChar(char)};
		websocket.send("\\@@print{testing}\\@@let\\variable>\\@@prompt{Write: }\\@@print{\\variable}");
	});
	websocket.addEventListener("message",(event) => {tty.printText(event.data)});
	websocket.addEventListener("close",(event) => {waiterResolve()});
	websocket.addEventListener("error",(event) => {waiterResolve()});
	await waiter;
});

//////////////////

const _commands = {
	shell : xx_shell,
	clear : xx_clear,
	tester : xx_tester,
};

////////////////////

const useTerminal = (commands={}) => {
	const { current:terminal } = useRef(new TerminalEmulator(commands));
	const [ text,setText ] = useState(terminal.pullText());

	useEffect(() => {
		const listener = () => setText(terminal.pullText());
		terminal.registerListenerFunction(listener);
		return () => terminal.removeListenerFunction(listener);
	},[]);

	return { text,pushChar:terminal.pushChar,clear:terminal.clear,init:terminal.init };
};



const terminalStyle = {
	padding: '20px',
	height: '100%',
	width : "100%",
	fontSize: '15px',
	color: '#FFFFFF',
	fontFamily: 'monospace',
	resize : "none",
	backgroundColor: '#212121',
	backgroundSize: 'cover',
	caretColor : "transparent",
};

const TerminalSimulator = ({ commands }) => {
	const { text,pushChar,init } = useTerminal(commands);
	const terminalRoot = useRef(null);
	
	const handleInput = (event) => {
		if(event.key.length === 1) pushChar(event.key);
		else {
			switch (event.key) {
				case "Enter" : pushChar("\n"); break;
				case "Backspace" : pushChar("\b"); break;
			}
		}
	};

	useEffect(() => {init(_commands.shell,[],true)},[]);

	useEffect(() => {terminalRoot.current.scrollTop = terminalRoot.current.scrollHeight},[text]);

	return (
		<form
		name='react-console-emulator'
		>
			{isMobile && <p>The Terminal Simulator doesn't work properly on all mobile devices</p>}
			<textarea
			ref={terminalRoot}
			name='react-console-emulator__content'
			style={terminalStyle}
			readOnly={isBrowser}
			rows={15}
			spellCheck={false}
			value={text + "_"}
			onChange={() => {}}
			onKeyDown={handleInput}
			/>
		</form>
	)
};



export default TerminalSimulator;
export { ShellExecutable };
