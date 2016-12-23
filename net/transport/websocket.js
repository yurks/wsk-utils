var random = require('../../var/string/random');
var isFunction = require('../../var/is/function');
var timer = require('../../var/timer');
var cbList = {};
var reUrl = /^(https?\:\/\/)?[\w\.\-_\:]+/i;

module.exports = function(url, callback, request_data, type, opts) {

    if (!opts || !opts.ws || !opts.ws.connection) {
        callback(false, -1, 'websocket transport error');
        return;
    }

    var config = {
        requestData: {
            method: type,
            url: url.replace(reUrl, ''),
            data: request_data
        },
        timeout: ~~opts.timeout,
        connection: opts.ws.connection
    };

    var request = function() {
        sendWS(config, function(data, error) {
            if (error) {
                callback(data, -1, error, false, request);
            } else {
                callback(data);
            }
        });
    };
    request();

};

function sendWS(options, complete) {
    var wsCallbackName, timeoutTimer;

    options.requestData.callback = wsCallbackName = 'ws_' + random();
    options.connection.onmessage = options.connection.onmessage || onMessage;

    if (options.timeout > 0) {
        timeoutTimer = timer.set(function(){
            delete cbList[wsCallbackName];
            complete(false, 'timeout');
        }, options.timeout)
    }

    cbList[wsCallbackName] = function(data) {
        delete cbList[wsCallbackName];
        timer.clear(timeoutTimer);
        complete(data);
    };

    options.connection.send(JSON.stringify(options.requestData));

}

function onMessage(e) {
    var payload = JSON.parse(e.data),
        cb = payload.callback;
    if (cb in cbList) {
        if (isFunction(cbList[cb])) {
            cbList[cb](payload.data);
        }
        delete cbList[cb];
    }
}
