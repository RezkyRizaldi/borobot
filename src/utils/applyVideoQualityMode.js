const { VideoQualityMode } = require('discord.js');

/**
 *
 * @param {VideoQualityMode} qualityMode
 * @returns {String} The voice channel video quality mode.
 */
module.exports = (qualityMode) => {
  return {
    [VideoQualityMode.Auto]: 'Auto',
    [VideoQualityMode.Full]: 'Full HD',
  }[qualityMode];
};
