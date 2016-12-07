function nextElementSiblingIE(el, checkCurrent) {
    do {
        if (checkCurrent) {
            checkCurrent = false;
        } else {
            el = el.nextSibling;
        }
    } while ( el && el.nodeType !== 1 );
    return el;
}

module.exports = function(el) {
    var out = [];
    if (el) {
        var element = el.firstElementChild || ($$vars.IE8 && nextElementSiblingIE(el.firstChild, true));
        if (element) {
            out.push(element);
            while ((element = element.nextElementSibling || ($$vars.IE8 && nextElementSiblingIE(element)))) {
                out.push(element);
            }
        }
    }
    return out;
};

