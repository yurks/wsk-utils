var document = require('../../document');
var get = require('../get');
var prependEl = require('../prepend');
var createEl = require('../create');
var head = document.head || get('head');

module.exports = function(css, append, className) {
    var style = createEl('style', {type: 'text/css', className: className || ''});
    if (append) {
        prependEl(style, append === true ? head : append);
    }
    if (css) {
        if (style.styleSheet && !style.sheet) {
            style.styleSheet.cssText = css;
        } else {
            style.innerHTML = css;
        }
    }
    return style;
};
