const pluralize = require('pluralize');

/**
 *
 * @param {Number} time
 * @returns {String} The AFK timeout duration.
 */
module.exports = (time) =>
  time < 3600
    ? pluralize('minute', time / 60, true)
    : pluralize('hour', time / 3600, true);
