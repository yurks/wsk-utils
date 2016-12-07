var isString = require('./isString');
var dom = require('./dom');

module.exports = function(inner, attrs, tag) {
    if (!isString(inner) || inner.indexOf('<') < 0) {
        inner = dom.render(inner, attrs, tag);
    }
    return inner;
};

