const axios = require('axios');

/**
 * Trigger IFTTT webhook
 */
exports.handler = async (event, context) => {

    const webhookEvent = event.queryStringParameters.event || null;
    const value1 = event.queryStringParameters.value1 || null;
    const value2 = event.queryStringParameters.value2 || null;
    const value3 = event.queryStringParameters.value3 || null;

    if ( ! webhookEvent ) {
        return {
            statusCode: 400,
            body: JSON.stringify('No event provided.')
        };
    }

    // get the event name
    // build the body of the request
    let body = {};
    if ( value1 ) {
        body.value1 = value1;
    }
    if ( value2 ) {
        body.value2 = value2;
    }
    if ( value3 ) {
        body.value3 = value3;
    }

    try {
        // call the webhook and wait for it to complete
        const response = await axios.post(
            `https://maker.ifttt.com/trigger/${webhookEvent}/json/with/key/${process.env.IFTTT_WEBHOOK_KEY}`,
            body
        );

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }
}

