const pluralize = require('pluralize');

/**
 *
 * @param {any[]|Number|String} total
 * @param {String} [data]
 * @returns {String} Total count of a data.
 */
module.exports = (total, data) =>
  `${
    Array.isArray(total)
      ? total.length.toLocaleString()
      : Number(total).toLocaleString()
  }${data ? ` ${pluralize(data, Number(total))}` : ''}`;
