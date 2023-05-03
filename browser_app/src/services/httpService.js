import axios from "axios";



class HttpService {
	#baseURL
	#axios;
	#errorNotificationService;

	constructor({url,port,path}) {
		this.#baseURL = `${ url ? `${url}${port ? `:${port}`:""}` : "" }${ path ? path : "" }`;
	};

	init = (errorNotificationService) => {
		this.#errorNotificationService = errorNotificationService;
		this.#axios = axios.create({ baseURL:this.#baseURL });
	};

	get = async(path,{ headers,responseType,returnError,noteError }={}) => {
		try {
			return await this.#axios.get(path,{ headers,responseType });
		} catch(error) {
			return this.#handleAxiosError(error,returnError,noteError);
		}
	};

	post = async(path,payload,{ headers,responseType,returnError,noteError }={}) => {
		try {
			return await this.#axios.post(path,payload,{ headers,responseType });
		} catch(error) {
			return this.#handleAxiosError(error,returnError,noteError);
		}
	};

	put = async(path,payload,{ headers,responseType,returnError,noteError }={}) => {
		try {
			return await this.#axios.put(path,payload,{ headers,responseType });
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



export default HttpService;
