import express from "express";
import { MainRouter } from "../jrouter/jrouter.js";
import cors from "cors";
import helmet from "helmet";
//import compression from "compression.js";
import blogTopics from "./blog/topics.js";
import blogPosts from "./blog/posts.js";
import blogPost from "./blog/post.js";
import blogPostSave from "./blog/postSave.js";
import blogPostNew from "./blog/postNew.js";
import userRegister from "./user/register.js";
import userLogin from "./user/login.js";
import userCurrent from "./user/current.js";
import userLogout from "./user/logout.js";
import coursesCatalog from "./courses/catalog.js";
import coursesMy from "./courses/my.js";
import coursesMyAdd from "./courses/myAdd.js";
import coursesContent from "./courses/content.js";
import health from "./health.js";
import notFound from "./notFound.js";
import errorHandler from "./errorHandler.js";



class Api {
	app;
	expressApp;

	constructor(blogManager,userManager,sessionManager,courseManager,logManager) {
		this.app = new MainRouter();

		this.app.useWorker(helmet()); // possibly disable in development
		// Compression FAILS
		//this.app.use(compression); // possibly disable in development
		this.app.useWorker(cors({exposedHeaders:"x-auth-token"}));
		this.app.useWorker(express.json());
		this.app.useWorker(express.urlencoded({extended:true}));
		this.app.useSubRouter("/api/blog/topics",blogTopics(blogManager));
		this.app.useSubRouter("/api/blog/posts",blogPosts(blogManager));
		this.app.useSubRouter("/api/blog/post",blogPost(blogManager));
		this.app.useSubRouter("/api/blog/post/new",blogPostNew(blogManager,sessionManager));
		this.app.useSubRouter("/api/blog/post/save",blogPostSave(blogManager,sessionManager));
		this.app.useSubRouter("/api/user/register",userRegister(userManager));
		this.app.useSubRouter("/api/user/login",userLogin(sessionManager));
		this.app.useSubRouter("/api/user/current",userCurrent(sessionManager));
		this.app.useSubRouter("/api/user/logout",userLogout(sessionManager));
		this.app.useSubRouter("/api/courses/catalog",coursesCatalog(courseManager));
		this.app.useSubRouter("/api/courses/my",coursesMy(courseManager,sessionManager));
		this.app.useSubRouter("/api/courses/my/add",coursesMyAdd(courseManager,sessionManager));
		this.app.useSubRouter("/api/courses/content",coursesContent(courseManager,sessionManager));
		this.app.useSubRouter("/~health",health());
		this.app.setFinal(notFound);
		this.app.setErrorHandler(errorHandler(logManager));

		this.expressApp = this.app.getExpressMainRouter();
	};

	listener = (port) => {
		const listener = this.expressApp.listen(port);
		return listener
	};
};



export default Api;


/*
*/


