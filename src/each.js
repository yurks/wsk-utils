var isArray = require('./isArray');
var isObject = require('./isObject');
var isPlainObject = require('./isPlainObject');
var isUndefined = require('./isUndefined');

module.exports = function(obj, callback, data) {
    var value, i;
    if (isObject(obj)) {
        if (isArray(obj) || !isNaN(obj.length)) {
            for (i = 0; i < obj.length; i += 1) {
                if (!isUndefined(obj[i])) {
                    value = callback.call(obj[i], i, obj[i], data);
                    if (value === false) {
                        return false;
                    }
                }
            }
        } else if (isPlainObject(obj)) {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    value = callback.call(obj[i], i, obj[i], data);
                    if (value === false) {
                        return false;
                    }
                }
            }
        }
    }
};

