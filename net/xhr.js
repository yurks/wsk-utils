var window = require('../dom/window');

var xhrSupported;
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}
var xhrCheck = function() {
    if (xhrSupported == null) {
        xhrSupported = createStandardXHR();
        xhrSupported = !!xhrSupported && ('withCredentials' in xhrSupported);
    }
    return xhrSupported;
};

module.exports = {
    support: xhrCheck,
    create: function() {
        return xhrCheck() && createStandardXHR();
    }

};