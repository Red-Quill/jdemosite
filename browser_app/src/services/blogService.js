import _ from "lodash";
import { BlogTopic,BlogPost } from "jblog";
import { httpService } from "./httpService";
import { localizationService } from "./i18n";
import { errorNotificationService } from "./notificationService";
import userService from "./userService";



class BlogService {
	#updateInterval;
	#lastUpdated;
	#topics;
	#topicsUpdateInterval;
	#topicsLastUpdated;
	#posts;
	#postsUpdateInterval;
	#postsLastUpdated;
	#postThumbnails; //separate index for thumbnails
	#localizationService;
	#httpService;
	#userService;

	constructor() {
		this.#updateInterval = 300000;// 5 min
		this.#lastUpdated = 0;
		this.#topics = {};
		this.#topicsUpdateInterval = 3600000;// 1 h
		this.#topicsLastUpdated = 0;
		this.#posts = {};
		this.#postsUpdateInterval = 300000;// 5 min
		this.#postsLastUpdated = 0;
		this.#postThumbnails = {};
	};

	init = (localizationService,httpService,userService) => {
		this.#localizationService = localizationService;
		this.#httpService = httpService;
		this.#userService = userService;
	};

	maybeUpdate = async() => {
		if(Date.now() - this.#lastUpdated > this.#updateInterval) await this.update();
	};
	
	update = async() => {
		await this.updateTopics();
		await this.updatePosts();
		this.#lastUpdated = Date.now();
	};

	maybeUpdateTopics = async() => {
		if(Date.now() - this.#topicsLastUpdated > this.#topicsUpdateInterval) await this.updateTopics();
	};

	updateTopics = async() => {
		const { data } = await this.#httpService.get("/api/blog/topics",{ noteError:true, });
		for(const blogTopic of data) {
			const topic = new BlogTopic(blogTopic);
			this.#topics[topic._id] = topic;
		}
		this.#topicsLastUpdated = Date.now();
	};
	
	maybeUpdatePosts = async() => {
		if(Date.now() - this.#postsLastUpdated > this.#postsUpdateInterval) await this.updatePosts();
	};

	updatePosts = async() => {		
		const { data } = await this.#httpService.get("/api/blog/posts",{ noteError:true });
		for(const blogPostObject of data)
			this.#saveBlogPostObject(blogPostObject);
		this.#postsLastUpdated = Date.now();
	};

	#saveBlogPostObject = (blogPostObject) => {
		const blogPost = new BlogPost(blogPostObject,(topicId) => this.#topics[topicId]);
		this.#saveBlogPost(blogPost);
	};

	#saveBlogPost = (blogPost) => {
		this.#posts[blogPost._id] = blogPost;
		for(const postThumbnail of blogPost.thumbnails)
			this.#postThumbnails[postThumbnail.contentId] = postThumbnail;
	};

	getTopicsObject = async() => {
		await this.maybeUpdate();
		const topicsObject = { ...this.#topics };
		return topicsObject;
	};

	getPostsObject = async() => {
		await this.maybeUpdate();
		const postsObject = { ...this.#posts };
		return postsObject;
	};

	// get thumbnails of current language
	getTopicThumbnails = async() => {
		await this.maybeUpdateTopics();
		const language = this.#localizationService.getLanguage();
		return this.#getTopicThumbnailsLang(language);
	};

	getTopicThumbnailsLang = async(language) => {
		await this.maybeUpdateTopics();
		return this.#getTopicThumbnailsLang(language);
	};

	#getTopicThumbnailsLang = async(language) => {
		const topics = Object.values(this.#topics);
		const topicThumbnails = topics.map( (topic) => topic.getThumbnailLang(language) );
		return { topicThumbnails };
	};

	getTopicById = async(topicId) => {
		await this.maybeUpdatePosts();
		return this.#topics[topicId];
	};

	getTopicThumbnailById = async(topicId) => {
		await this.maybeUpdatePosts();
		const topic = this.#topics[topicId];
		return topic;
	};

	// get thumbnails of current language, optionally filter by topic
	getPostThumbnails = async({ topicId }) => {
		await this.maybeUpdatePosts();
		const posts = Object.values(this.#posts);
		const languages = this.#localizationService.getLanguages();
		const filteredByTopic = this.#filterPostsByTopic(posts,topicId);
		const postThumbnails = filteredByTopic.map( (post) => this.#findThumbnailByLanguages(post,languages) );
		return { postThumbnails };
	};
	
	getPostThumbnail = async(postId) => {
		await this.maybeUpdatePosts();
		const post = this.#posts[postId];
		const languages = this.#localizationService.getLanguages();
		const postThumbnail = this.#findThumbnailByLanguages(post,languages);
		return postThumbnail;
	};

	getPostById = async(postId) => {
		await this.maybeUpdatePosts();
		const blogPost = this.#posts[postId];
		return blogPost;
	};

	#findThumbnailByLanguages = (post,languages) => {
		for(const language of languages) {
			const thumbnail = post.getThumbnailLang(language);
			if(thumbnail) return thumbnail;
		}
	};

	#filterPostsByTopic = (posts,topicId) => {
		if(!topicId) return posts;
		return posts.filter( (post) => post.topicId === topicId);
	};
	
	getPostContent = async(postThumbnail) => {
		const { _id,language } = postThumbnail;
		const { data:postHtmlString } = await this.#httpService.get(`/api/blog/post/${_id}/${language}`,{ noteError:true });
		return postHtmlString;
	};

	saveNew = async(blogPost,htmlStrings) => {
		const sessionToken = this.#userService.sessionToken;
		const { data:newBlogPostObject } = await this.#httpService.post(`/api/blog/post/new`,{ blogPostObject:blogPost._object,htmlStrings },{ headers:{ "x-auth-token":sessionToken },noteError:true });
		console.log("No id ???",newBlogPostObject);
		const newBlogPost = new BlogPost(newBlogPostObject,this.getTopicById);
		this.#saveBlogPostObject(newBlogPostObject);
		return newBlogPost;
	};

	saveEdited = async(blogPost,htmlStrings) => {
		const sessionToken = this.#userService.sessionToken;
		const { data:newBlogPostObject } = await this.#httpService.put(`/api/blog/post/save/${blogPost._id}`,{ blogPostObject:blogPost._object,htmlStrings },{ headers:{ "x-auth-token":sessionToken },noteError:true });
		console.log("No id ???",newBlogPostObject);
		const newBlogPost = new BlogPost(newBlogPostObject,this.getTopicById);
		this.#saveBlogPostObject(newBlogPostObject);
		return newBlogPost;
	};
};



const blogService = new BlogService();
blogService.init(localizationService,httpService,userService);

export default blogService;
