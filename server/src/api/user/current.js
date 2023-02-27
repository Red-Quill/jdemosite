import { SubRouter } from "../../jrouter/jrouter.js";



const current = (sessionManager) => {
	const router = new SubRouter();

	router.useGetMethod("/", async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(!sessionToken) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionToken);
		if(userError) return response.status(401).send(userError);
		const userObject = user._object;
		response.send(userObject);
	});
	
	return router;
};



export default current;
