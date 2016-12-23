var create = require('./create');
var render = require('../../var/string/html');
var html = require('./html');
var isString = require('../../var/is/string');

var tmp_div;
module.exports = function(attrs, tag, inner) {
    tmp_div = tmp_div || create();
    html((isString(attrs) && attrs.indexOf('<') > -1) ? attrs : render(inner, attrs, tag), tmp_div);
    return tmp_div.removeChild(tmp_div.firstChild);
};