import express from "express";



class _UseSubRouter {
	
	constructor() {};

	useSubRouter = (path,subRouter) => {
		this._methods.push({ type:"subRouter",path,subRouter });
	};
};



class MainRouter extends _UseSubRouter {
	#workers;
	_methods;
	#final;
	#errorHandler;

	constructor() {
		super();
		this.#workers = [];
		this._methods = [];
		this.#final = this.#defaultFinal;
		this.#errorHandler = this.#defaultErrorHandler;
	};

	useWorker = (middleWare) => this.#workers.push(middleWare);

	setFinal = (middleWare) => this.#final = middleWare;

	#defaultFinal = (request,response) => response.status(404).send();

	setErrorHandler = (errorHandler) => this.#errorHandler = errorHandler;
	
	#defaultErrorHandler = (request,response,error) => {throw error};

	useExpressRouter = (path,expressRouter) => this._methods.push({type:"expressRouter",path,method:expressRouter});

	getExpressMainRouter = () => {
		const expressMainRouter = express();
		for(const middleware of this.#workers) expressMainRouter.use(middleware);
		for(const {type,path,method,subRouter} of this._methods) {
			if(type === "subRouter") expressMainRouter.use(path,subRouter._getExpressSubRouter(this.#errorHandler));
			else if(type === "expressRouter") expressMainRouter.use(path,method);
			else {
				expressSubRouter[type](path,(request,response,next) => {
					try {
						method(request,response,next);
					} catch(error) {
						this.#errorHandler(request,response,error);
					}
				});
			}
		};
		expressMainRouter.use( (request,response) => {
			try {
				this.#final(request,response);
			} catch(error) {
				this.#errorHandler(request,response,error);
			}
		});
		return expressMainRouter;
	};
};



class SubRouter extends _UseSubRouter {
	_methods;

	constructor() {
		super();
		this._methods = [];
	};

	useGetMethod = (path,method) => this._methods.push({ type:"get",path,method });

	usePutMethod = (path,method) => this._methods.push({ type:"put",path,method });

	usePostMethod = (path,method) => this._methods.push({ type:"post",path,method });

	_getExpressSubRouter = (parentErrorHandler) => {
		const expressSubRouter = express.Router();
		for(const {type,path,method,subRouter} of this._methods) {
			if(type === "subRouter") expressMainRouter.use(path,subRouter._getExpressSubRouter(parentErrorHandler));
			else {
				expressSubRouter[type](path,async(request,response,next) => {
					try {
						await method(request,response,next);
					} catch(error) {
						parentErrorHandler(request,response,error);
					}
				});
			};
		};
		return expressSubRouter;
	};
};



export { MainRouter,SubRouter };
