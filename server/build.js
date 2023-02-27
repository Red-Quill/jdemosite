import fs from "fs/promises.js";



const build = async() => {
	await fs.rm("build",{ recursive:true });
	// create "build" directory
	await fs.mkdir("build/server",{ recursive:true });
	// copy "src"
	await fs.cp("src","build/server/src",{ recursive:true });
	// copy "index.js"
	await fs.cp("index.js","build/server/index.js");
	await fs.cp("package-lock.json","build/server/package-lock.json");
	await fs.cp("../common","build/common",{ recursive:true });

	const p = JSON.parse(await fs.readFile("package.json"));
	package_json_prod = {
		name : p.name,
		version : p.version,
		description : p.description,
		main : p.main,
		scripts : { start:p.scripts.start },
		engine : { node:p.engines.node },
		author : p.author,
		license : p.license,
		dependencies : p.dependencies,
	};
	await fs.writeFile("build/server/package.json",JSON.stringify(package_json_prod,null,2));
}

build();
