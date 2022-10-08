const { StageInstancePrivacyLevel } = require('discord.js');

/**
 *
 * @param {StageInstancePrivacyLevel} level
 * @returns {String} The stage instance privacy level.
 */
module.exports = (level) => {
  return {
    [StageInstancePrivacyLevel.Public]: 'Public',
    [StageInstancePrivacyLevel.GuildOnly]: 'Server Only',
  }[level];
};
