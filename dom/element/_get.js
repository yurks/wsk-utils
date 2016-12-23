var document = require('../document');
var isString = require('../../var/is/string');
var toArray = require('../../var/object/to-array');

var isQuerySelectorAll = !!document.querySelectorAll;

var re_isIdSelector = /^#[^\s\.\[]+$/;
var re_isTagSelector = /^[^\s\.\[#]+$/;

// only simple selectors like #id, .classname, tag
module.exports = function(_single, _legacy) {
    return function(selector, node) {
        if (!(selector && isString(selector))) {
            return _single ? void 0 : [];
        }

        node = node || document;
        if (re_isIdSelector.test(selector)) {
            node = document.getElementById(selector.slice(1));
            if (_single) {
                return node;
            } else {
                return node ? [] : [node];
            }
        } else if (re_isTagSelector.test(selector)) {
            node = node.getElementsByTagName(selector);
        } else if (isQuerySelectorAll) {
            node = node.querySelectorAll(selector);
        } else {
            if (_legacy) {
                node = _legacy(node, selector);
            } else {
                node = [];
            }
            if (!_single) {
                return node;
            }
        }
        return _single ? node[0] : toArray(node);
    }

};