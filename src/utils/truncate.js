/**
 *
 * @param {?String} str
 * @param {Number} max
 * @param {Number} [trim=3]
 * @returns {String} The truncated string.
 */
module.exports = (str, max, trim = 3) => {
  return str
    ? str.length > max
      ? `${str.slice(0, max - trim)}...`
      : str
    : null;
};
