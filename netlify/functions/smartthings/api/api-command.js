/**
 * Generates a SmartThings API command based on a hotkey and parameters.
 * This function serves as a convenient wrapper for sending commands to
 * SmartThings-enabled devices.
 *
 * @param {string} hotkey - A string identifier for the command to be sent.
 * @param {object} params - Additional parameters required for some commands.
 * @param {string} component - The component of the SmartThings device (default is 'main').
 *
 * @returns {object} The JSON command object to be sent to SmartThings API.
 *
 * @see https://developer.smartthings.com/docs/api/public/#tag/Capabilities
 */

module.exports = function smartThingsCommand(hotkey, params = {}, component = 'main') {
    let command = {};

    switch (hotkey) {
      case 'switch':
        if (params.mode) {
          command = {
            component,
            capability: 'switch',
            command: params.mode,
          };
        }
        break;

      case 'mode':
        if (params.mode) {
          command = {
            component,
            capability: 'airConditionerMode',
            command: 'setAirConditionerMode',
            arguments: [params.mode],
          };
        }
        break;

      case 'optional_mode':
        if (params.mode) {
          command = {
            component,
            capability: 'custom.airConditionerOptionalMode',
            command: 'setAcOptionalMode',
            arguments: [params.mode],
          };
        }
        break;

      case 'temperature':
        if (params.direction) {
          const direction = params.direction === 'up' ? 'raiseSetpoint' : 'lowerSetpoint';
          command = {
            component,
            capability: 'custom.thermostatSetpointControl',
            command: direction,
          };
        }
        break;

      default:
        command = {};
    }

    return command;
};
