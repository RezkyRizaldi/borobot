const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.NO_RELATED,

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
      .setDescription("Can't find related song to play.")
      .setAuthor({ name: '❌ No Related Song' })
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    return textChannel.send({ embeds: [embed] });
  },
};
