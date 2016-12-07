module.exports = function(obj, from) {
    from = ~~from;
    var array = [];
    var i = ~~obj.length - (from > 0 ? from : -from);
    from = from > 0 ? from : 0;
    // iterate backwards ensuring that length is an UInt32
    for (; i-- >= 0; ) {
        array[i] = obj[i+from];
    }
    return array;
};