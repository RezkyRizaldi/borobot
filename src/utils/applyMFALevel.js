const { GuildMFALevel } = require('discord.js');

/**
 *
 * @param {GuildMFALevel} level
 * @returns {String} The MFA level.
 */
module.exports = (level) => {
  return {
    [GuildMFALevel.None]: 'None',
    [GuildMFALevel.Elevated]: 'Elevated',
  }[level];
};
