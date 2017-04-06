var isNode = require('./is-node');
var isString = require('../../var/is/string');

module.exports = function(node) {
    if (node && !isString(node)) {
        if (isNode(node)) {
            return node;
        } else if (node.length && node[0] && isNode(node[0])) {
            return node[0];
        }
    }
};
