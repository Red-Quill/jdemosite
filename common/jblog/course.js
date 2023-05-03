import JJoi from "../jjoi/index.js";



const courseObjectSchema = JJoi.object().required().keys({
	_id : JJoi.objectId().required(),
	iconFileName : JJoi.string().required(),
	content : JJoi.object().required().keys({
		fi : JJoi.object().keys({
			_id : JJoi.objectId().required(),
			name : JJoi.string().required(),
		}).options({ allowUnknown:true }),
	}).options({ allowUnknown:true }),
}).options({ allowUnknown:true });

class Course {
	#id;
	#iconFileName;
	#thumbnails;

	constructor(courseObject) {
		JJoi.assert(courseObject,courseObjectSchema);
		const { _id,iconFileName,content } = courseObject;
		this.#id = _id;
		this.#iconFileName = iconFileName;
		this.#thumbnails = {};
		Object.entries(content).forEach( ([ language,{ _id,name } ]) => this.#thumbnails[language] = new CourseThumbnail(_id,language,name,this) );
	};

	get _id() {return this.#id};
	get iconFileName() {return this.#iconFileName};
	//get thumbnails() {return this.#thumbnails};
	get _object() {
		const content = {};
		Object.entries(this.#thumbnails).forEach( ([ language,{ contentId,name } ]) => content[language] = { _id:contentId,name } )
		const course = {
			_id : this.#id,
			iconFileName : this.#iconFileName,
			content,
		};
		return course;
	};

	getThumbnailLang = (language) => this.#thumbnails[language];
};

class CourseThumbnail {
	#language;
	#name;
	#contentId;
	#course;

	constructor(contentId,language,name,course) {
		this.#language = language;
		this.#name = name;
		this.#contentId = contentId;
		this.#course = course;
	};

	get language() {return this.#language};
	get name() {return this.#name};
	get iconFileName() {return this.#course.iconFileName};
	get contentId() {return this.#contentId};
	get _id() {return this.#course._id};
	get course() {return this.#course};
};



export default Course;
