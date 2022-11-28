const { ActivityType, Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param {import('discord.js').Client} client
   */
  execute(client) {
    return client.user.setActivity('/help', { type: ActivityType.Playing });
  },
};
