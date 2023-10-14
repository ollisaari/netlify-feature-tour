const makeApiCall = require('./api-call');
const errorHandling = require('./api-error-handling');
const command = require('./api-command');


module.exports = async function switchOnOff( mode ) {
    try {
        const request = makeApiCall( 'POST', `commands`, [
            command( 'switch', { mode } )
        ]);

        if ( request.data.results.status === 'COMPLETED' ) {
            return {
                statusCode: 200,
                body: JSON.stringify( request.data.results )
            };
        } else {
            return errorHandling( 500, request.data );
        }
    } catch( e ) {
        return errorHandling( 500, e );
    }
}
