import mongoose from "mongoose";
import bcrypt from "bcrypt";



class Authenticator {
	dataBaseManager;

	userPasswordSchema = new mongoose.Schema({
		userId : { type:mongoose.Schema.Types.ObjectId,required:true,unique:true },
		password: { type:String,required:true },
	});

	constructor() {};

	init = async(dataBaseManager) => {
		this.dataBaseManager = dataBaseManager;
		await this.dataBaseManager.newTable("userpassword", this.userPasswordSchema);
	};

	setUserPassword = async(userId,plainTextPassword) => {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(plainTextPassword,salt);
		await this.dataBaseManager.save("userpassword",{ userId,password:hashedPassword });
	};

	verifyUserPassword = async(userId,plainTextPassword) => {
		const { password:hashedPassword } = await this.dataBaseManager.findOne("userpassword",{ userId });
		const correct = await bcrypt.compare(plainTextPassword,hashedPassword);
		return correct;
	};
};



export default Authenticator;
