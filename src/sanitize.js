var re_replace = /[^\w]+/g;
var cache = {};
var getRegexp = function(delimiter) {
    return (cache[delimiter] = new RegExp('^' + delimiter + '+|' + delimiter + '+$|(' + delimiter + ')+', 'g'));
};

module.exports = function(data, delimiter) {
    delimiter = delimiter || '-';
    return data ? data.toLowerCase().replace(re_replace, delimiter).replace(cache[delimiter]||getRegexp(delimiter), '$1') : '';
};