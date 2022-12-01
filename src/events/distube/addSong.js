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
    const { client, clientMember, textChannel } = queue;

    if (!clientMember || !textChannel) return;

    const embed = new EmbedBuilder()
      .setColor(clientMember.displayHexColor)
      .setTimestamp(Date.now())
      .setDescription(
        `${inlineCode(song.name)} - ${inlineCode(
          song.formattedDuration,
        )} has been added to the queue by ${song.user}.`,
      )
      .setAuthor({ name: '🔃 Queue Added' })
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(song?.thumbnail ?? null);

    await textChannel.send({ embeds: [embed] });
  },
};
