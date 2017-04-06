var noop = require('../../var/noop');
var XHR = require('../xhr');

var window = require('../../dom/window');
var timer = require('../../var/timer');
var isString = require('../../var/is/string');
var isObject = require('../../var/is/object');
var urlData = require('../../uri/add-query');

module.exports = function(url, callback, request_data, type, opts) {
    callback = callback || noop;

    var config = {
        url: url,
        type: type,
        timeout: ~~(opts && opts.timeout)
    };

    var headers = {
        'Accept': 'application/json'
    };

    if (type === 'POST') {
        config.data = urlData(request_data);
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    var request = function() {
        sendXHR(config, headers, function(status, statusText, responses, headers) {
            var out, body = responses && responses.text || '';
            // Determine if successful
            var isSuccess = status >= 200 && status < 300 || status === 304;
            if (isSuccess) {
                try {
                    out = JSON.parse(body);
                } catch (e) {
                    statusText = 'Invalid response body';
                }
            }
            callback(out && isObject(out) ? out : false, status, statusText, headers, request);
        });
    };

    request();
};


var xhrId = 0;
var xhrCallbacks = {};
// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
    window.attachEvent('onunload', function() {
        for ( var key in xhrCallbacks ) {
            if (xhrCallbacks.hasOwnProperty(key)) {
                xhrCallbacks[key](undefined, true);
            }
        }
    });
}


function sendXHR ( options, headers, complete ) {
    var i,
        xhr = XHR.create(),
        timeoutTimer,
        id = ++xhrId,
        callback;

    // Open the socket
    xhr.open( options.type, options.url, true /*options.async, options.username, options.password */ );

    // Set headers
    for (i in headers) {
        if (headers.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, headers[ i ] + '');
        }
    }

    // Listener
    callback = function( _, isAbort ) {
        var status, statusText, responses;

        // Was never called and is aborted or complete
        if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
            // Clean up
            delete xhrCallbacks[ id ];
            callback = undefined;
            xhr.onreadystatechange = noop;
            timer.clear(timeoutTimer);

            // Abort manually if needed
            if ( isAbort ) {
                if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                }
            } else {
                responses = {};
                status = xhr.status;

                // Support: IE<10
                // Accessing binary-data responseText throws an exception
                // (#11426)
                if ( isString(xhr.responseText) ) {
                    responses.text = xhr.responseText;
                }

                // Firefox throws an exception when accessing
                // statusText for faulty cross-domain requests
                try {
                    statusText = xhr.statusText;
                } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = '';
                }


                // If the request is local and we have data: assume a success
                // (success with no data won't get notified, that's the best we
                // can do given current implementations)
                //if ( !status && options.isLocal && !options.crossDomain ) {
                //  status = responses.text ? 200 : 404;

                // Filter status for non standard behaviors
                // IE - #1450: sometimes returns 1223 when it should be 204
                if ( status === 1223 ) {
                    status = 204;
                }
            }
        }

        // Call complete if needed
        if ( responses ) {
            complete( status, statusText, responses, xhr.getAllResponseHeaders() );
        } else if (isAbort) {
            complete( -1, isAbort === true ? 'aborted' : isAbort);
        }
    };

    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkit etc. not handling that correctly
    // both npm request and jquery 1.x use this kind of timeout, so this is being consistent
    if (options.timeout > 0) {
        timeoutTimer = timer.set(function(){
            callback( undefined, 'timeout' );
        }, options.timeout );
    }

    // Add to the list of active xhr callbacks
    xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {};

    // Do send the request
    // This may raise an exception which is actually
    // handled in jQuery.ajax (so no try/catch here)
    try {
        xhr.send( options.data || null );
    } catch (e) {
        complete( -1, 'send_error');
    }
}
