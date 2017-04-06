var re_submittable = /^(?:input|select|textarea|keygen)/i;
module.exports = function(el) {
    return !!(el && re_submittable.test(el.nodeName));
};
