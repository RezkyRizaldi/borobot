const { EmbedBuilder, inlineCode } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.ADD_SONG,

  /**
   *
   * @param {import('distube').Queue} queue
   * @param {import('distube').Song} song
   */
  async execute(queue, song) {
    const embed = new EmbedBuilder()
      .setColor(queue.clientMember.displayHexColor)
      .setTimestamp(Date.now())
      .setDescription(
        `${inlineCode(song.name)} has been added to the queue by ${song.user}.`,
      )
      .setAuthor({
        name: '🔃 Queue Added',
      })
      .setFooter({
        text: queue.client.user.username,
        iconURL: queue.client.user.displayAvatarURL({ dynamic: true }),
      });

    await queue.textChannel.send({ embeds: [embed] });
  },
};
