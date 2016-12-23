module.exports = function(callback) {
    var _root = {
        _data: {},
        _stored: false,
        get: function(reinit) {
            if (!(reinit || false) && _root._stored) {
                return _root._data;
            }
            _root._stored = true;
            _root._data = callback();
            return _root._data;
        }
    };
    return _root;
};
