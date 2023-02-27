// for health checks (e.g. AWS load balancers)
import { SubRouter } from "../jrouter/jrouter.js";



const health = () => {
	const router = new SubRouter();
	
	router.useGetMethod("/", async(request,response) => {
		response.send(true);
	});

	return router;
};



export default health;
