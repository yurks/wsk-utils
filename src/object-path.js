var isObject = require('./isObject');
var isString = require('./isString');

module.exports = function get(object, path, def) {
  if (isObject(object)) {
    if (isString(path)) {
      path = path.split('.');
    }
    if (path.length) {
      var key = path.shift();

      if (path.length) {
        return get(object[key], path, def);
      } else {
        return object[key] || def;
      }
    }
  }
  return def;
};