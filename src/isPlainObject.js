var isObject = require('./isObject');
module.exports = function(obj) {
    return isObject(obj) && obj.constructor === Object;
};