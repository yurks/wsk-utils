module.exports = function(obj, from, array) {
    from = ~~from;
    array = array || [];
    var i = ~~obj.length - (from > 0 ? from : -from),
        len = array.length;
    from = from > 0 ? from : 0;
    // iterate backwards ensuring that length is an UInt32
    i = i + len;
    for (; --i >= len; ) {
        array[i] = obj[i-len+from];
    }
    return array;
};