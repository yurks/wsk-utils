var document = require('../document');

var matchesSelector = function(element, selector, boundElement) {
    boundElement = boundElement || document;
    // if we have moved up to the element you bound the event to
    // then we have come too far
    if (element === boundElement) {
        return;
    }

    // if this is a match then we are done!
    if (matchesSelector.matcher(selector, element)) {
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
matchesSelector.matcher = require('./matcher');

module.exports = matchesSelector;
