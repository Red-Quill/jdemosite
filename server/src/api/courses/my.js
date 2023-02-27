import { SubRouter } from "../../jrouter/jrouter.js";



const my = (courseManager,sessionManager) => {
	const router = new SubRouter();

	router.useGetMethod("/", async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(userError);
		const myCourses = await courseManager.getUserCourseList(user);
		response.send(myCourses);
	});

	return router;
}



export default my;
