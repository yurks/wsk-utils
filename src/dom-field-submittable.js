var rsubmittable = /^(?:input|select|textarea|keygen)/i;
module.exports = function(el) {
    return !!(el && rsubmittable.test(el.nodeName));
};
