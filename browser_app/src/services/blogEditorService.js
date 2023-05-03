import { BlogPost } from "jblog";



class BlogEditorService {
	#blogService;
	#sessions;

	constructor() {
		this.#sessions = {};
	};

	getTopicsObject = async() => this.#blogService.getTopicsObject();

	get languages() { return this.#blogService.languages };

	init = (blogService) => {
		this.#blogService = blogService;
	};

	openSessionById = async(blogPostId) => {
		if(this.#sessions[blogPostId]) return this.#sessions[blogPostId];
		console.log("openSessio by id",blogPostId);
		const blogPost = blogPostId ? await this.#blogService.getPostById(blogPostId) : null;
		const session = await this.#newSession(blogPost);
		this.#sessions[blogPostId] = session;
		return session;
	};

	// in no blogPost argument edit new post otherwise existing
	openSession = async(blogPost=null) => {
		const postId = blogPost && blogPost._id || "";
		const session = this.#sessions[postId] || (this.#sessions[postId] = await this.#newSession(blogPost));
		return session;
	};

	#newSession = async(blogPost) => {
		const newSession = new BlogEditorSession(blogPost);
		await newSession.init(this);
		return newSession;
	};

	discardSession = async(blogPost=null) => {
		delete this.#sessions[blogPost._id];
	};

	saveSession = async(blogPost=null) => {
		// pack new content into a new blogPost instance
		const _blogPost = new BlogPost();
		this.#blogService.savePost(_blogPost);
	};

	getPostContent = async(thumbnail) => await this.#blogService.getPostContent(thumbnail);
	saveNew = async(blogPost,htmlStrings) => await this.#blogService.saveNew(blogPost,htmlStrings);
	saveEdited = async(blogPost,htmlStrings) => await this.#blogService.saveEdited(blogPost,htmlStrings);
};

class BlogEditorSession {
	#blogEditorService;
	#blogPost;
	#blogTopic;
	#content;
	// editor sessions needs to be available without async so it needs own independent state
	#topics; // constant
	#languages; //constant

	constructor(blogPost) {
		this.#blogPost = blogPost;
		this.#content = {
			en : { title:"",htmlString:"",published:false },
			fi : { title:"",htmlString:"",published:false },
		};
	};

	init = async(blogEditorService) => {
		this.#blogEditorService = blogEditorService;
		this.#topics = await blogEditorService.getTopicsObject();
		this.#languages = ["en","fi"]; // TODO
		console.log("heh",this.#blogPost)
		this.#blogPost ? await this.#initExistingPost() : await this.#initNewPost();
		console.log("Inited",this.#content)
	};

	#initNewPost = async() => {
		this.#blogTopic = Object.values(this.#topics)[0];
	};

	#initExistingPost = async() => {
		this.#blogTopic = this.#blogPost.topic;
		for(const thumbnail of this.#blogPost.thumbnails) {
			const { language,title,published } = thumbnail;
			const htmlString = await this.#blogEditorService.getPostContent(thumbnail);
			this.#content[language] = { title,htmlString,published };
		};
	};

	savePost = async() => {
		console.log(this.#blogPost);
		this.#blogPost ? await this.#saveEdited() : await this.#saveNew();
	};

	#saveNew = async() => {
		const content = {};
		const htmlStrings = {};
		for(const language of this.#languages) {
			const { title,htmlString,published } = this.#content[language];
			if(title || htmlString) {
				content[language] = { title,published };
				htmlStrings[language] = htmlString;
			};
		};
		const blogPostObject = {
			topicId : this.#blogTopic._id,
			content,
		};
		const blogPost = new BlogPost(blogPostObject,(topicId) => this.#topics[topicId]);
		const newBlogPost = await this.#blogEditorService.saveNew(blogPost,htmlStrings);
		this.#blogPost = newBlogPost;
	};

	#saveEdited = async() => {
		const content = {};
		const htmlStrings = {};
		for(const language of this.#languages) {
			const { _id,title,htmlString,published } = this.#content[language];
			if(title || htmlString) {
				content[language] = { _id,title,published };
				htmlStrings[language] = htmlString;
			};
		};
		const blogPostObject = {
			_id : this.#blogPost._id,
			date : this.#blogPost.date,
			topicId : this.#blogTopic._id,
			content,
		};
		const blogPost = new BlogPost(blogPostObject,(topicId) => this.#topics[topicId]);
		const newBlogPost = await this.#blogEditorService.saveEdited(blogPost,htmlStrings);
		this.#blogPost = newBlogPost;
	};

	get topics() { return this.#topics };
	get languages() { return this.#languages };
	get _id() { return this.#blogPost ? this.#blogPost._id : "" };

	setTopic = (blogTopic) => this.#blogTopic = blogTopic;
	getTopic = () => this.#blogTopic

	setTitle = (language,title) => this.#content[language].title = title;
	getTitle = (language) => this.#content[language].title;

	setHtmlContent = (language,htmlString) => this.#content[language].htmlString = htmlString;
	getHtmlContent = (language) => this.#content[language].htmlString;

	setPublished = (language,published) => this.#content[language].published = published;
	getPublished = (language) => this.#content[language].published;
};



export default BlogEditorService;
