import { BlogPost } from "jblog";
import { SubRouter } from "../../jrouter/jrouter.js";



let postSave = (blogManager,sessionManager) => {
	const router = new SubRouter();

	// vulnerability: validate _id
	router.usePutMethod("/:_id",async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(userError);
		if(!user.admin) return response.status(403).send("You must be an admin or editor to edit blog post");
		const { blogPostObject,htmlStrings } = request.body;
		const blogPost = new BlogPost(blogPostObject,blogManager.getTopicById);
		const newBlogPost = await blogManager.savePost(blogPost,htmlStrings);
		response.send(newBlogPost._object);
	});

	return router;
};



export default postSave;
