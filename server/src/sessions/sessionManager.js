import jwt from "jsonwebtoken";
import crypto from "crypto";
import { wait } from "jutils";
import FileManager from "../files/fileManager.js";



class SessionManager {
	authenticator;
	userManager;
	#secretKey;
	sessionFileStore;
	sessionStorePath;

	constructor({ jWTSigningKey,sessionStorePath }) {
		this.sessions = {};
		this.#secretKey = jWTSigningKey;
		this.sessionStorePath = sessionStorePath;
	};

	init = async(authenticator,userManager) => {
		this.authenticator = authenticator;
		this.userManager = userManager;
		this.sessionFileStore = new FileManager(this.sessionStorePath);
		// restore sessions from disk
		const savedSessions = await this.sessionFileStore.readDir();
		for(const file of savedSessions)
			await this._retrieveSessionDataFromDisk(file);
		// task that runs on regular intervals in the background
		this._cleanSessions();
	};

	close = async() => {
		this.sessions = null;
	};

	newUserSession = async(email,password) => {
		const user = await this.userManager.getUserByEmail(email);
		if(!user._id) return { error:"Invalid email"};
		const passwordIsCorrect = await this.authenticator.verifyUserPassword(user._id,password);
		if(!passwordIsCorrect) return { error:"Invalid password" };
		const sessionData = SessionData.generate(user,10800000);//+3 hours of session time
		this._storeSessionDataToDisk(sessionData);
		const sessionToken = jwt.sign({ sessionId:sessionData._id },this.#secretKey);
		return { sessionToken };
	};

	_storeSessionDataToDisk = async(sessionData) => {
		const sessionDataJSON = JSON.stringify(sessionData._object);
		await this.sessionFileStore.saveTextFile(`${sessionData._id}.json`,sessionDataJSON);
	};

	_retrieveSessionDataFromDisk = async(filename) => {
		const json = await this.sessionFileStore.readFile(filename);
		const { _id,userId,expiry } = JSON.parse(json);
		if(expiry < Date.now()) {
			this.sessionFileStore.removeFile(filename);
			return null;
		};
		const user = await this.userManager.getUserById(userId);
		const sessionData = new SessionData(_id,user,expiry);
		return sessionData;
	};

	getSessionUser = async(sessionToken) => {
		const { sessionId } = jwt.verify(sessionToken,this.#secretKey);
		if(!sessions.hasOwnProperty(sessionId)) return { error:"Session doesn't exist (possibly expired) please (re)login" };
		const { user,expiry } = sessions[sessionId];
		if(expiry < Date.now()) {
			this._removeSession(sessionId);
			return { error:"Session has expired, please (re)login" };
		};
		return { user };
	};

	closeSession = async(sessionToken) => {
		const { sessionId } = jwt.verify(sessionToken,this.#secretKey);
		this._removeSession(sessionId);
	};

	_removeSession = async(sessionId) => {
		if(sessions.hasOwnProperty(sessionId))
			delete sessions[sessionId];
		await this.sessionFileStore.removeFile(`${sessionId}.json`,{ throwError:false,printError:true });
	};

	_cleanSessions = async() => {
		await wait(600000);
		while(true) {
			for(const { _id:sessionId,expiry } of Object.values(sessions))
				if(expiry < Date.now())
					await this._removeSession(sessionId);
			await wait(600000)
		};
	};
};

const sessions = {};

class SessionData {
	#id;
	#user;
	#expiry;

	constructor(_id,user,expiry) {
		sessions[_id] = this;
		this.#id = _id;
		this.#user = user;
		this.#expiry = expiry;
	};

	static generate = (user,validTime) => {
		const expiry = new Date(Date.now() + validTime);
		let sessionId = crypto.randomBytes(8).toString("hex");
		while(sessions.hasOwnProperty(sessionId))
			sessionId = crypto.randomBytes(8).toString("hex");
		const sessionData = new SessionData(sessionId,user,expiry);
		return sessionData;
	};

	get _id() {return this.#id};
	get user() {return this.#user};
	get expiry() {return this.#expiry};
	get _object() {
		const _object = {
			_id : this.#id,
			userId : this.#user._id,
			expiry : this.#expiry.getTime(),
		};
		return _object;
	};
};



export default SessionManager;

/*
*/