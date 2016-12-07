var isString = require('./isString');

var _root = module.exports = {
    has: function(className, el) {
        if (el && className) {
            return (' ' + el.className + ' ').indexOf(' ' + className + ' ') !== -1;
        }
    },

    add: function(className, el) {
        if (_root.has(className, el) === false) {
            el.className += ' ' + className;
            return true;
        }
    },

    remove: function(className, el) {
        var removed = false, elClass;
        if (el && className) {
            if (isString(className)) {
                elClass = ' ' + el.className + ' ';
                className = ' ' + className + ' ';
                while (elClass.indexOf(className) !== -1) {
                    removed = true;
                    elClass = elClass.replace(className, ' ');
                }
                el.className = elClass.slice(1, -1);
            } else {
                className = el.className.match(className);
                while (className && className.length) {
                    removed = _root.remove(className.pop(), el) || removed;
                }
            }
        }
        return removed;
    },

    toggle: function(className, el, condition) {
        if (el && className) {
            return condition ? _root.add(className, el) : _root.remove(className, el) === true ? false : undefined;
        }
    }
};