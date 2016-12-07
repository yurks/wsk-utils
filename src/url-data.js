var param = require('./param');
var isObject = require('./isObject');
var isString = require('./isString');

module.exports = function(request_data, url) {
    if (isObject(request_data)) {
        request_data = param(request_data);
    }
    if (isString(url)) {
        return url + (request_data ? (url.indexOf('?') < 0 ? '?' : '&') + request_data : '');
    }
    return request_data || '';
};