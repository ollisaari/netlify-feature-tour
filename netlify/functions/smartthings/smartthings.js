const setTemperature = require('./api/set-temperature');
const getRoomTemperature = require('./api/get-room-temperature');
const getDeviceStatus = require('./api/get-device-status');
const switchOnOff = require('./api/switch-on-off');

exports.handler = async (event, context) => {

    const apiKey = event.headers['x-api-key'] ?? null;

    if (
        event.headers.host !== 'localhost:8888' && (
            ! apiKey ||
            apiKey !== process.env.SECRET_API_KEY
        )
    ) {
        return {
            statusCode: 401,
            body: 'Access denied: Invalid API key',
        };
    }

    const command = event.queryStringParameters.command || null;

    if ( ! command ) {
        return {
            statusCode: 400,
            body: JSON.stringify('No command provided.')
        };
    }

    switch ( command ) {
        case 'setTemperature':

            return await setTemperature( event );

        case 'getRoomTemperature':

            return await getRoomTemperature( event );

        case 'getDeviceStatus':

            return await getDeviceStatus( event );

        case 'switch':

            return await switchOnOff( event );

        default:
            return {
                statusCode: 400,
                body: JSON.stringify('Invalid command provided.')
            };
    }
}
