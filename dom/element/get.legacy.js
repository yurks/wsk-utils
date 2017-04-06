var filterNode = require('./node');

var _queryShim = require('./query.shim');
var legacyQuerySelector = function(node, selector) {
    return _queryShim.call(node, selector);
};
var get = require('./_get')(true, legacyQuerySelector);

module.exports = function(selector, node) {
    return filterNode(selector) || get(selector, node) || null;
};