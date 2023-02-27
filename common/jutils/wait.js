
const wait = async(timeOut) => new Promise( (resolve,reject) => setTimeout(resolve,timeOut) );



module.exports = wait;
