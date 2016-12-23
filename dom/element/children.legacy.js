var children = require('./children');

children._legacyNextElSibling = function(el, checkCurrent) {
    do {
        if (checkCurrent) {
            checkCurrent = false;
        } else {
            el = el.nextSibling;
        }
    } while ( el && el.nodeType !== 1 );
    return el;
};

module.exports = children;

