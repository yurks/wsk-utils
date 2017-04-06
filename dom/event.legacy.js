var _root = require('./event');
var all = require('./element/all');
var window = require('./window');
var document = require('./document');

var fieldIsSubmittable = require('./control/submittable');

var ie8fixClearing = function(nodes, handler) {
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i]._ie8fixChg) {
                nodes[i]._ie8fixChg = 0;
                _root.off(nodes[i], 'change', handler);
                _root.off(nodes[i], 'click', handler);
            }
        }
    }
};

var ie8fixesStore = [];
var ie8fixAdd = function(el, event, callback) {
    if (event === 'change' && !fieldIsSubmittable(el)) {
        var ie8fixHandler = function(e) {
            var field = _root.target(e);
            if (fieldIsSubmittable(field) && !field._ie8fixChg) {
                field._ie8fixChg = 1;
                _root.on(field, field.type === 'checkbox' || field.type === 'radio' ? 'click' : 'change', callback);
            }
        };
        _root.on(el, 'beforeactivate', ie8fixHandler);
        ie8fixesStore.push(ie8fixHandler);
        el._ie8fixId = ie8fixesStore.length;

        window.off = function() {
            _root.off(el, event, callback);
        };

    }
};

var ie8fixRemove = function(el, event, callback) {
    if (event === 'change' && !fieldIsSubmittable(el) && el._ie8fixId) {
        var ie8fixHandler = ie8fixesStore[el._ie8fixId-1];
        if (ie8fixHandler) {
            _root.off(el, 'beforeactivate', ie8fixHandler);
            delete ie8fixesStore[el._ie8fixId];
            el._ie8fixId = 0;
            ie8fixClearing(all('input'), callback);
            ie8fixClearing(all('select'), callback);
            ie8fixClearing(all('textarea'), callback);
        }
    }
};

var fixFocusBlurIe = function(event_type) {
    if (event_type === 'focus') {
        return 'focusin';
    }
    if (event_type === 'blur') {
        return 'focusout';
    }
    return event_type;
};

_root._legacyOn = function(el, event, callback) {
    el.attachEvent('on' + fixFocusBlurIe(event), callback);
    ie8fixAdd(el, event, callback);
};

_root._legacyOff = function(el, event, callback) {
    el.detachEvent('on' + fixFocusBlurIe(event), callback);
    ie8fixRemove(el, event, callback);
};

_root._legacyTrigger = function(el, event_name) {
    var event = document.createEventObject();
    el.fireEvent('on' + event_name, event);
};

_root.stop = function(e, stopOnlyBubble) {
    if (!stopOnlyBubble) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
};

module.exports = _root;
