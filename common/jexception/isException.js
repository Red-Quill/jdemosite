const Exception = require("./exception");



const isException = (exception) => exception.prototype.constructor === Exception;



module.exports = isException;
