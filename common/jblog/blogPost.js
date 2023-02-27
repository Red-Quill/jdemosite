const JJoi = require("jjoi");



const blogPostContentThumbnailSchema = JJoi.object({
	_id : JJoi.objectId(),
	title : JJoi.string().required(),
	published : JJoi.boolean(),
},{ allowUnknown:true });

const blogPostContentSchema = JJoi.object().required().keys({
	fi : blogPostContentThumbnailSchema,
	en : blogPostContentThumbnailSchema,
}).options({ allowUnknown:true });

const blogPostObjectSchema = JJoi.object().required().keys({
	date : JJoi.date(),
	_id : JJoi.objectId(),
	topicId : JJoi.objectId().required(),
	content : blogPostContentSchema,
}).options({ allowUnknown:true });



class BlogPost {
	#id;
	#topicId;
	#topic;
	#date;
	#thumbnails;

	constructor(blogPostObject,getTopic) {
		JJoi.assert(blogPostObject,blogPostObjectSchema);
		const { _id,topicId,date,content } = blogPostObject;
		this.#id = _id;
		this.#topicId = topicId;
		this.#topic = getTopic && getTopic(topicId); // Temporarily like this. Later remove getTopic &&
		date && (this.#date = new Date(date));
		this.#thumbnails = {};
		Object.entries(content).forEach( ([ language,{ _id,title,published=true } ]) => this.#thumbnails[language] = new BlogPostThumbnail(_id,language,title,published,this) );
	};

	get _id() { return this.#id };
	get date() { return this.#date };
	get topicId() { return this.#topicId };
	get topic() { return this.#topic };
	get thumbnails() { return Object.values(this.#thumbnails) };
	
	get published() {
		for(const { published } of Object.values(this.#thumbnails))
			if(published) return true;
		return false;
	};
	
	get _object() {
		const content = {};
		Object.entries(this.#thumbnails).forEach( ([language,{ title,contentId,published }]) => content[language] = { _id:contentId,title,published } );
		const blogPost = {
			...(this.#id && { _id:this.#id }),
			...(this.#date && { date:this.#date }),
			topicId : this.#topicId,
			content,
		};
		return blogPost;
	};
	
	get _objectPublished() {
		const content = {};
		Object.entries(this.#thumbnails).forEach( ([language,{ title,contentId,published }]) => {if(published) content[language] = { _id:contentId,title,published }} );
		const publishedPost = {
			...(this.#id && { _id:this.#id }),
			...(this.#date && { date:this.#date }),
			topicId : this.#topicId,
			content,
		};
		return publishedPost;		
	};

	getThumbnailLang = (language) => this.#thumbnails[language];
	
	getPublishedBlogPost = () => {
		if(!this.published) return null;
		const _objectPublished = this._objectPublished;
		const publishedBlogPost = new BlogPost(_objectPublished);
		return publishedBlogPost;
	};

	addTimeStamp = () => {
		if(this.#date) throw Error("Blog post already has time stamp");
		this.#date = new Date();
	};
};



class BlogPostThumbnail {
	#contentId;
	#language;
	#title;
	#blogPost;
	#published;

	constructor(contentId,language,title,published,blogPost) {
		this.#contentId = contentId;
		this.#language = language;
		this.#title = title;
		this.#published = published;
		this.#blogPost = blogPost;
	}

	get contentId() {return this.#contentId};
	get date() {return this.#blogPost.date};
	get language() {return this.#language};
	get title() {return this.#title};
	get topicId() {return this.#blogPost.topicId};
	get _id() {return this.#blogPost._id};
	get blogPost() {return this.#blogPost};
	get published() {return this.#published};
}



module.exports = BlogPost;
