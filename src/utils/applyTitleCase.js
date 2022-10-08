/**
 *
 * @param {String} string
 * @returns {String} The titlecased string.
 */
module.exports = (string) =>
  string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
