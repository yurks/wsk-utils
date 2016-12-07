var noop = require('./noop');
var window = require('./window');

module.exports = function(url, callback, request_data, type, opts) {
    if (!window.jQuery) {
        return;
    }

    callback = callback || noop;

    var config = {
        url: url,
        data: request_data,
        type: type,
        jsonp: 'jsoncallbacks',
        dataType: (type === 'POST' ? 'json' : 'jsonp'),
        complete: function(jqXHR, textStatus) {
            if (textStatus !== 'success') {
                callback(false, jqXHR.status, textStatus, false, request);
            }
        },
        success: function(data) {
            callback(data);
        }
    };
    if (opts) {
        if (opts.timeout) {
            config.timeout = ~~opts.timeout;
        }
        if (opts.jsonp) {
            config.jsonp = opts.jsonp;
        }
    }

    var request = function() {
        jQuery.ajax(config);
    };

    request();
};

