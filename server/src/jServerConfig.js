import fs from "fs/promises";
import { fromIni } from "@aws-sdk/credential-providers";
import { SSMClient,GetParameterCommand } from "@aws-sdk/client-ssm";



function mergeRecursive(targetObject, ...sourceObjects) {
	for(const sourceObject of sourceObjects) {
		Object.keys(sourceObject).forEach(function(key) {
			if (typeof sourceObject[key] === "object") {
				if (targetObject[key] === undefined) {
					targetObject[key] = {};
				}
				mergeRecursive(targetObject[key], sourceObject[key]);
			} else {
				targetObject[key] = sourceObject[key];
			}
		});
	}
	return targetObject;
}

// okay: read credentials from file and parse key id and secret key
const awsConfig = async() => {
	const sSMclient = new SSMClient({
		credentials : fromIni({profile: 'jt-dev-api-server-user'}), // explicit profile to use
		region : "us-east-1",
	});
	
	const awsConfigGetParameter = async(path) => {
		const command = new GetParameterCommand({ Name:path,WithDecryption:true });
		const response = await sSMclient.send(command);
		const value = response.Parameter.Value;
		return value;
	}

	const config = {
		server : {
			httpPort : 80,
		},
		database : {
			baseURL : await awsConfigGetParameter("/jt-dev-api/database/url"),
			name : await awsConfigGetParameter("/jt-dev-api/database/name"),
			username : await awsConfigGetParameter("/jt-dev-api/database/username"),
			password : await awsConfigGetParameter("/jt-dev-api/database/password"),
			useSsl : true,
			sslCAFilename : process.env.JDEMOSITE__DATABASE_SSLCAFILE,
		},
		blog : {
			postFilesPath : await awsConfigGetParameter("/jt-dev-api/blog/postfilespath"),
		},
		courses : {
			courseFilesPath : await awsConfigGetParameter("/jt-dev-api/courses/coursefilespath"),
		},
		sessions : {
			jWTSigningKey : await awsConfigGetParameter("/jt-dev-api/sessions/jwt-signing-key"),
			sessionStorePath : await awsConfigGetParameter("/jt-dev-api/sessions/store-path"),
		},
		logger : {
			logFilesPath : process.env.JDEMOSITE__LOGGER_LOGFILESPATH || "log",
		},
	};

	return config;
}

const envConfig = async() => {
	const config = {
		server : {
			httpPort : process.env.JDEMOSITE__HTTP_PORT,
			httpsPort : process.env.JDEMOSITE__HTTPS_PORT,
		},
		database : {
			baseURL : process.env.JDEMOSITE__DATABASE_URL,
			name : process.env.JDEMOSITE__DATABASE_NAME,
		},
		blog : {
			postFilesPath : process.env.JDEMOSITE__BLOG_POSTFILESPATH,
		},
		sessions : {
			jWTSigningKey : process.env.JDEMOSITE__SESSIONS_JWTSIGNINGKEY,
			sessionStorePath : process.env.JDEMOSITE__SESSIONS_SESSIONSTOREPATH,
		},
		logger : {
			logFilesPath : process.env.JDEMOSITE__LOGGER_LOGFILESPATH || "log",
		},
	};
	return config;	
}

const configError = async() => {
	throw new Error("JDEMOSITE__CONFIGSTYLE ennvironment variable erraneous: ", process.env.JDEMOSITE__CONFIG);
}

const productionConfig = async() => {
	const configStyle = process.env.JDEMOSITE__CONFIG;
	const config = configStyle === "env" ? await envConfig() : configStyle === "aws" ? await awsConfig() : configError() ;
	return config;
};

const developmentConfig = async() => {
	const defaultConfigJSON = await fs.readFile("default_config.json");
	const customConfigJSON = await fs.readFile(`development_config.json`);
	const defaultConfig = JSON.parse(defaultConfigJSON);
	const customConfig = JSON.parse(customConfigJSON)
	const config = mergeRecursive({},defaultConfig,customConfig);
	return config;
};



const config = async() => {
	const env = process.env.NODE_ENV || 'development';
	const jServerConfig = env === "production" ? await productionConfig() : await developmentConfig();
	return jServerConfig;
}



export default config;
