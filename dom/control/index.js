var isString = require('../../var/is/string');
var fieldIsSubmittable = require('./submittable');

var rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i;
var rreturn = /\r/g;

var isValue = function (el, withDisabled) {
    return !!el && el.name && (!withDisabled || el.disabled !== true) &&
        fieldIsSubmittable(el) && !rsubmitterTypes.test(el.type) &&
        (el.checked || (el.type !== 'checkbox' && el.type !== 'radio'));
};

var getControlActualNode = function(el) {
    if (el && el.nodeName && el.nodeName.toLowerCase() === 'select') {
        return el.options[el.selectedIndex];
    } else {
        return el;
    }
};
var getControlValue = function(el) {
    var val;
    el = getControlActualNode(el);
    if (el) {
        val = el.value;
    }
    return isString(val) ?
        // handle most common string cases
        val.replace(rreturn, '') :
        // handle cases where value is null/undef or number
        val == null ? '' : val+'';
};

var compareTagName = function(el, tag) {
    return !!el.nodeName && el.nodeName === tag.toUpperCase();
};

var re_not_a_textbox_tags = /(?:button|checkbox|hidden|radio|reset|submit)/i;
module.exports = {
    is: function(type, el) {
        if (!el || !el.nodeName) {
            return false;
        }
        if (type === 'select') {
            return compareTagName(el, 'option') || compareTagName(el, type);
        }
        if (type === 'textarea') {
            return compareTagName(el, type);
        }
        return el.type === type;
    },
    isTextBox: function(el) {
        return compareTagName(el, 'input') && !(el.type && re_not_a_textbox_tags.test(el.type)) || compareTagName(el, 'textarea');
    },
    filter: function(el, withDisabled) {
        return isValue(el, withDisabled) && getControlActualNode(el) || null;
    },
    isValue: isValue,
    val: getControlValue
};
