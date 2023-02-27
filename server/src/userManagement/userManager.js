import mongoose from "mongoose";
import JJoi from "jjoi";
import { User,noUser } from "jblog";



class UserManager {
	dataBaseManager;
	authenticator;

	userSchema = new mongoose.Schema({
		name : { type:String,required:true },
		email: { type:String,required:true,unique:true },
		admin : { type:Boolean },
	});

	#passwordSchema = JJoi.string().required().min(8).label("password");

	constructor() {

	};

	init = async(authenticator,dataBaseManager) => {
		this.authenticator = authenticator;
		this.dataBaseManager = dataBaseManager;
		await this.dataBaseManager.newTable("user", this.userSchema);
	};

	registerUser = async(name,email,password) => {
		this.#assertRegisterUserArguments(name,email,password);
		const userTest = await this.dataBaseManager.findOne("user",{ email });
		if(userTest) throw new Error("User with that email alredy exists");
		const dbResult = await this.dataBaseManager.save("user",{ name,email });
		await this.authenticator.setUserPassword(dbResult._id.toString(),password);
		return {};
	};

	#assertRegisterUserArguments = (name,email,password) => {
		const { error:nameError="" } = User.validateName(name);
		const { error:emailError="" } = User.validateEmail(email);
		const { error:passwordError="" } = this.#validatePassword(password);
		if(nameError || emailError || passwordError)
			throw new Error(`${nameError} ${emailError} ${passwordError}`);
	};

	#validatePassword = (password) => {
		const { error } = JJoi.validate(password,this.#passwordSchema);
		if(error) return { error:error.message };
		return {};
	};

	getUserByEmail = async(email) => {
		const dbResult = await this.dataBaseManager.findOneObject("user",{ email });
		const user = dbResult ? new User(dbResult) : noUser;
		return user;
	};

	getUserById = async(userId) => {
		const dbResult = await this.dataBaseManager.findByIdObject("user",userId);
		const user = dbResult ? new User(dbResult) : noUser;
		return user;
	};
};



export default UserManager;

/*

*/
