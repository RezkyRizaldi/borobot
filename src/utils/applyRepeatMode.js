const { RepeatMode } = require('distube');

/**
 *
 * @param {import('distube').RepeatMode} repeatMode
 * @returns {String} Current applied repeat mode.
 */
module.exports = (repeatMode) => {
  return {
    [RepeatMode.DISABLED]: 'Off',
    [RepeatMode.SONG]: 'Song',
    [RepeatMode.QUEUE]: 'Queue',
  }[repeatMode];
};
