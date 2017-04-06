var document = require('../../document');
var each = require('../../../var/object/each');

var propFix = {
    'for': 'htmlFor',
    'classname': 'className'
};

module.exports = function(tag, attr, doc) {
    document = doc || document;
    var el = document.createElement(tag || 'div');
    each(attr, function(prop, value) {
        el[propFix[prop] || prop] = value+'';
    });
    return el;
};
