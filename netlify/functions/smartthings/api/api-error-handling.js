/**
 * Function to handle API errors
 *
 * @param {number} code
 * @param {string|Object} error
 */
module.exports = function apiErrorHandling(code, error) {

    console.error(error);

    let message = '';

    if (typeof error === 'string' && error !== '' ) {
        message = error;
    } else if (error instanceof Object && error.message) {
        message = JSON.stringify(error);
    } else {
        message = 'An error occurred.';
    }

    return {
        statusCode: code,
        body: message
    };
}
