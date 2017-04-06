var isString = require('../is/string');
var isArray = require('../is/object/array');
var each = require('../object/each');

var renderAttr = function(key, value, attrs) {
    attrs.push((key === 'classname' ? 'class' : key) + '="' + value + '"');
};

var re_void_tags = /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;

module.exports = function(inner, attrs, tag) {
    tag = tag || 'div';

    var out = [];

    if (isString(attrs)) {
        if (attrs.indexOf('=') < 0) {
            out.push(renderAttr('classname', attrs, out));
        } else {
            out.push(attrs);
        }
    } else if (isArray(attrs)) {
        renderAttr('classname', attrs.join(' '), out);
    } else if (attrs) {
        each(attrs, renderAttr, out);
    }
    return '<' + tag + (out.length ? ' ' : '') + out.join(' ') + '>' + (inner || '') + (re_void_tags.test(tag) ? '' : '</' + tag + '>');
};