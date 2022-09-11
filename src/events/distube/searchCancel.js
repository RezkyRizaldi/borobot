const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.SEARCH_CANCEL,

  /**
   *
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    await message.channel.send({
      embeds: [
        new EmbedBuilder().setColor('Red').setDescription('Searching canceled'),
      ],
    });
  },
};
