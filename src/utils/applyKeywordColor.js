const { capitalCase } = require('change-case');
const convert = require('color-convert');

/**
 *
 * @param {String} hex
 * @returns {String} The keyword color.
 */
module.exports = (hex) => `${capitalCase(convert.hex.keyword(hex))} (${hex})`;
