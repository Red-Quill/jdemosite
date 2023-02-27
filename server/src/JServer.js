import Api from "./api/api.js";
import DatabaseManager from "./database/databaseManager.js";
import BlogManager from "./blogManagement/blogManager.js";
import CourseManager from "./courses/courseManager.js";
import UserManager from "./userManagement/userManager.js";
import Authenticator from "./authentication/authenticator.js";
import SessionManager from "./sessions/sessionManager.js";
import LogManager from "./logging/logManager.js";



class JServer {
	dataBaseManager;
	jApi;
	listeners;

	constructor() {
		this.listeners = {};
	}

	// arguments are configuration objects
	init = async({ server,database,blog,courses,sessions,logger }) => {
		const { httpPort } = server;
		const logManager = new LogManager(logger);
		
		this.dataBaseManager = new DatabaseManager(database);
		await this.dataBaseManager.connect();
		
		const authenticator = new Authenticator();
		const blogManager = new BlogManager(blog);
		const userManager = new UserManager();
		const courseManager = new CourseManager(courses);
		const sessionManager = new SessionManager(sessions);
		await authenticator.init(this.dataBaseManager);
		await blogManager.init(this.dataBaseManager);
		await userManager.init(authenticator,this.dataBaseManager);
		await courseManager.init(this.dataBaseManager,userManager);
		await sessionManager.init(authenticator,userManager);
		
		this.jApi = new Api(blogManager,userManager,sessionManager,courseManager,logManager);
		if(httpPort) this.listen(httpPort);
	}

	listen = async(port) => {
		this.listeners[port] = this.jApi.listener(port);
		return this.listeners[port];
	}

	close = async(port) => {
		await this.listeners[port].close();
	}

	stop = async() => {
		for(listener of this.listeners)
			await listener.close();
		await this.dataBaseManager.disconnect();		
	}
}



export default JServer;
