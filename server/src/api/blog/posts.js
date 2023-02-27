import { SubRouter } from "../../jrouter/jrouter.js";



const posts = (blogManager) => {
	const router = new SubRouter();
	
	router.useGetMethod("/", async(request,response) => {
		const posts = await blogManager.getPublishedPosts();
		const postOjbects = posts.map( (post) => post._object );
		response.send(postOjbects);
	});

	return router;
};



export default posts;
