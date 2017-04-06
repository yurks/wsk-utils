var build = require('./make');
var append = require('./append');

module.exports = function(attrs, parent, tag, inner) {
    var el = build(attrs, tag, inner);
    return parent ? append(el, parent) : el;
};
