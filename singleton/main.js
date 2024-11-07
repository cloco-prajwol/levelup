const Logger = require('./Logger');
const logger1 = new Logger();
logger1.log("log 1");

const logger2 = new Logger();
logger2.log("log 2");

console.log( logger1 === logger2); 

console.log(logger1.getLogs());
console.log(logger2.getLogs());
