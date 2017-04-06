var build = require('./make');

module.exports = function(newnode, node) {
    if (newnode && node && node.parentNode) {
        if (!newnode.nodeType) {
            newnode = build(newnode);
        }
        node.parentNode.replaceChild(newnode, node);
    }
};
