var window = require('./window');

module.exports = function(url, interval) {
    var started = false;

    var onOpen = function(e) {
        _root.connection = e.target;
        _root.isConnected = true;
    }

    var onClose = function() {
        _root.connection = null;
        _root.isConnected = false;
        if (started) {
            setTimeout(connect, interval || 5000);
        }
    }

    var connect = function() {
        var ws = new WebSocket(url);
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = _root.onmessage;
        ws.onerror = _root.onerror;
    }

    var _root = {
        connection: null,
        isConnected: false,
        supported: 'WebSocket' in window,
        open: function() {
            if (started) {
                return;
            }
            connect();
            started = true;
        },
        close: function() {
            started = false;
            if (_root.connection) {
                _root.connection.close();
            }
        }
    };

    if (_root.supported) {
        _root.open();
    }

    return _root;
};
