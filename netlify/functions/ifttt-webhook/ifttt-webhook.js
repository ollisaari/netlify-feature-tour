const axios = require('axios');

/**
 * Trigger IFTTT webhook
 */
exports.handler = async (event, context) => {

    const event = event.queryStringParameters.event || null;
    const value1 = event.queryStringParameters.value1 || null;
    const value2 = event.queryStringParameters.value2 || null;
    const value3 = event.queryStringParameters.value3 || null;

    if ( ! event ) {
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

    // call the webhook
    axios.post(
        `https://maker.ifttt.com/trigger/${event}/json/with/key/${process.env.IFTTT_KEY}`,
        body
    ).then(function (response) {
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        }
    }).catch(function (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    });
}

