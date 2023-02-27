import fs from "fs";
import path from "path";



class FileManager {
	#basePath;

	constructor(basePath) {
		this.#basePath = path.resolve(basePath);
	};

	fullPath = (path) => `${this.#basePath}/${path}`;

	readFile = async(path) => {
		const content = await fs.promises.readFile(this.fullPath(path));
		return content;
	};

	readDir = async(path="") => {
		const files = await fs.promises.readdir(this.fullPath(path));
		return files;
	};

	saveTextFile = async(path,text) => {
		await fs.promises.writeFile(this.fullPath(path),text);
	};

	removeFile = async(path,{ throwError=true,printError=false }={}) => {
		try {
			await fs.promises.rm(this.fullPath(path));
		} catch(exception) {
			if(printError) console.log("Error when removing file (FileManager)",exception);
			if(throwError) throw exception;
		}
	};
};



export default FileManager
