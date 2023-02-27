import { SubRouter } from "../../jrouter/jrouter.js";



let register = (userManager) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",async(request,response) => {
		const { name,email,password } = request.body;
		await userManager.registerUser(name,email,password);
		response.send(true);
	});
	
	return router;
};



export default register;


/*

*/