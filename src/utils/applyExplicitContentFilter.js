const { GuildExplicitContentFilter } = require('discord.js');

/**
 *
 * @param {GuildExplicitContentFilter} contentFilter
 * @returns {String} The guild explicit media content filter.
 */
module.exports = (contentFilter) => {
  return {
    [GuildExplicitContentFilter.Disabled]: "Don't scan any media content",
    [GuildExplicitContentFilter.MembersWithoutRoles]:
      'Scan media content from members without a role',
    [GuildExplicitContentFilter.AllMembers]:
      'Scan media content from all members',
  }[contentFilter];
};
