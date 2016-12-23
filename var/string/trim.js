var nativeTrim = ''.trim;
var re = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var run = (nativeTrim && nativeTrim.call) ? function(str) {
    return str.trim();
} : function(str) {
    return str.replace(re, '');
};
module.exports = function trim(str) {
    return str == null ? '' : run(str + '');
};