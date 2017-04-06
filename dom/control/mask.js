var window = require('../window');
var document = require('../document');
var isString = require('../../var/is/string');
var random = require('../../var/string/random');
var timer = require('../../var/timer');
var event = require('../event');

//caret positioning
var fieldCaret = require('./caret');

var mask_patterns = {
    '9': /[0-9]/,
    'a': /[A-Za-z]/,
    '*': /[A-Za-z0-9]/
};

var val = function(el, value) {
    return value == null ? el.value || '' : (el.value = value);
};

var userAgent = window.navigator.userAgent;
var isIphone = /iphone/i.test(userAgent);
var isAndroid = (function() {
    var android = /android/i.test(userAgent);
    //TODO: test and remove?
    if (android) {
        var browser = userAgent.match(/mobile safari.*/i);
        var version = ~~(/[0-9]+/.exec(browser+''));
        android = version > 0 && version <= 533;
    }
    return android;
})();



var storage = {};
var storageAttr = 'data-field-mask-id';
var getStorage = function(input, andRemove) {
    if (input && input.getAttribute) {
        var id = input.getAttribute(storageAttr);
        var data = storage[id];
        if (andRemove) {
            storage[id] = null;
            delete storage[id];
            input.setAttribute(storageAttr, '');
        }
        return data;
    }
};
var setStorage = function(input, data) {
    var id = random();
    input.setAttribute(storageAttr, id);
    storage[id] = data;
};

var _empty = {};

/**
 * @param input
 * @param settings
 * @param settings.mask
 * @param settings.placeholder
 * @param settings.completed
 * @param settings.patterns
 * @param settings.onchanged
 */
var Mask = function(input, settings) {
    if (!(settings && input && input.nodeType && input.tagName === 'INPUT' && input.type === 'text')) {
        return;
    }

    var mainMask;
    if (isString(settings)) {
        mainMask = settings;
        settings = _empty;
    } else {
        mainMask = settings.mask;
    }

    if (!mainMask || !isString(mainMask)) {
        return;
    }
    _root.unmask(input);

    var placeholder = settings.placeholder || '_';
    var completedCallback = settings.completed;
    var patterns = settings.patterns || mask_patterns;
    var onChanged = settings.onchanged;


    var tests = [];
    var firstNonMaskPos = null;
    var partialPosition = mainMask.length;
    var len = mainMask.length;
    var caretTimeoutId;

    var maskDefaultChar = '?';

    var i, _mask = mainMask.split('');
    for (i = 0; i < _mask.length; i++) {
        if (_mask[i] === maskDefaultChar) {
            len -= 1;
            partialPosition = i;
        } else if (patterns[_mask[i]]) {
            tests.push(patterns[_mask[i]]);
            if (firstNonMaskPos === null) {
                firstNonMaskPos = tests.length - 1;
            }
        } else {
            tests.push(null);
        }
    }


    var _buffer = mainMask.split(''),
        buffer = [],
        focusText = val(input);

    for (i = _buffer.length; i--;) {
        if (_buffer[i] !== maskDefaultChar) {
            buffer[i] = patterns[_buffer[i]] ? placeholder : _buffer[i];
        }
    }

    function seekNext(pos) {
        while (++pos < len && !tests[pos]) {}
        return pos;
    }

    function seekPrev(pos) {
        while (--pos >= 0 && !tests[pos]) {}
        return pos;
    }

    function shiftL(begin, end) {
        var i, j;
        if (begin < 0) {
            return;
        }
        for (i = begin, j = seekNext(end); i < len; i += 1) {
            if (tests[i]) {
                if (j < len && tests[i].test(buffer[j])) {
                    buffer[i] = buffer[j];
                    buffer[j] = placeholder;
                } else {
                    break;
                }
                j = seekNext(j);
            }
        }
        writeBuffer();
        fieldCaret(input, Math.max(firstNonMaskPos, begin));
    }

    function shiftR(pos) {
        var i, c, j, t;
        for (i = pos, c = placeholder; i < len; i += 1) {
            if (tests[i]) {
                j = seekNext(i);
                t = buffer[i];
                buffer[i] = c;
                if (j < len && tests[j].test(t)) {
                    c = t;
                } else {
                    break;
                }
            }
        }
    }


    function clearBuffer(start, end) {
        var i;
        for (i = start; i < end && i < len; i += 1) {
            if (tests[i]) {
                buffer[i] = placeholder;
            }
        }
    }

    function writeBuffer() {
        val(input, buffer.join(''));
    }

    function checkVal(allow) {
        //try to place characters where they belong
        var test = val(input),
            lastMatch = -1,
            i, c, pos;
        for (i = 0, pos = 0; i < len; i += 1) {
            if (tests[i]) {
                buffer[i] = placeholder;
                while (pos++ < test.length) {
                    c = test.charAt(pos-1);
                    if (tests[i].test(c)) {
                        buffer[i] = c;
                        lastMatch = i;
                        break;
                    }
                }
                if (pos > test.length) {
                    clearBuffer(i + 1, len); // added from newer version
                    break;
                }
            } else {
                if (buffer[i] === test.charAt(pos)) {
                    pos++;
                }
                if( i < partialPosition){
                    lastMatch = i;
                }
            }
        }
        if (allow) {
            writeBuffer();
        } else if (lastMatch + 1 < partialPosition) {
            val(input, '');
            clearBuffer(0, len);
        } else {
            writeBuffer();
            val(input, val(input).substring(0, lastMatch + 1));
        }

        return (partialPosition ? i : firstNonMaskPos);
    }


    function keydownEvent(e) {
        if (input.readOnly) {
            return;
        }

        var k = e.which || e.keyCode, pos, begin, end;

        //backspace, delete, and escape get special treatment
        if (k === 8 || k === 46 || (isIphone && k === 127)) {
            pos = fieldCaret(input);
            begin = pos.begin;
            end = pos.end;

            if (end - begin === 0) {
                begin = k !== 46 ? seekPrev(begin) : (end = seekNext(begin - 1));
                end = k === 46 ? seekNext(end) : end;
            }
            clearBuffer(begin, end);
            shiftL(begin, end - 1);
            event.stop(e);

        } else if (k === 27) {//escape
            val(input, focusText);
            fieldCaret(input, 0, checkVal());
            event.stop(e);
        }
    }

    function keypressEvent(e) {
        if (input.readOnly) {
            return;
        }

        var k = e.which || e.keyCode, pos = fieldCaret(input), p, c, next;

        if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
        } else if (k) {
            if (pos.end - pos.begin !== 0) {
                clearBuffer(pos.begin, pos.end);
                shiftL(pos.begin, pos.end - 1);
            }

            p = seekNext(pos.begin - 1);
            if (p < len) {
                c = String.fromCharCode(k);
                if (tests[p].test(c)) {
                    shiftR(p);
                    buffer[p] = c;
                    writeBuffer();
                    next = seekNext(p);

                    if (isAndroid) {
                        //Path for CSP Violation on FireFox OS 1.1
                        var proxy = function() {
                            fieldCaret(input, next);
                        };
                        timer.set(proxy, 0);
                    } else {
                        fieldCaret(input, next);
                    }
                    if (completedCallback && next >= len) {
                        completedCallback.call(input);
                    }
                }
            }
            event.stop(e);
        }
    }

    var onFocus = function() {
        if (input.readOnly) {
            return;
        }
        timer.clear(caretTimeoutId);
        focusText = val(input);
        var pos = checkVal();

        caretTimeoutId = timer.set(function() {
            if (input !== document.activeElement){
                return;
            }
            writeBuffer();
            //fieldCaret(input, (focusText || pos !== mainMask.length) ? pos : 0);
            if (pos === mainMask.replace(maskDefaultChar,'').length) {
                fieldCaret(input, 0, pos);
            } else {
                fieldCaret(input, pos);
            }
        }, 10);
    };

    var checkChanged = function(initial) {
        if (input.readOnly) {
            return;
        }
        checkVal();
        if (val(input) !== focusText && onChanged) {
            onChanged(initial === true, input, val(input), focusText);
        }
    };

    var _onPaste = function() {
        var pos = checkVal(true);
        fieldCaret(input, pos);
        if (completedCallback && pos === val(input).length) {
            completedCallback.call(input);
        }
    };
    var onPaste = function() {
        if (input.readOnly) {
            return;
        }
        timer.set(_onPaste, 0);
    };

    event.on(input, 'focus', onFocus);
    event.on(input, 'blur', checkChanged);
    event.on(input, 'keydown', keydownEvent);
    event.on(input, 'keypress', keypressEvent);
    event.on(input, 'input', onPaste);
    event.on(input, 'paste', onPaste);
    event.on(input, 'change', checkChanged);


    // solution for android (maxlength bug http://code.google.com/p/android/issues/detail?id=35264)
    var maxlength_real = ~~input.maxLength;
    if (maxlength_real) {
        input.removeAttribute('maxLength');
    }

    checkChanged(true);

    var outMethods = {
        unmask: function() {
            if (maxlength_real) {
                input.maxLength = maxlength_real;
            }
            event.off(input, 'focus', onFocus);
            event.off(input, 'blur', checkChanged);
            event.off(input, 'keydown', keydownEvent);
            event.off(input, 'keypress', keypressEvent);
            event.off(input, 'input', onPaste);
            event.off(input, 'paste', onPaste);
            event.off(input, 'change', checkChanged);
        },
        value: function() {
            var out = [];
            for (i = 0; i < buffer.length; i++) {
                if (tests[i] && buffer[i] !== placeholder) {
                    out.push(buffer[i]);
                }
            }
            return out.join('');
        }
    };
    setStorage(input, outMethods);

    return outMethods;

};

var _root = {
    value: function(input) {
        var storageData = getStorage(input);
        if (storageData) {
            return storageData.value();
        }
        return '';
    },
    unmask: function(input) {
        var storageData = getStorage(input, true);
        if (storageData) {
            storageData.unmask();
        }
    },
    mask: function(inputs, settings) {
        var i = 0;
        if (inputs) {
            if (inputs.length) {
                while (inputs[i++]) {
                    Mask(inputs[i-1], settings);
                }
            } else {
                Mask(inputs, settings);
            }
        }
    },

    apply: function(val, msk, tests) {
        tests = tests || mask_patterns;
        var value = val && (val += '') && val.split('');
        var mask = msk && (msk += '') && msk.split('');

        if (value && value.length && mask && mask.length && tests) {
            var out = '';

            /*
             // "true" masking: do not skip non-matched value chars. Good, but bad for field masking
             var value_contains_mask = false;
             var ok = $global.each(mask, function(i, c) {
             // if c is masking char
             if (tests[c]) {
             // then value[i] should pass the pattern test
             if (tests[c].test(value[0])) {
             out += value.shift();
             } else {
             return false;//break
             }
             // if c is NOT masking char
             } else {
             // then value[i] should be equal to mask char
             if (value[0] === c) {
             value_contains_mask = true;
             out += value.shift();
             } else {
             out += c;
             if (value_contains_mask) {
             return false; //break
             }
             }
             }
             });

             console.log('applyMask', ok, value, mask, out);

             // mask applied unsuccessfully
             if (ok !== false && !value.length) {
             return out;
             }
             return val;
             */


            var i = 0, m;
            for (; i < value.length; i++) {
                while ((m = mask[0])) {
                    // console.log(i, m, v, out);
                    out += tests[m] && tests[m].test(value[i]) ? mask.shift() && value[i] : tests[m] ? '' : mask.shift();
                    if (tests[m]) {
                        break;
                    }
                }
                // if no mask chars remaining
                if (!m) {
                    break;
                }
            }

            //console.log('applyMask', value, mask, out);
            if (!mask.length) {
                return out;
            }
        }
        return '';
    }
};

module.exports = _root;
