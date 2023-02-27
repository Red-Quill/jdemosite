import { SubRouter } from "../../jrouter/jrouter.js";



const myAdd = (courseManager,sessionManager) => {
	const router = new SubRouter();

	router.usePutMethod("/", async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token header in request");
		const course = await courseManager.getCourse(request.body.courseId);
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(error);
		const { error:addError } = await courseManager.addCourseToUser(course,user);
		if(addError) return response.status(500).send(error);
		response.send(true);
	});

	return router;
};



export default myAdd;
