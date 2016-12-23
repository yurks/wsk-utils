var _queryShim = require('./query.shim');
var legacyQuerySelector = function(node, selector) {
    return _queryShim.call(node, selector);
};

module.exports = require('./_get')(false, legacyQuerySelector);