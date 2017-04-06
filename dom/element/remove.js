module.exports = function(node) {
    if (node && node.parentNode) {
        //TODO: destroy in IE somehow..
        return node.parentNode.removeChild(node);
    }
};
