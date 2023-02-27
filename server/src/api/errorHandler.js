import { SubRouter } from "../jrouter/jrouter.js";



const errorHandler = (logManager) => {
	
	const errorHandler = async(request,response,error) => {
		logManager.logError(error);
		response.status(500).send(`Something went wrong on the server side. ${error.message}`);
		//throw error;
	};

	return errorHandler;
};



export default errorHandler;
