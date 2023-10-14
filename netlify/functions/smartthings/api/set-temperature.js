const sleep = require('sleep-promise');
const commands = require('./api-command');
const deviceStatus = require('./get-device-status');
const makeApiCall = require('./api-call');
const errorHandling = require('./api-error-handling');

/**
 * Set the desired temperature for the room.
 *
 * @param {object} Netlify event
 */
module.exports = async function setTemperature( event ) {

    const desiredTemperature = event.queryStringParameters.temperature;

    if (!desiredTemperature || isNaN(desiredTemperature)) {
        return errorHandling( 400, 'Invalid temperature provided.' );
    }

    try {

        // Set device to default mode (heating)
        await makeApiCall( 'POST', `commands`, [
            commands('switch', { mode: 'on' } ),
            commands('mode', { mode: 'heat' }),
            commands('optional_mode', { mode: 'off' })
        ]);

        try {

            // Fetch device status
            const status = await deviceStatus();

            status.body = JSON.parse( status.body );

            // Current set target temperature
            const currentTemperature = status.body.components.main.thermostatCoolingSetpoint.coolingSetpoint.value;

            desiredTemperature = parseInt( desiredTemperature );

            // If the current temperature is the same as the desired temperature, return
            if ( currentTemperature === desiredTemperature ) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(`Temperature is already set to ${desiredTemperature} degrees.`)
                };
            }

            // Calculate the difference between the current temperature and the desired temperature
            const difference = desiredTemperature - currentTemperature;

            // Initialize command to raise or lower the temperature
            const direction = difference > 0 ? "up" : "down";

            // Make API calls to adjust temperature, one call per degree
            for (let i = 0; i < Math.abs(difference); i++) {

                await makeApiCall( 'POST', `commands`, [
                    commands('temperature', { direction: direction })
                ]);

                await sleep( 500 );
            }

            return {
                statusCode: 200,
                body: JSON.stringify(`Temperature set to ${desiredTemperature} degrees.`)
            };

        } catch( e ) {
            return errorHandling( 500, e );
        }
    } catch( e ) {
        return errorHandling( 500, e );
    }
}
