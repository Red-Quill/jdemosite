import axios from "axios";
import { errorNotificationService } from "./notificationService";



class HttpService {
	#baseURL
	#ax;
	#errorNotificationService;

	constructor({url,port,path}) {
		this.#baseURL = `${ url ? `${url}${port ? `:${port}`:""}` : "" }${ path ? path : "" }`;
	};

	init = (errorNotificationService) => {
		this.#errorNotificationService = errorNotificationService;
		this.#ax = axios.create({ baseURL:this.#baseURL });
	};

	get = async(path,{ headers,responseType,returnError,noteError }={}) => {
		try {
			return await this.#ax.get(path,{ headers,responseType });
		} catch(error) {
			return this.#handleAxiosError(error,returnError,noteError);
		}
	};

	post = async(path,payload,{ headers,responseType,returnError,noteError }={}) => {
		try {
			return await this.#ax.post(path,payload,{ headers,responseType });
		} catch(error) {
			return this.#handleAxiosError(error,returnError,noteError);
		}
	};

	put = async(path,payload,{ headers,responseType,returnError,noteError }={}) => {
		try {
			return await this.#ax.put(path,payload,{ headers,responseType });
		} catch(error) {
			return this.#handleAxiosError(error,returnError,noteError);
		}
	};

	// Somehow segregate between expected error situations like network down, or status !== 2xx and other errors
	// throw other error by default
	// handle expected errors
	// Standardize error:
	// error should always have a message
	// put relevant parts of the http response to error object
	#handleAxiosError = (error,returnError,noteError) => {
		if(noteError) this.#errorNotificationService.showNotification(error.message);
		if(!returnError) throw error;
		return error.response;
	};
};



const config = process.env.NODE_ENV === "production" ? {} : { url:"http://localhost",port:"3002" };
const httpService = new HttpService(config);
httpService.init(errorNotificationService);

export { httpService };

/*

*/