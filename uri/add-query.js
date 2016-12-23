var each = require('../var/object/each');
var param = require('./param');
var isObject = require('../var/is/object');
var isString = require('../var/is/string');

module.exports = function(request_data, url) {
    if (isObject(request_data)) {
        request_data = param(request_data);
    }
    if (isString(url)) {
        return url + (request_data ? (url.indexOf('?') < 0 ? '?' : '&') + request_data : '');
    }
    return request_data || '';
};