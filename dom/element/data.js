var re_camelcase = /\-(\w)/g;

function cb_replace_toCamelCase(matches, letter) {
    return letter.toUpperCase();
}

function toCamelCase(str) {
    return str.replace(re_camelcase, cb_replace_toCamelCase);
}

module.exports = function(prop, node) {
    return node && (node.dataset ? node.dataset[toCamelCase(prop)] : node.getAttribute('data-' + prop)) || '';
};