module.exports = function(obj) {
    //noinspection LoopStatementThatDoesntLoopJS
    //noinspection JSUnusedLocalSymbols
    for (var name in obj) {
        return false;
    }
    return true;
};
