module.exports = function(className, el) {
    if (el && className) {
        return (' ' + el.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }
};