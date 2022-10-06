const { GuildDefaultMessageNotifications } = require('discord.js');

/**
 *
 * @param {GuildDefaultMessageNotifications} defaultNotifications
 * @returns {String} The guild explicit media content filter.
 */
module.exports = (defaultNotifications) => {
  return {
    [GuildDefaultMessageNotifications.AllMessages]: 'All Messages',
    [GuildDefaultMessageNotifications.OnlyMentions]: 'Only @mentions',
  }[defaultNotifications];
};
