const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.SEARCH_NO_RESULT,

  /**
   *
   * @param {import('discord.js').Message} message
   * @param {String} query
   */
  async execute(message, query) {
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setDescription(`No result found for \`${query}\`!`),
      ],
    });
  },
};
