module.exports = function html(text, node) {
    if (arguments.length === 1 && text) {
        return text.innerHTML;
    } else if (node) {
        node.innerHTML = text;
    }
};
