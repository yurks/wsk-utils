var location = require('../dom/location');
var document = require('../dom/document');
var urlValidate = require('./validate');

var ajaxLocation;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
    ajaxLocation = location.href;
} catch (e) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement("a");
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
}

var re_url = urlValidate.re;
// Segment location into parts
var ajaxLocParts = re_url.exec(ajaxLocation.toLowerCase()) || [];

module.exports = function(url) {
    var parts = re_url.exec(url.toLowerCase());
    return !!( parts && //
        ( (parts[ 1 ] || ajaxLocParts[ 1 ]) != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] || //
        ( parts[ 3 ] || ((parts[ 1 ] || ajaxLocParts[ 1 ]) === "http:" ? 80 : 443 ) ) != //
        ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) ) //
    );
};
