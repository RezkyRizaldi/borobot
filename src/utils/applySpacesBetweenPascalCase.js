/**
 *
 * @param {String} string
 * @returns {String} The Pascal Case string with spaces in between.
 */
module.exports = (string) =>
  string
    .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
    // Look for lower-case letters followed by upper-case letters
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    // Look for lower-case letters followed by numbers
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase())
    // Remove any white space left around the word
    .trim();
