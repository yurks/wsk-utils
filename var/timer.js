var _root = {
    set: function(cb, delay, isInterval) {
        return (isInterval ? setInterval : setTimeout)(cb, delay);
    },
    clear: function(id) {
        clearTimeout(id);
        clearInterval(id);
    }
};

module.exports = _root;
