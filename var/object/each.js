var isArray = require('../is/object/array');
var isObject = require('../is/object');
var isPlainObject = require('../is/object/plain');
var isUndefined = require('../is/undefined');

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

