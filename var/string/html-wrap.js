var isString = require('../is/string');
var html = require('./html');

module.exports = function(inner, attrs, tag) {
    if (!isString(inner) || inner.indexOf('<') < 0) {
        inner = html(inner, attrs, tag);
    }
    return inner;
};
