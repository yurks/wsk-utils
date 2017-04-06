var document = require('../../document');
var get = require('../get');
var appendEl = require('../append');
var createEl = require('../create');
var isString = require('../../../var/is/string');
var body = document.body || get('body');

module.exports = function(src, append) {
    var attrs;
    if (isString(src)) {
        attrs = {};
        attrs.src = src;
    } else if (src) {
        attrs = src;
    } else {
        attrs = {};
    }
    attrs.type = 'text/javascript';
    attrs.async = attrs.async == null ? true : attrs.async;

    var script = createEl('script', attrs);
    if (append) {
        appendEl(script, append === true ? body : append);
    }

    return script;
};
