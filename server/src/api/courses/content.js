import { SubRouter } from "../../jrouter/jrouter.js";



const content = (courseManager,sessionManager) => {
	const router = new SubRouter();

	// vulnerability -- validate courseId and language
	router.useGetMethod("/:courseId/:language", async(request,response) => {
		const { courseId,language } = request.params;
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(userError);
		// gives full file path for now
		const { contentFilePath,error:contentError } = await courseManager.getCourseContent(courseId,language,user);
		//
		if(contentError) response.status(500).send(contentError);
		response.sendFile(contentFilePath);
	});

	return router;
};



export default content;
