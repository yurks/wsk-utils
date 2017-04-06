var noop = require('../../var/noop');
var each = require('../../var/object/each');
var html = require('../../var/string/html');
var event = require('../../dom/event');
var removeEl = require('../../dom/element/remove');
var htmlEl = require('../../dom/element/html');
var buildEl = require('../../dom/element/make');
var appendEl = require('../../dom/element/append');
var timer = require('../../var/timer');
var deparam = require('../../uri/deparam');
var isString = require('../../var/is/string');
var quoteattr = require('../../var/string/quoteattr');

var random = require('../../var/string/random');

var window = require('../../dom/window');
var document = require('../../dom/document');//TODO: document.body
var location = require('../../dom/location');

var urlValidate = require('../../uri/validate');

var re_host_replace = /#.*$/;

var oldBrowserIframeAttrs = {name: null, id: null, style: 'width:0;height:0;border:0;padding:0;margin:0;visibility:"hidden"'};
var oldBrowserIframeRender = function() {
    oldBrowserIframeAttrs.name = oldBrowserIframeAttrs.id = 'oldbrowser-' + random();
    return html('<html><body></body></html>', oldBrowserIframeAttrs, 'iframe');
};

var oldBrowserIframeGetTag = function(iframe, tag) {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    return tag ? doc.getElementsByTagName(tag)[0] : doc.body;
};

var escapeAttr = function(data) {
    if (!isString(data)) {
        return encodeURIComponent(data);
    }
    return quoteattr(data);
};

var renderRequestData = function(data) {
    if (data && isString(data)) {
        data = deparam(data);
    }

    var fields = [], name, value;
    each(data, function(i, v) {
        if (isString(i)) {
            name = i;
            value = v;
        } else {
            name = v.name;
            value = v.value;
        }
        fields.push('<input type="hidden" name="' + name + '" value="' + escapeAttr(value) + '">');
    });
    return fields.join('');
};


//based on from jQuery postMessage - v0.5 - 9/11/2009 (http://benalman.com/projects/jquery-postmessage-plugin/)
var postMessageDestroy, postMessageReceive;
(function() {

    var interval_id;
    var queue = {};
    var queueEmpty = function() {
        var i;
        for (i in queue) {
            if (queue.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };

    postMessageDestroy = function(id) {
        var context = queue[id];
        delete(queue[id]);

        if (window.postMessage) {
            if (context && context._message_cb) {
                event.off(window, 'message', context._message_cb);
            }

        } else if (queueEmpty() && interval_id) {
            timer.clear(interval_id);
            interval_id = null;
        }
    };


    var re_loc_hash = /^#?([^&]*)&*(.*)?/;

    postMessageReceive = function(callback, context, delay) {
        if (!callback) {
            return;
        }

        queue[context.id] = context;

        if (window.postMessage) {
            // Since the browser supports window.postMessage, the callback will be
            // bound to the actual event associated with window.postMessage.

            context._message_cb = function(e) {
                var data = deparam(decodeURIComponent(e.data), true);

                if (data.oldBrowserId !== context.id) {
                    return false;
                }

                postMessageDestroy(context.id);

                var urlParts = urlValidate.re.exec(context.url);
                var originParts = urlValidate.re.exec(e.origin);
                if (urlParts[2] && urlParts[2] === (originParts[2] || e.domain)) { // e.domain - fallback for opera 9.6x
                    callback(data, context);
                }
            };

            event.on(window, 'message', context._message_cb);

        } else {
            // Since the browser sucks, a polling loop will be started, and the
            // callback will be called whenever the location.hash changes.

            if (!interval_id) {
                interval_id = timer.set(function() {

                    var match = location.hash.match(re_loc_hash);
                    var id = match[1], data = match[2];

                    if (!id || !queue[id]) {
                        return;
                    }

                    data = data ? deparam(decodeURIComponent(data), true) : {};

                    if (data.oldBrowserId === id) {
                        callback(data, queue[id]);
                        postMessageDestroy(id);
                    }
                }, ~~delay || 50, true);
            }
        }
    };
})();


module.exports = function(url, callback, request_data, type, opts) {
    var timeout = ~~(opts && opts.timeout);
    callback = callback || noop;

    var context = {received: false, url: url, request_data: request_data, callback: callback, id: random(), iframe: undefined, timeout: undefined};

    postMessageReceive(function(data, context) {
        context.received = true;
        context.callback(data);
        timer.set(function() {
            removeEl(context.iframe);
        }, 1);
    }, context);

    var onIframeSubmitted = function(error) {
        var wait = 1;
        if (!isString(error)) {
            wait = 500;
            error = 'postmessage transport error';
        }
        timer.clear(context.timeout);
        event.off(context.iframe, 'load', onIframeCreated);
        event.off(context.iframe, 'load', onIframeSubmitted);
        timer.set(function() {
            if (!context.received) {
                removeEl(context.iframe);
                /*if (context.attempts) {
                 request();
                 return;
                 } */
                postMessageDestroy(context.id);
                context.callback(false, -1, error, false, request);
            }
        }, wait);
    };

    var onIframeCreated = function() {
        event.off(context.iframe, 'load', onIframeCreated);
        var form_action = url + '?isOldBrowser=true&requestHost=wsk-' + encodeURIComponent(location.href.replace(re_host_replace, '') + '#' + context.id);
        var form = html(renderRequestData(context.request_data), {method: 'post', action: form_action}, 'form');
        htmlEl(form, oldBrowserIframeGetTag(context.iframe));

        event.on(context.iframe, 'load', onIframeSubmitted);

        //context.attempts -= 1;
        timer.set(function() {
            var form = oldBrowserIframeGetTag(context.iframe, 'form');
            if (form) {
                form.submit();
            }
        }, 1);
    };

    var request = function() {
        context.iframe = buildEl(oldBrowserIframeRender());
        event.on(context.iframe, 'load', onIframeCreated);
        appendEl(context.iframe, document.body);

        if (timeout) {
            context.timeout = timer.set(function() {
                context.iframe.src = 'about:blank';
                onIframeSubmitted('timeout');
            }, timeout);
        }
    };

    request();

};

