var document = require('./document');

var isW3C = !(document.attachEvent && !document.addEventListener);


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
            } else if (_root._legacyOn) {
                _root._legacyOn(el, event, callback);
            }
        }
    },
    off: function(el, event, callback) {
        if (el) {
            if (isW3C) {
                el.removeEventListener(event, callback, fixFocusBlur(event));
            } else if (_root._legacyOff) {
                _root._legacyOff(el, event, callback);
            }
        }
    },

    stop: function(e, stopOnlyBubble) {
        if (!stopOnlyBubble) {
            e.preventDefault();
        }
        e.stopPropagation();
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
            } else if (_root._legacyTrigger) {
                _root._legacyTrigger(el, event_name, bubbles, cancelable);
            }
        }
    }
};

module.exports = _root;
