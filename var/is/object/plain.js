var isObject = require('../object');
module.exports = function(obj) {
    return isObject(obj) && obj.constructor === Object;
};