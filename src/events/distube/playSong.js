const { EmbedBuilder, inlineCode } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

const { applyRepeatMode } = require('../../utils');

module.exports = {
  name: DistubeEvents.PLAY_SONG,

  /**
   *
   * @param {import('distube').Queue} queue
   * @param {import('distube').Song} song
   */
  async execute(queue, song) {
    const embed = new EmbedBuilder()
      .setColor(queue.clientMember.displayHexColor || 0xfcc9b9)
      .setTimestamp(Date.now())
      .setDescription(
        `Playing ${inlineCode(song.name)} - ${inlineCode(
          song.formattedDuration,
        )}\nRequested by ${song.user}\nVolume: ${inlineCode(
          `${queue.volume}%`,
        )} | Filter: ${inlineCode(
          queue.filters.names.join(', ') || 'Off',
        )} | Loop: ${inlineCode(
          applyRepeatMode(queue.repeatMode),
        )} | Autoplay: ${inlineCode(queue.autoplay ? 'On' : 'Off')}`,
      )
      .setAuthor({
        name: '🎶 Playing Music',
      })
      .setFooter({
        text: queue.client.user.username,
        iconURL: queue.client.user.displayAvatarURL({ dynamic: true }),
      });

    if (song.thumbnail !== undefined) {
      embed.setThumbnail(song.thumbnail);
    }

    await queue.textChannel
      .send({ embeds: [embed] })
      .catch((err) => console.error(err));
  },
};
