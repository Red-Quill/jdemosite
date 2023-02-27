import { SubRouter } from "../../jrouter/jrouter.js";



const topics = (blogManager) => {
	const router = new SubRouter();
	
	router.useGetMethod("/", async(request,response) => {
		const topics = await blogManager.getTopics();
		const topicObjects = topics.map( (topic) => topic._object );
		response.send(topicObjects);
	});

	return router;
};



export default topics;


/*

import { SubRouter } from "../../jrouter/jrouter.js";
const router = new SubRouter();
useGetMethod

const topics_ = async(request,response,{ blogManager }) => {
	const topics = await blogManager.getTopics();
	const topicObjects = topics.map( (topic) => topic._object )
	response.send(topicObjects);
};

const topics = (blogManager) => {
	const router = express.Router();
	
	router.get("/", async(request,response) => {
		//try {
		//	topics_(request,response,{ blogManager });
			
			const topics = await blogManager.getTopics();
			const topicObjects = topics.map( (topic) => topic._object )
			response.send(topicObjects);
		//} catch(exception) {next(exception)}
	});

	return router;
};




const topics = (blogManager) => {
	const router = express.Router();
	
	router.get("/", async(request,response) => {
			const topics = await blogManager.getTopics();
			const topicObjects = topics.map( (topic) => topic._object )
			response.send(topicObjects);
	});

	return router;
};
*/