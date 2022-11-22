const { ActivityType, Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);

    return client.user.setActivity('/help', { type: ActivityType.Playing });
  },
};
