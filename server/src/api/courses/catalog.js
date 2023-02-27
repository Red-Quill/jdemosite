import { SubRouter } from "../../jrouter/jrouter.js";



const catalog = (courseManager) => {
	const router = new SubRouter();
	
	router.useGetMethod("/", async(request,response) => {
		const courses = await courseManager.getCourses();
		const courseObjects = courses.map( (course) => course._object );
		response.send(courseObjects);
	});
	
	return router;
};



export default catalog;
