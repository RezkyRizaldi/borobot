const convert = require('color-convert');

/**
 *
 * @param {String} color
 */
module.exports = (color) => {
  return !/^[#]?[0-9A-F]{6}$/i.test(color)
    ? convert.keyword.hex(color)
    : !color.startsWith('#')
    ? `#${color}`
    : color;
};
