module.exports = function(selector, node) {
    var matches = (node.matches ||
    node.webkitMatchesSelector ||
    node.mozMatchesSelector ||
    node.msMatchesSelector ||
    node.oMatchesSelector);

    return matches ? matches.call(node, selector) : null;
};
