//import log4js from 'log4js';

function getApiUrl() {

   // return   'https://pickaguide.fr:3000';
   return   'http://86.247.106.75';

}

/*function setUpLogger() {
    log4js.configure(params.logger);
    global.logger = log4js.getLogger(params.logger.appenders[0].category);
}*/

exports.config = {
    containerName: process.env.CONTAINER_NAME || 'container_frontWeb',
    environment: process.env.ENVIRONMENT || 'dev',
    apiUrl: process.env.DATABASE_URL || getApiUrl()
//    logger: setUpLogger
};
