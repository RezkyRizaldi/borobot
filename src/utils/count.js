const pluralize = require('pluralize');

/**
 *
 * @param {{ total: Number|String, data: String }}
 * @returns {String} Total count of a data.
 */
module.exports = ({ total, data }) =>
  `${Number(total).toLocaleString()} ${pluralize(data, Number(total))}`;
