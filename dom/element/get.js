var filterNode = require('./node');
var get = require('./_get')(true);

module.exports = function(selector, node) {
    return filterNode(selector) || get(selector, node) || null;
};