var has = require('./has');

module.exports = function(className, el) {
    if (has(className, el) === false) {
        el.className += ' ' + className;
        return true;
    }
};
