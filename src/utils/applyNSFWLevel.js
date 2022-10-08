const { GuildNSFWLevel } = require('discord.js');

/**
 *
 * @param {GuildNSFWLevel} level
 * @returns {String} The NSFW level.
 */
module.exports = (level) => {
  return {
    [GuildNSFWLevel.Default]: 'No restrictions',
    [GuildNSFWLevel.Explicit]: 'Explicit',
    [GuildNSFWLevel.Safe]: 'Safe',
    [GuildNSFWLevel.AgeRestricted]: 'Age restricted',
  }[level];
};
