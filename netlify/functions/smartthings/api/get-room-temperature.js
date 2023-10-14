const errorHandling = require('./api-error-handling');
const getDeviceStatus = require('./get-device-status');

/**
 * Get the current status of the device.
 */
module.exports = async function getRoomTemperature() {
    try {
        const status = await getDeviceStatus();

        status.body = JSON.parse( status.body );

        // Current temperature in the room
        const currentTemperature = status.body.components.main.temperatureMeasurement.temperature.value;

        return {
            statusCode: 200,
            body: JSON.stringify({
                temperature: currentTemperature
            })
        };

    } catch( e ) {
        return errorHandling( 500, e );
    }
}
