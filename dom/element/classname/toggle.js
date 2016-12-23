var add = require('./add');
var remove = require('./remove');

module.exports = function(className, el, condition) {
    if (el && className) {
        return condition ? add(className, el) : remove(className, el) === true ? false : void 0;
    }
};