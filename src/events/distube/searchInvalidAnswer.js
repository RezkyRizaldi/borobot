const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.SEARCH_INVALID_ANSWER,

  /**
   *
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setDescription(
            'Invalid answer! You have to enter the number in the range of the results',
          ),
      ],
    });
  },
};
