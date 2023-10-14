const axios = require('axios');

/**
 * Makes an API call to a specified endpoint with a specified HTTP method.
 *
 * @param {string} method - The HTTP method to use ('GET', 'POST', etc.)
 * @param {string} endpoint - The API endpoint to call
 * @param {Object|null} commands - Optional command object to send as data in API call
 * @returns {Promise} - Returns a promise resolving to the Axios response
 */
module.exports = async function makeApiCall(method, endpoint, commands = null) {
    // Configuration object for Axios
    const config = {
        method: method,  // HTTP method
        url: `https://api.smartthings.com/v1/devices/${process.env.AIR_HEAT_PUMP_DEVICE_ID}/` + endpoint,  // URL
        headers: {
            'Authorization': `Bearer ${process.env.SMARTTHINGS_API_TOKEN}`,  // Authorization header
            'Content-Type': 'application/json'  // Content type header
        }
    };

    // If commands are provided, add them to the data field
    if (commands) {
        config.data = { "commands": commands };
    }

    // Perform the API call and return the Axios promise
    return axios(config);
}
