const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.DELETE_QUEUE,

  /**
   *
   * @param {import('distube').Queue} queue
   */
  async execute(queue) {
    const { client, clientMember, textChannel } = queue;

    if (!clientMember || !textChannel) return;

    const embed = new EmbedBuilder()
      .setColor(clientMember.displayHexColor)
      .setTimestamp(Date.now())
      .setDescription('The queue has been stopped.')
      .setAuthor({ name: '⏹️ Queue Stopped' })
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    return textChannel.send({ embeds: [embed] });
  },
};
