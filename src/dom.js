var document = require('./document');
var each = require('./each');
var isString = require('./isString');
var isArray = require('./isArray');
var toArray = require('./toArray');
if ($$vars.IE8) {
    var _domQuerySelectorIE = require('./dom-element-query.ie');
    var domQuerySelectorIE = function(node, selector) {
        return _domQuerySelectorIE.call(node, selector);
    };
}

var re_camelcase = /\-(\w)/g;

function toCamelCase(str) {
    return str.replace(re_camelcase, function(matches, letter) {
        return letter.toUpperCase();
    });
}

var tmp_div;
var propFix = {
    'for': 'htmlFor',
    'classname': 'className'
};

var isQuerySelectorAll = !!document.querySelectorAll;

var re_isIdSelector = /^#[^\s\.\[]+$/;
var re_isTagSelector = /^[^\s\.\[#]+$/;

var getNodes = function(selector, node, _single) {
    node = node || document;
    if (re_isIdSelector.test(selector)) {
        node = document.getElementById(selector.slice(1));
        if (_single) {
            return node;
        } else {
            return node ? [] : [node];
        }
    } else if (re_isTagSelector.test(selector)) {
        node = node.getElementsByTagName(selector);
    } else if (isQuerySelectorAll) {
        node = node.querySelectorAll(selector);
    } else {
        if ($$vars.IE8) {
            node = domQuerySelectorIE(node, selector);
        } else {
            node = [];
        }
        if (!_single) {
            return node;
        }
    }
    return _single ? node[0] : toArray(node);
};

var _root = {
    getData: function(prop, node) {
        return node && (node.dataset ? node.dataset[toCamelCase(prop)] : node.getAttribute('data-' + prop)) || '';
    },

    // only simple selectors like #id, .classname, tag
    get: function(selector, node) {
        if (selector) {
            if (!isString(selector)) {
                if (_root.isNode(selector)) {
                    return selector;
                } else if (selector.length && selector[0] && _root.isNode(selector[0])) {
                    return selector[0];
                }
            } else {
                return getNodes(selector, node, true);
            }
        }
        return null;
    },

    getParent: function(node) {
        var parent = node && node.parentNode;
        //IE(
        return parent && parent.nodeType !== 11 ? parent : null;
    },

    getAll: function(selector, node) {
        return selector && isString(selector) && getNodes(selector, node) || [];
    },

    append: function(el, node) {
        return node && node.appendChild(el);
    },

    prepend: function(el, node) {
        return node && node.insertBefore(el, node.firstChild);
    },

    after: function(el, node) {
        if (node.parentNode) {
            node.parentNode.insertBefore( el, node.nextSibling );
        }
    },

    add: function(attrs, parent, tag, inner) {
        var el = _root.create(attrs, tag, inner);
        return parent ? _root.append(el, parent) : el;
    },

    create: function(attrs, tag, inner) {
        tmp_div = tmp_div || _root.createNode();
        _root.html((isString(attrs) && attrs.indexOf('<') > -1) ? attrs : _root.render(inner, attrs, tag), tmp_div);
        return tmp_div.removeChild(tmp_div.firstChild);
    },

    createNode: function(tag, attr, doc) {
        document = doc || document;
        var el = document.createElement(tag || 'div');
        each(attr, function(prop, value) {
            el[propFix[prop] || prop] =  value+'';
        });
        return el;
    },

    remove: function(node) {
        if (node && node.parentNode) {
            //TODO: destroy in IE somehow..
            return node.parentNode.removeChild(node);
        }
    },

    replace: function(newnode, node) {
        if (newnode && node && node.parentNode) {
            if (!newnode.nodeType) {
                newnode = _root.create(newnode);
            }
            node.parentNode.replaceChild(newnode, node);
        }
    },

    isNode: function(node) {
        return !!(node && node.nodeType);
    },

    render: function(inner, attrs, tag) {
        tag = tag || 'div';

        var attr = '';
        function renderAttr(key, value) {
            attr += ' ' + (key === 'classname' ? 'class' : key) + '="' + value + '"';
        }

        if (isString(attrs)) {
            if (attrs.indexOf('=') < 0) {
                renderAttr('classname', attrs);
            } else {
                attr += ' ' + attrs;
            }
        } else if (isArray(attrs)) {
            renderAttr('classname', attrs.join(' '));
        } else if (attrs) {
            each(attrs, renderAttr);
        }
        return '<' + tag + attr + '>' + (inner || '') + (tag !== 'input' && tag !== 'img' ? '</' + tag + '>' : '');
    },

    html: function html(text, node) {
        if (arguments.length === 1 && text) {
            return text.innerHTML;
        } else if (node) {
            node.innerHTML = text;
        }
    }
};

module.exports = _root;

