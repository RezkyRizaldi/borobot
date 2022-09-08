const { GuildVerificationLevel } = require('discord.js');

/**
 *
 * @param {GuildVerificationLevel} level
 * @returns {String} The guild verification level.
 */
module.exports = (level) => {
  return {
    [GuildVerificationLevel.None]: 'Unrestricted',
    [GuildVerificationLevel.Low]: 'Must have verified email on account',
    [GuildVerificationLevel.Medium]:
      'Must be registered on Discord for longer than 5 minutes',
    [GuildVerificationLevel.High]:
      'Must be a member of the guild for longer than 10 minutes',
    [GuildVerificationLevel.VeryHigh]: 'Must have a verified phone number',
  }[level];
};
