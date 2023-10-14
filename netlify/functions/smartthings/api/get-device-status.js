const makeApiCall = require('./api-call');
const errorHandling = require('./api-error-handling');

/**
 * Get the current status of the device.
 */
module.exports = async function getDeviceStatus() {
    try {
        const status = await makeApiCall( 'GET', `status` );
        return {
            statusCode: 200,
            body: JSON.stringify( status.data )
        };
    } catch( e ) {
        return errorHandling( 500, e );
    }
}
