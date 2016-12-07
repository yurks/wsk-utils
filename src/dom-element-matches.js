var document = require('./document');
var noMatcher = require('./noop');

if ($$vars.IE8) {
    var ieMatchesSelector = require('./dom-element-matches.ie');
    noMatcher = function(selector) {
        return ieMatchesSelector(selector, this);
    };
}

var getMatcher = function(element) {
    return element.matches ||
            element.webkitMatchesSelector ||
            element.mozMatchesSelector ||
            element.msMatchesSelector ||
            element.oMatchesSelector ||
            noMatcher;
};

module.exports = function matchesSelector(element, selector, boundElement) {
    boundElement = boundElement || document;
    // if we have moved up to the element you bound the event to
    // then we have come too far
    if (element === boundElement) {
        return;
    }

    // if this is a match then we are done!
    if (getMatcher(element).call(element, selector)) {
        return element;
    }

    // if this element did not match but has a parent we should try
    // going up the tree to see if any of the parent elements match
    // for example if you are looking for a click on an <a> tag but there
    // is a <span> inside of the a tag that it is the target,
    // it should still work
    if (element.parentNode) {
        return matchesSelector(element.parentNode, selector, boundElement);
    }
};

