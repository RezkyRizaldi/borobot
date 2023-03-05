const chalk = require('chalk');
const { ActivityType, Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param {import('discord.js').Client} client
   */
  execute(client) {
    console.log(
      chalk.green(
        '[success]',
        `Logged in as ${chalk.green.bold(client.user.tag)}!`,
      ),
    );

    return client.user.setActivity('/help', { type: ActivityType.Playing });
  },
};
