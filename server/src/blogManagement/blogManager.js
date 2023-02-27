import mongoose from "mongoose";
import { BlogTopic,BlogPost } from  "jblog";
import { wait } from  "jutils";
import Files from "../files/fileManager.js";



class BlogManager {
	dataBaseManager;
	postFilesPath;
	fileManager;
	topics;
	topicsByName;
	postsAll;
	postsPublished;

	blogTopicSchema = new mongoose.Schema({
		name : { type:String,required:true },
		names : new mongoose.Schema({
			_id : false,
			en : { type:String,required:true },
			fi : { type:String,required:true },
		}),
	});

	blogPostContentSchema = new mongoose.Schema({
		title : { type:String,required:true },
		published : { type:Boolean },
	});

	blogPostSchema = new mongoose.Schema({
		topicId : { type:mongoose.Schema.Types.ObjectId,required:true },
		content : new mongoose.Schema({
			_id : false,
			en : this.blogPostContentSchema,
			fi : this.blogPostContentSchema,
		}),
		date : { type:Date,required:true },
	});

	constructor({ postFilesPath }) {
		this.topics = {};
		this.topicsByName = {};
		this.postsAll = {};
		this.postsPublished = {};
		this.postFilesPath = postFilesPath;
		this.fileManager = new Files(postFilesPath);
	};

	init = async(dataBaseManager) => {
		this.dataBaseManager = dataBaseManager;
		await this.dataBaseManager.newTable("blogpost",this.blogPostSchema);
		await this.dataBaseManager.newTable("blogtopic",this.blogTopicSchema);
		this.update();
	};

	update = async() => {
		while(true) {
			await this.updateTopics();
			await this.updatePosts();
			await wait(300000);
		};
	};

	updateTopics = async() => {
		const topics_ = await this.dataBaseManager.getTableObjects("blogtopic");
		for(const topic_ of topics_) {
			const topic = new BlogTopic(topic_);
			this.topics[topic._id] = topic;
			this.topicsByName[topic.name] = topic;
		}
	};

	updatePosts = async() => {
		const posts_ = await this.dataBaseManager.getTableObjects("blogpost");
		for(const post_ of posts_) {
			const post = new BlogPost(post_);
			this.postsAll[post._id] = post;
		};
		// assuming posts can only go from draft -> published, so no need to clear cache
		for(const post_ of Object.values(this.postsAll)) {
			const post = post_.getPublishedBlogPost();
			if(post) this.postsPublished[post._id] = post;
		};
	};

	getTopics = async() => {
		return Object.values(this.topics);
	};

	getTopicById = async(topicId) => this.topics[topicId];

	getPublishedPosts = async() => {
		return Object.values(this.postsPublished);
	};

	getAllPosts = async() => {
		return Object.values(this.postsAll);
	};

	getPostContent = async(postId,language) => {
		try {
			const contentId = this.postsAll[postId].getThumbnailLang(language).contentId;
			const postHtmlString = await this.fileManager.readFile(`${contentId}.html`);
			return { postHtmlString };
		} catch(exception) {
			return { error:exception.message };
		}
	};
	
	newPost = async(blogPost,htmlStrings) => {
		blogPost.addTimeStamp();
		const newBlogPostObject = await this.dataBaseManager.newEntryObject("blogpost",blogPost._object);
		const newBlogPost = new BlogPost(newBlogPostObject);
		// consider validating html input
		for(const { contentId,language } of newBlogPost.thumbnails)
			await this.fileManager.saveTextFile(`${contentId}.html`,htmlStrings[language]);
		await this.updatePosts();
		return newBlogPost;
	};

	savePost = async(blogPost,htmlStrings) => {
		const newBlogPostObject = await this.dataBaseManager.replaceEntryObject("blogpost",blogPost._object);
		const newBlogPost = new BlogPost(newBlogPostObject);
		// consider validating html input
		for(const { contentId,language } of newBlogPost.thumbnails)
			await this.fileManager.saveTextFile(`${contentId}.html`,htmlStrings[language]);
		await this.updatePosts();
		return newBlogPost;
	};
};



export default BlogManager;



/*

*/
