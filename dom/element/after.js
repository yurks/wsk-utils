module.exports = function(el, node) {
    if (node.parentNode) {
        node.parentNode.insertBefore(el, node.nextSibling);
    }
};