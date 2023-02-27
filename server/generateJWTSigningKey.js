import crypto from "crypto.js";



const key = crypto.randomBytes(32);
console.log(key.toString("hex"));
