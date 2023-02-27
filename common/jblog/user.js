const JJoi = require("jjoi");



const userNameSchema = JJoi.string().required().min(3).label("name");
const userEmailSchema = JJoi.string().required().email({ tlds:{ allow:false } }).label("email");
const userObjectSchema = JJoi.object().required().keys({
	_id : JJoi.objectId().required(),
	name : userNameSchema,
	email : userEmailSchema,
	admin : JJoi.boolean(),
}).options({ allowUnknown:true });

class User {
	#id;
	#name;
	#email;
	#admin;

	constructor(userObject) {
		const { _id,name,email,admin=false } = userObject;
		if(!(_id==="" && name==="" && email==="")) JJoi.assert(userObject,userObjectSchema);
		this.#id = _id;
		this.#name = name;
		this.#email = email;
		this.#admin = admin;
	};

	static validateEmail = (email) => {
		const { error } = JJoi.validate(email,userEmailSchema);
		if(error) return { error:error.message };
		return {};
	};

	static validateName = (name) => {
		const { error } = JJoi.validate(name,userNameSchema);
		if(error) return { error:error.message };
		return {};
	};

	static get noUser() {return noUser};
	get _id() {return this.#id};
	get name() {return this.#name};
	get email() {return this.#email};
	get admin() {return this.#admin};
	get _object() {
		const userObject = {
			_id : this.#id,
			name : this.#name,
			email : this.#email,
			admin : this.#admin,
		};
		return userObject;
	};
};

const noUser = new User({_id:"",name:"",email:""});



module.exports = User;
