var ieMatchesSelector = require('./dom-element-matches.ie');

var query = function(selector) {
    var i, j, result = [], nodes = this, node, ie7bugIdNameProcessed = [];
    nodes = nodes && nodes.getElementsByTagName('*');

    if (nodes && nodes.length) {
        for (i in nodes) { //i could be a string index
            //noinspection JSUnfilteredForInLoop
            node = nodes[i];
            if (node.length && !node.tagName && !node._ie7fixId) { //a bug with ie7 - when id and name attributes are not the same
                node._ie7fixId = 1;
                ie7bugIdNameProcessed.push(node);
                for (j = 0; j < node.length; j++) {
                    if (node[j]) {
                        if (ieMatchesSelector(selector, node[j])) {
                            result.push(node[j]);
                        }
                    }
                }
            } else if (node.tagName && ieMatchesSelector(selector, node)) {
                result.push(node);
            }
        }
    }
    while (ie7bugIdNameProcessed.length) {
        ie7bugIdNameProcessed.pop()._ie7fixId = 0;
    }
    if (result.length) {
        return result;
    }
    return [];
};
module.exports = query;
