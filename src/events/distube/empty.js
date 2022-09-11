const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.EMPTY,

  /**
   *
   * @param {import('distube').Queue} queue
   */
  async execute(queue) {
    const embed = new EmbedBuilder()
      .setColor(queue.clientMember.displayHexColor)
      .setTimestamp(Date.now())
      .setDescription('Voice channel is empty! Leaving the channel...')
      .setAuthor({
        name: '🚫 Channel Empty',
      })
      .setFooter({
        text: queue.client.user.username,
        iconURL: queue.client.user.displayAvatarURL({ dynamic: true }),
      });

    await queue.textChannel.send({ embeds: [embed] });
  },
};
