//import log4js from 'log4js';

function getApiUrl() {
    if (process.env.API_URL) {
        return process.env.API_URL;
    } else if (process.env.ENVIRONMENT === 'production') {
        return 'dev.l0cal:4242/api';
    }

    /*if (process.env.NODE_ENV === 'production') {
        return 'http://82.223.82.41:3000';
    }*/

  //  return 'http://192.168.0.102:3030';
   return   'https://pickaguide.fr:3000';
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
