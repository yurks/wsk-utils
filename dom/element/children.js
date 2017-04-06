var document = require('../document');
var w3c_first = 'firstElementChild' in document.documentElement;
var w3c_next = 'nextElementSibling' in document.documentElement;

var children = function(el) {
    var out = [];
    if (el) {
        var element = w3c_first ? el.firstElementChild : (children._legacyNextElSibling && children._legacyNextElSibling(el.firstChild, true));
        if (element) {
            out.push(element);
            while ((element = w3c_next ? element.nextElementSibling : (children._legacyNextElSibling && children._legacyNextElSibling(element)))) {
                out.push(element);
            }
        }
    }
    return out;
};

module.exports = children;
