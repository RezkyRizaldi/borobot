const convert = require('color-convert');

/**
 *
 * @param {String} color
 * @returns {String} The hex color code.
 */
module.exports = (color) =>
  !/^[#]?[0-9A-F]{6}$/i.test(color)
    ? convert.keyword.hex(color)
    : !color.startsWith('#')
    ? `#${color}`
    : color;
