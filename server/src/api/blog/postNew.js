import { BlogPost } from "jblog";
import { SubRouter } from "../../jrouter/jrouter.js";



let postNew = (blogManager,sessionManager) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(userError);
		if(!user.admin) return response.status(403).send("You must be an admin or editor to create a new blog post");
		const { blogPostObject,htmlStrings } = request.body;
		const blogPost = new BlogPost(blogPostObject,blogManager.getTopicById);
		const newBlogPost = await blogManager.newPost(blogPost,htmlStrings);
		response.send(newBlogPost._object);
	});

	return router;
};



export default postNew;
