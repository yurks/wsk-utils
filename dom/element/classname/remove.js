var isString = require('../../../var/is/string');

var remove = module.exports = function(className, el) {
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
                removed = remove(className.pop(), el) || removed;
            }
        }
    }
    return removed;
};
