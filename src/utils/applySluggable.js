/**
 *
 * @param {String} str
 * @returns {String} The slug string
 */
module.exports = (str) =>
  str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
