var document = require('./document');
var isNumber = require('./isNumber');

module.exports = function(input, begin, end) {
    var range;
    if (!input) {
        return;
    }
    if (isNumber(begin)) {
        end = isNumber(end) ? end : begin;
        if (input.setSelectionRange) {
            input.setSelectionRange(begin, end);
        } else if (input.createTextRange) {
            range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', begin);
            range.select();
        }
    } else {
        if (input.setSelectionRange) {
            begin = input.selectionStart;
            end = input.selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            begin = -range.duplicate().moveStart('character', -100000);
            end = begin + range.text.length;
        }
        return { begin: begin, end: end };
    }
};
