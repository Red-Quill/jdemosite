import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


/*
Tailored mongoDB module for JServer. It abstracts away some of the database management and
provides only methods for initial configuration and for specific use cases needed by
other modules in JServer system.

If I need to switch to other database implementation this module can be rewritten
without minimal changes to other modules in JServer.
*/
class DatabaseManager {
	databaseConnection;
	databaseClient;
	dataBaseUrl;
	dataBaseConfig;
	tables;

	constructor({ baseURL,name,username,password,useSsl,sslCAFilename }) {
		this.tables = {};
		this.dataBaseUrl = `mongodb://${baseURL}/${name}`;
		this.dataBaseConfig = {};
		if(username) this.dataBaseConfig.user = username;
		if(password) this.dataBaseConfig.pass = password;
		if(useSsl) this.dataBaseConfig.ssl = useSsl;
		if(sslCAFilename) {
			this.dataBaseConfig.sslValidate = true;
			this.dataBaseConfig.sslCA = sslCAFilename;
		};
		this.databaseClient = new mongoose.Mongoose();
	};

	connect = async() => {
		this.databaseConnection = await this.databaseClient.connect(this.dataBaseUrl,this.dataBaseConfig);
	};

	disconnect = async() => {
		await this.databaseClient.disconnect();
	};

	newTable = async(name,schema) => {
		const table = this.databaseClient.model(name,schema);
		this.tables[name] = table;
	};

	dropTable = async(name) => {
		await this.tables[name].collection.drop();
		delete this.tables[name];
	};

	emptyTable = async(name) => {
		await this.tables[name].remove({});
	};

	save = async(tableName,data) => {
		const entry = new this.tables[tableName](data);
		const result = await entry.save();
		return result;
	};

	replaceEntryObject = async(tableName,data) => {
		const Model = this.tables[tableName];
		const result = await Model.findOneAndReplace({ _id:data._id },data,{ new:true });
		const _object = result && resultToObject(result);
		return _object;
	};

	newEntry = async(tableName,entryData) => {
		if(entryData._id) throw new Error(`The "new" table entry for table ${tableName} already has an _id`);
		const entry = new this.tables[tableName](entryData);
		const result = await entry.save();
		return result;
	};

	newEntryObject = async(tableName,entryData) => {
		const result = await this.newEntry(tableName,entryData);
		const _object = result && resultToObject(result);
		return _object;
	};

	// newData is optional default document if document doesn't exist in database
	// this needs more testing
	updateOne = async(name,query,update,newData) => {
		const Model = this.tables[name];
		const existing = await Model.findOne(query);
		if(!existing && !newData) return { error:"No entry found with specified query" };
		const entry = existing || await this.save(name,newData);
		await entry.updateOne(update);
		return { success:true };
	};

	getTable = async(name) => {
		const table = await this.tables[name].find();
		return table;
	};

	getTableObjects = async(name) => {
		const table = await this.getTable(name);
		const objects = table.map( (document) => convertObjectIdsToString(document.toObject()) );
		return objects;
	};

	findOne = async(name,query) => {
		const result = await this.tables[name].findOne(query).exec();
		return result;
	};

	findOneObject = async(name,query) => {
		const result = await this.findOne(name,query);
		const _object = result && resultToObject(result);
		return _object;
	};

	findById = async(name,_id) => {
		const result = await this.tables[name].findById(_id);
		return result;
	};

	findByIdObject = async(name,_id) => {
		const result = await this.findById(name,_id);
		const _object = result && resultToObject(result);
		return _object;
	};
};

const resultToObject = (result) => {
	const _object = result.toObject();
	const __object = convertObjectIdsToString(_object);
	return __object;
};

const convertObjectIdsToString = (sourceObject) => {
	const targetObject = new sourceObject.constructor();
	for(const [key,item] of Object.entries(sourceObject))
		targetObject[key] =
			[Object,Array].includes(item.constructor) ? convertObjectIdsToString(item)
			:
			item instanceof ObjectId ? item.toString()
			:
			item;
	return targetObject;
};



export default DatabaseManager;

/*

*/