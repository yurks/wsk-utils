var dom = require('./dom');
var document = require('./document');
var head = document.head || dom.get('head');

module.exports = function(css, append, className) {
    var style = dom.createNode('style', {type: 'text/css', className: className || ''});
    if (append) {
        dom.prepend(style, append === true ? head : append);
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