//chars for generating random string
var randomize = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'.split('');

//$global.randomId based on https://github.com/aaronblohowiak/Random-ID
module.exports = function(len, radix) {
    var i = 0;
    var out = '';
    radix = radix || randomize.length;
    len = len || 13;

    for (; i < len; i += 1) {
        out += randomize[~~(Math.random() * radix)];
    }

    return out;
};
