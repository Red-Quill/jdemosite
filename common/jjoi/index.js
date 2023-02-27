const JJoi = require("joi");
const joiObjectId = require("joi-objectid");



//const JJoi = {
//	...Joi,
	//objectId : joiObjectId(Joi),
//	validate : (value,schema,options) => schema.validate(value,options),
//};
JJoi.objectId = joiObjectId(JJoi);
JJoi.validate = (value,schema,options) => schema.validate(value,options);


module.exports = JJoi;
