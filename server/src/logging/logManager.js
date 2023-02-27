import winston from "winston";



class LogManager {
	#winstonLogger;

	constructor({ logFilesPath }) {
		this.#winstonLogger = winston.createLogger({
			level: 'warn',
			format: winston.format.simple(),
			transports : [
				new winston.transports.Console(),
				new winston.transports.File({ filename:`${logFilesPath}/error.log` }),
			],
		});
	};
	
	logError = ({ cause,message }) => {
		this.#winstonLogger.error(`${cause || ""} - ${message || ""}`);
	};

	errorMessage = (message) => {
		this.#winstonLogger.error(message);
	};

	warningMessage = (message) => {
		this.#winstonLogger.warning(message);
	};
};



export default LogManager;
