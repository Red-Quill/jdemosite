import { User } from "jblog";
import { httpService } from "./httpService";



// TODO: consider using (npm) eventemitter3 library
class UserService {
	#httpService;
	#currentUser;
	#sessionToken;
	#onUserChangeCallbacks;
	#onUserChangeCallbacksId;

	constructor() {
		this.#sessionToken = "";
		this.#currentUser = User.noUser;
		this.#onUserChangeCallbacks = {};
		this.#onUserChangeCallbacksId = 1;
	};

	init = (httpService) => {
		this.#httpService = httpService;
		this.#restoreUser();
	};

	get currentUser() {return this.#currentUser};
	get sessionToken() {return this.#sessionToken};

	// --> Terms accepted
	termsAccepted = () => this.#sessionToken || window.localStorage.getItem("termsAccepted") ? true : false;
	setTermsAccepted = () => window.localStorage.setItem("termsAccepted",true);
	// <-- Terms accepted

	// TODO for register,login, logout: throw errors instead of returning them
	register = async({ email,name,password }) => {
		await this.#httpService.post("/api/user/register",{ email,name,password },{ noteError:true });
	};
	
	login = async({ email,password }) => {
		const { headers } = await this.#httpService.post("/api/user/login",{ email,password },{ noteError:true });
		const sessionToken = headers["x-auth-token"];
		const { data } = await this.#httpService.get("/api/user/current",{ headers:{ "x-auth-token":sessionToken } },{ noteError:true });
		const user = new User(data);
		this.#setUser(sessionToken,user);
	};
	
	registerAndLogin = async({ email,name,password }) => {
		await this.register({ email,name,password });
		await this.login({ email,password });
	};
	
	logout = async() => {
		// notice that posting logout is not awaited (on purpose)
		if(this.#sessionToken)
			this.#httpService.post("/api/user/logout",true,{ headers:{ "x-auth-token":this.#sessionToken } },{ returnError:true });
		this.#resetUser();
	};

	// -->
	// Keep in-memry user data and localStorage in sync

	// used when login is called
	#setUser = (sessionToken,user) => {
		this.#sessionToken = sessionToken;
		this.#currentUser = user;
		this.#storeUserToLocalStorage();
		this.#emitUserChange();
	};

	// used when logout is called
	#resetUser = () => {
		this.#sessionToken = "";
		this.#currentUser = User.noUser;
		this.#resetUserLocalStorage();
		this.#emitUserChange();
	};

	// used when module is reloaded
	#restoreUser = async() => {
		if(
			!window.localStorage.getItem("userSessionToken") ||
			!window.localStorage.getItem("user")
		)
			this.#resetUser();
		else {
			// check that session is still open
			const sessionToken = window.localStorage.getItem("userSessionToken");
			const { status } = await this.#httpService.get("/api/user/current",{ headers:{ "x-auth-token":sessionToken },returnError:true });
			if(status === 401) this.#resetUser();
			else {
				this.#retrieveUserFromLocalStorage();
				this.#emitUserChange();
			}
		}
	}

	// --> whenever user changes
	#emitUserChange = () => {
		for(const callback of Object.values(this.#onUserChangeCallbacks)) callback(this.#currentUser);
	};

	onUserChange = (callback) => {
		const _id = this.#onUserChangeCallbacksId++;
		callback.onUserChangeCallBackId = _id;
		this.#onUserChangeCallbacks[_id] = callback;
	};
	
	onUserChangeDeregister = (callback) => {
		const _id = callback.onUserChangeCallBackId;
		delete this.#onUserChangeCallbacks[_id];
	};
	// <--

	// Technically naming conventions of this part could cause conflicts in unlikely scenarios
	#storeUserToLocalStorage = () => {
		window.localStorage.setItem("userSessionToken",this.#sessionToken);
		window.localStorage.setItem("user",JSON.stringify(this.#currentUser._object));
	};
	
	#resetUserLocalStorage = () => {
		window.localStorage.setItem("userSessionToken","");
		window.localStorage.setItem("user","");
	};
	
	#retrieveUserFromLocalStorage = () => {
		this.#sessionToken = window.localStorage.getItem("userSessionToken");
		const _user = window.localStorage.getItem("user");
		this.#currentUser = _user ? new User(JSON.parse(_user)) : User.noUser;
	}
	// <--
}



const userService = new UserService();
userService.init(httpService);
export default userService;
