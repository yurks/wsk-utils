var document = require('../../document');
var get = require('../get');
var prependEl = require('../prepend');
var createEl = require('../create');
var head = document.head || get('head');
var re_isUrl = /.css$/;

module.exports = function(css, append, className) {
    var isRemote = re_isUrl.test(css);
    var attrs = {type: 'text/css', className: className || ''};
    if (isRemote) {
        attrs.rel = 'stylesheet';
    }
    var style = createEl(isRemote ? 'link' : 'style', attrs);
    if (append) {
        prependEl(style, append === true ? head : append);
    }
    if (css && !isRemote) {
        if (style.styleSheet && !style.sheet) {
            style.styleSheet.cssText = css;
        } else {
            style.innerHTML = css;
        }
    }
    return style;
};
