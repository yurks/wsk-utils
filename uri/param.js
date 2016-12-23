var isArray = require('../var/is/object/array');
var isObject = require('../var/is/object');
var isFunction = require('../var/is/function');

var r20 = /%20/g;
var rbracket = /\[]$/;

function buildParams(prefix, obj, array_as_scalar, add) {
    var key;
    if (isArray(obj)) {
        // Serialize array item.
        for (key = 0; key < obj.length; key+=1) {
            if ((array_as_scalar && !isObject(obj[key])) || rbracket.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, obj[key]);
            } else {
                // Item is non-scalar (array or object), encode its numeric index.
                buildParams( prefix + '[' + (isObject(obj[key]) ? key : '') + ']', obj[key], array_as_scalar, add );
            }
        }

    } else if (isObject(obj)) {
        // Serialize object item.
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buildParams( prefix + '[' + key + ']', obj[key], array_as_scalar, add );
            }
        }

    } else {
        // Serialize scalar item.
        add(prefix, obj);
    }
}

module.exports = function(a, array_as_scalar, returnPairs) { //TODO: check if returnPairs realy needed
    array_as_scalar = array_as_scalar !== false;
    var prefix,
        s = returnPairs ? {} : [],
        add = function( key, value ) {
            value = isFunction(value) ? value() : (value == null ? '' : value);
            if (returnPairs) {
                s[key] = value;
            } else {
                s.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
        };

    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(a)) {
        // Serialize the form elements
        for (prefix = 0; prefix < a.length; prefix++ ) {
            add(a[prefix].name, a[prefix].value);
        }

    } else if (isObject(a)) {
        for (prefix in a) {
            if (a.hasOwnProperty(prefix)) {
                buildParams(prefix, a[prefix], array_as_scalar, add);
            }
        }
    }

    // Return the resulting serialization
    return returnPairs ? s : s.join('&').replace(r20, '+');
};
