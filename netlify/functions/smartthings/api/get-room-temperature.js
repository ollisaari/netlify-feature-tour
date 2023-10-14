const errorHandling = require('./api-error-handling');
const getDeviceStatus = require('./get-device-status');
const axios = require('axios');

/**
 * Get the current status of the device.
 *
 * @param {object} Netlify event
 */
module.exports = async function getRoomTemperature( event ) {
    try {
        const status = await getDeviceStatus();

        status.body = JSON.parse( status.body );

        // Current temperature in the room
        const currentTemperature = status.body.components.main.temperatureMeasurement.temperature.value;

        const returnBody = {
            temperature : currentTemperature
        };

        if ( event.queryStringParameters.ifttt && parseInt( event.queryStringParameters.ifttt ) === 1 ) {

            const protocol = event.headers.host.includes( 'localhost' ) ? 'http' : 'https';
            const baseUrl = protocol + '://' + event.headers.host;

            const config = {
                method: 'post',
                url: `${baseUrl}/.netlify/functions/ifttt-webhook/?event=temperature&value1=${process.env.AIR_HEAT_PUMP_DEVICE_ID}&value2=${currentTemperature}`,
                headers: {
                    'x-api-key': process.env.SECRET_API_KEY,
                    'Content-Type': 'application/json'
                }
            };

            // Perform the API call and return the Axios promise
            const ifttt = await axios(config);

            returnBody.ifttt = ifttt.data;
        }

        return {
            statusCode: 200,
            body: JSON.stringify(returnBody)
        };

    } catch( e ) {
        return errorHandling( 500, e );
    }
}
