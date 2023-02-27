const JJoi = require("jjoi");



blogTopicObjectSchema = JJoi.object().required().keys({
	_id : JJoi.objectId().required(),
	label : JJoi.string().required(),
	names : JJoi.object().required().keys({
		fi : JJoi.string().required(),
		en : JJoi.string().required(),
	}).options({ allowUnknown:true }),
}).options({ allowUnknown:true });

class BlogTopic {
	#id;
	#label;
	#thumbnails;

	constructor(blogTopicObject) {
		JJoi.assert(blogTopicObject,blogTopicObjectSchema);
		const { _id,label,names } = blogTopicObject;
		this.#id = _id;
		this.#label = label;
		this.#thumbnails = {};
		Object.entries(names).map( ([ language,name ]) => this.#thumbnails[language] = new BlogTopicThumbnail(language,name,this) );
	}

	get _id() {return this.#id};
	get _object() {
		const names = {};
		Object.values(this.#thumbnails).map( ({language,name}) => names[language] = name );
		const blogTopic = {
			_id : this.#id,
			label : this.#label,
			names,
		};
		return blogTopic;
	};

	getThumbnailLang = (language) => this.#thumbnails[language];
}

class BlogTopicThumbnail {
	#language;
	#name;
	#blogTopic;

	constructor(language,name,blogTopic) {
		this.#language = language;
		this.#name = name;
		this.#blogTopic = blogTopic;
	}

	get name() {return this.#name};
	get language() {return this.#language};
	get blogTopic() {return this.#blogTopic};
	get _id() {return this.#blogTopic._id};
}



module.exports = BlogTopic;
