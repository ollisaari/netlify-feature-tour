/**
 * Function to handle API errors
 *
 * @param {number} code
 * @param {string|Object} error
 */
module.exports = function apiErrorHandling(code, error) {

    let message = '';

    if ( typeof error === 'string' && error !== '' ) {
        message = error;
    } else if ( error instanceof Object && Object.keys(error).length > 0 ) {
        message = JSON.stringify( error );
    } else {
        message = 'An error occurred.';
    }

    return {
        statusCode: code,
        body: message
    };
}
