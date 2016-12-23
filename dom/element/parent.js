module.exports = function(node) {
    var parent = node && node.parentNode;
    //IE(
    return parent && parent.nodeType !== 11 ? parent : null;
};