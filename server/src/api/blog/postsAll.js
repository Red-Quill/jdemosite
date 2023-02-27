import { SubRouter } from "../../jrouter/jrouter.js";



const postsAll = (blogManager) => {
	const router = new SubRouter();
	
	router.useGetMethod("/", async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(userError);
		if(!user.admin) return response.status(403).send("Only admins can get all posts");
		const posts = await blogManager.getAllPosts();
		const postOjbects = posts.map( (post) => post._object );
		response.send(postOjbects);
	});

	return router;
};



export default postsAll;
