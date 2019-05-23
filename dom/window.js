/**
 @type {Window}
 @const
 */
module.exports = (typeof window !== 'undefined' ? window : null) || (typeof $$vars !== 'undefined' && $$vars.window) || this || {}; // jshint ignore:line
