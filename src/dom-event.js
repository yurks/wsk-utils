var document = require('./document');
var dom = require('./dom');
var window = require('./window');



var isW3C = !(document.attachEvent && !document.addEventListener);


if ($$vars.IE8) {
    var fieldIsSubmittable = require('./dom-field-submittable');

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
                _root.off(el, event, callback)
            }

        }
    };

    var ie8fixRemove = function(el, event, callback) {
        if (event === 'change' && !fieldIsSubmittable(el) && el._ie8fixId) {
            var ie8fixHandler = ie8fixesStore[el._ie8fixId-1];
            if (ie8fixHandler) {
                _root.off(el, 'beforeactivate', ie8fixHandler);
                delete ie8fixesStore[el._ie8fixId];
                el._ie8fixId = 0;
                ie8fixClearing(dom.getAll('input'), callback);
                ie8fixClearing(dom.getAll('select'), callback);
                ie8fixClearing(dom.getAll('texarea'), callback);
            }
        }
    };

    var fixFocusBlurIe = function(event_type) {
        if (event_type === 'focus') {
            return 'focusin';
        }
        if (event_type == 'blur') {
            return 'focusout';
        }
        return event_type;
    };
}


// blur and focus do not bubble up but if you use event capturing
// then you will get them
var fixFocusBlur = function(event_type) {
    return event_type === 'blur' || event_type === 'focus';
};

var _root = {
    on: function(el, event, callback) {
        if (el) {
            if (isW3C) {
                el.addEventListener(event, callback, fixFocusBlur(event));
            } else if ($$vars.IE8) {
                el.attachEvent('on' + fixFocusBlurIe(event), callback);
                ie8fixAdd(el, event, callback);
            }
        }
    },
    off: function(el, event, callback) {
        if (el) {
            if (isW3C) {
                el.removeEventListener(event, callback, fixFocusBlur(event));
            } else if ($$vars.IE8) {
                el.detachEvent('on' + fixFocusBlurIe(event), callback);
                ie8fixRemove(el, event, callback);
            }
        }
    },

    stop: function(e, stopOnlyBubble) {
        if ($$vars.IE8) {
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
        } else {
            if (!stopOnlyBubble) {
                e.preventDefault();
            }
            e.stopPropagation();
        }
    },

    target: function(e) {
        var target = e.target || e.srcElement;
        // defeat Safari bug
        if (target && target.nodeType == 3) {
            target = target.parentNode;
        }
        return target;
    },

    trigger: function(el, event_name, bubbles, cancelable) {
        var event;
        if (el) {
            try {
                event = new Event(event_name, {'bubbles': !bubbles, 'cancelable': !cancelable});
            } catch (e) {
                try {
                    event = document.createEvent('Event');
                    event.initEvent(event_name, !bubbles, !cancelable);
                } catch (e) {}
            }
            if (event) {
                el.dispatchEvent(event);
            } else if ($$vars.IE8) {
                event = document.createEventObject();
                el.fireEvent('on' + event_name, event);
            }
        }
    }
};

module.exports = _root;
