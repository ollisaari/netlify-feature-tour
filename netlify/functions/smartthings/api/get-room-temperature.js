const errorHandling = require('./api-error-handling');
const getDeviceStatus = require('./get-device-status');

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

        if ( event.queryStringParameters.ifttt && parseInt( event.queryStringParameters.ifttt ) === 1 ) {
            const config = {
                method: 'get',
                url: `./functions/ifttt-webhook/?event=temperature&value1=${process.env.AIR_HEAT_PUMP_DEVICE_ID}&value2=${currentTemperature}`,
                headers: {
                    'x-api-key': process.env.SECRET_API_KEY,
                    'Content-Type': 'application/json'
                }
            };

            // Perform the API call and return the Axios promise
            return axios(config);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                temperature: currentTemperature,
                iftttWebookUrl: config.url ?? ''
            })
        };

    } catch( e ) {
        return errorHandling( 500, e );
    }
}
