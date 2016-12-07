var dom = require('./dom');
var document = require('./document');
var isString = require('./isString');
var body = document.body || dom.get('body');

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

    var script = dom.createNode('script', attrs);
    if (append) {
        dom.append(script, append === true ? body : append);
    }

    return script;
};