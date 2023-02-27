import { SubRouter } from "../../jrouter/jrouter.js";



const logout = (sessionManager) => {
	const router = new SubRouter();

	router.usePostMethod("/", async(request,response) => {
		const sessionToken = request.headers["x-auth-token"];
		if(sessionToken)
			await sessionManager.closeSession(sessionToken);
		response.send(true);
	});

	return router;
};



export default logout;
