var re_isIdSelector = /^#[^\s\.\[]+$/;
var re_isTagSelector = /^[^\s\.\[#]+$/;
var re_isClassSelector = /^\.[^\s\.#:\[]+$/;
var re_isAttrSelector = /^\[[a-z0-9_:\.\-]+]$/i;

module.exports = function(selector, node) {
    if (re_isIdSelector.test(selector)) {
        return node.id === selector.slice(1);
    }
    if (re_isClassSelector.test(selector)) {
        return (' ' + node.className + ' ').indexOf(' ' + selector.slice(1) + ' ') > -1;
    }
    if (re_isTagSelector.test(selector)) {
        return node.tagName === selector.toUpperCase();
    }
    if (re_isAttrSelector.test(selector)) {
        return node.getAttribute(selector.slice(1,-1)) != null;
    }
    return false;
};

