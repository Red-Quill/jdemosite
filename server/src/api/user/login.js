import { SubRouter } from "../../jrouter/jrouter.js";



const login = (sessionManager) => {
	const router = new SubRouter();

	router.usePostMethod("/", async(request,response) => {
		try {
			const { email,password } = request.body;
			const { sessionToken,error } = await sessionManager.newUserSession(email,password);
			if(error) return response.status(401).send("Invalid email or password");
			response.header("x-auth-token",sessionToken).send(true);
		} catch(exception) {
			response.status(500).send(exception.message);
		}
	});
	
	return router;
};



export default login;
