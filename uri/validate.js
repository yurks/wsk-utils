//regexp for validating urls (based on jQuery 1.7.1)
var url_regexp = /^([\w.+-]+:|)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;

module.exports = {
    re: url_regexp
};
