var window = require('../window');
var document = require('../document');
var random = require('../../var/string/random');
var isNumber = require('../../var/is/number');

var enabled, testCookieName = '__testCookie_' + random();

var _root = {
    enabled: function() {
        if (enabled == null) {
            if (window.navigator && window.navigator.cookieEnabled) {
                _root.set(testCookieName, testCookieName);
                enabled = _root.get(testCookieName) === testCookieName;
                _root.set(testCookieName);
            } else {
                enabled = false;
            }
        }
        return enabled;
    },

    set: function(key, value) {
        if (key) {
            var opts = {};

            //remove cookie
            if (value == null) {
                opts.expires = -1;
            }

            if (isNumber(opts.expires)) {
                var days = opts.expires;
                opts.expires = new Date();
                opts.expires.setDate(opts.expires.getDate() + days);
            }

            document.cookie = [
                encodeURIComponent(key), '=', encodeURIComponent(value), opts.expires ? '; expires=' + opts.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                opts.path ? '; path=' + opts.path : '', opts.domain ? '; domain=' + opts.domain : '', opts.secure ? '; secure' : ''
            ].join('');
        }

    },

    get: function(key) {
        var output = '', i, cookie, pair;
        if (key && document.cookie) {
            key = decodeURIComponent(key);

            cookie = document.cookie.split('; ');
            for (i = 0; i < cookie.length; i+=1) {
                pair = cookie[i] && cookie[i].split('=');
                if (pair && pair[0] === key) {
                    output = decodeURIComponent(pair[1] || '');
                    break;
                }
            }
        }
        return output;
    }
};

module.exports = _root;

