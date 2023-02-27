import { SubRouter } from "../../jrouter/jrouter.js";
import JJoi from "jjoi";



const post = (blogManager) => {
	const router = new SubRouter();

	router.useGetMethod("/:_id/:language", async(request,response) => {
		const  { _id,language } = request.params;
		const { error:idError,value:postId } = JJoi.validate(_id,JJoi.objectId());
		if(idError) return response.status(400).send("Invalid object id");
		const { postHtmlString,error } = await blogManager.getPostContent(postId,language);
		if(error) return response.status(500).send(error);
		response.send(postHtmlString);
	});

	return router;
};



export default post;
