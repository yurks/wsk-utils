module.exports = function(obj) {
    var name;
    //noinspection LoopStatementThatDoesntLoopJS
    for (name in obj) { // jshint ignore:line
        return false;
    }
    return true;
};
