import config from "./src/jServerConfig.js";
import JServer from "./src/JServer.js";



const start = async() => {
	const jServerConfig = await config();
	const jServer = new JServer();
	await jServer.init(jServerConfig);
};

start();
