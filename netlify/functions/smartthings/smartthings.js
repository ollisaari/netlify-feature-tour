const axios = require('axios');
const sleep = require('sleep-promise');

const HEADERS = {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json', //optional
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Origin'
}

// Replace YOUR_SMARTTHINGS_API_TOKEN with your actual SmartThings API Token
const API_TOKEN = '0b0e47b9-5a7e-4c13-8b08-af2295a7ec00';

// Replace YOUR_DEVICE_ID with the actual Device ID of your air heat pump
const DEVICE_ID = '3c8de04d-a703-c8c6-8705-185c9372317d';

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
};

const apiUrl = `https://api.smartthings.com/v1/devices/${DEVICE_ID}`;

exports.handler = async (event, context) => {
    const apiKey = event.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
        return {
            statusCode: 403,
            body: 'Access denied: Invalid API key',
            HEADERS
        };
    }

    // Get the desired temperature from query parameters
    const desiredTemperature = event.queryStringParameters.temperature;

    if (!desiredTemperature || isNaN(desiredTemperature)) {
        return {
            statusCode: 400,
            body: JSON.stringify('Invalid temperature provided.'),
            HEADERS
        };
    }

    try {
        // Set device to default mode (heating)
        await axios.post(`${apiUrl}/commands`, {
            "commands": [
                {
                    "component": "main",
                    "capability": "switch",
                    "command": "on"
                },
                {
                    "component": "main",
                    "capability": "airConditionerMode",
                    "command": "setAirConditionerMode",
                    "arguments": [
                        "heat"
                    ]
                },
                {
                    "component": "main",
                    "capability": "custom.airConditionerOptionalMode",
                    "command": "setAcOptionalMode",
                    "arguments": [
                        "off"
                    ]
                }
            ]
        }, {
            headers: headers
        });

        try {
            // Fetch device status
            const status = await axios.get(`${apiUrl}/status`, {
                headers: headers
            });

            // Current set target temperature
            const currentTemperature = status.data.components.main.thermostatCoolingSetpoint.coolingSetpoint.value;
            
            // If the current temperature is the same as the desired temperature, return
            if (currentTemperature === desiredTemperature) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(`Temperature is already set to ${desiredTemperature} degrees.`),
                    HEADERS
                };
            }
            
            // Calculate the difference between the current temperature and the desired temperature
            const difference = desiredTemperature - currentTemperature;

            // Initialize command to raise or lower the temperature
            const command = difference > 0 ? "raiseSetpoint" : "lowerSetpoint";

            // Make API calls to adjust temperature, one call per degree
            for (let i = 0; i < Math.abs(difference); i++) {
                await axios.post(`${apiUrl}/commands`, {
                    "commands": [
                        {
                            "component": "main",
                            "capability": "custom.thermostatSetpointControl",
                            "command": command
                        }
                    ]
                }, {
                    headers: headers
                });
                await sleep( 500 );
            }

            return {
                statusCode: 200,
                body: JSON.stringify(`Temperature set to ${desiredTemperature} degrees (ero: ${difference}).`),
                HEADERS
            };

        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify('An error occurred.'),
                HEADERS
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('An error occurred.'),
            HEADERS
        };
    }
}    