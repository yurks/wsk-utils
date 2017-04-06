var noop = require('../../var/noop');

var window = require('../../dom/window');
var document = require('../../dom/document');
var random = require('../../var/string/random');

var urlData = require('../../uri/add-query');
var timer = require('../../var/timer');

module.exports = function(url, callback, request_data, type, opts) {
    callback = callback || noop;

    var config = {
        url: url,
        data: request_data,
        jsonp: 'jsoncallback',
        timeout: ~~(opts && opts.timeout)
    };

    var request = function() {
        sendJSONP(config, function(data, error) {
            if (error) {
                callback(data, -1, error, false, request);
            } else {
                callback(data);
            }
        });
    };
    request();
};

var head, re_complete = /loaded|complete/;
var removeCallback = function(callbackName) {
    // try/catch handles cases where IE balks (such as removing a property on window)
    try {
        window[callbackName] = undefined;
        delete window[callbackName];
    } catch (e) {}
};

function sendJSONP(options, complete) {
    var jsonpCallbackName, jsonpCallbackParam, script, done, timeoutTimer;

    head = head || document.head || document.getElementsByTagName('head')[0] || document.documentElement;

    jsonpCallbackParam = options.jsonp || 'callback';
    jsonpCallbackName = 'jsonp_' + random();

    var url = options.url || '';
    if (options.data) {
        url = urlData(options.data, url);
    }
    url = urlData(jsonpCallbackParam + '=' + jsonpCallbackName, url);

    script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = script.onreadystatechange = done = function(e, error) {
        if (script) {
            if ( error || !script.readyState || re_complete.test(script.readyState+'')) {
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = script.onerror = null;

                timer.clear(timeoutTimer);

                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }

                // Dereference the script
                script = null;

                if (error) {
                    complete(false, error);

                } else if (window[jsonpCallbackName]) {
                    timer.set(function() {
                        if (window[jsonpCallbackName]) {
                            removeCallback(jsonpCallbackName);
                            complete(false, 'parsererror');
                        }
                    }, 1);
                }

            }
        }
    };

    script.onerror = function() {
        removeCallback(jsonpCallbackName);
        done(false, 'jsonp transport error');
    };

    if (options.timeout > 0) {
        timeoutTimer = timer.set(function(){
            done(false, 'timeout');
            // leave window[jsonpCallbackName]
            complete = noop;
        }, options.timeout);
    }

    window[jsonpCallbackName] = function(data) {
        removeCallback(jsonpCallbackName);
        complete(data);
    };

    head.insertBefore(script, head.firstChild);
}
