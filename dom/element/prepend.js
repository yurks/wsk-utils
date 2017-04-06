module.exports = function(el, node) {
    return node && node.insertBefore(el, node.firstChild);
};
