var matches = require('./matches');
var matcher = require('./matcher');
var matcherShim = require('./matcher.shim');

matches.matcher = function(selector, node) {
    var match = matcher(selector, node);
    return match === null ? matcherShim(selector, node) : match;
};
module.exports = matches;
