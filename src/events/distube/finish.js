const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.FINISH,

  /**
   *
   * @param {import('distube').Queue} queue
   */
  async execute(queue) {
    const { client, clientMember, textChannel } = queue;

    if (!clientMember || !textChannel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: '⏹️ Queue Finished' })
      .setColor(clientMember.displayHexColor)
      .setTimestamp(Date.now())
      .setDescription('The queue has been finished.')
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    await textChannel.send({ embeds: [embed] });
  },
};
