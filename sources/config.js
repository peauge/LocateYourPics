
function getApiUrl() {

   return   'http://86.247.106.75';

}

exports.config = {
    containerName: process.env.CONTAINER_NAME || 'container_frontWeb',
    environment: process.env.ENVIRONMENT || 'dev',
    apiUrl: process.env.DATABASE_URL || getApiUrl()
};
