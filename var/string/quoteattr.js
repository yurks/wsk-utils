var re_amp = /&(?!(?:[a-z][a-z\d]*|#(?:\d+|x[a-f\d]+));)/ig;
var re_quot = /"/g;
var re_lt = /</g;
var re_gt = />/g;
//var re_cr1 = /\r\n/g;
//var re_cr2 = /[\r\n]/g;
var isString = require('../is/string');
module.exports = function(s) {
    //preserveCR = preserveCR ? '&#13;' : '\n';
    return !isString(s) ? (~~s === s ? s + '' : '') : !s ? '' : s /* Forces the conversion to string. */
        .replace(re_amp, '&amp;') /* This MUST be the 1st replacement. */
        // .replace(/'/g, '&apos;') // ie don't understand &apos;, we should use &#39; instead. But it's not needed for us until _data_ wrapped by double quotes
        .replace(re_quot, '&quot;')
        .replace(re_lt, '&lt;')
        .replace(re_gt, '&gt;')
        //.replace(re_cr1, preserveCR) /* Must be before the next replacement. */
        //.replace(re_cr2, preserveCR)
    ;
};