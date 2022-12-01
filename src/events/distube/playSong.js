const { EmbedBuilder, inlineCode } = require('discord.js');
const { Events: DistubeEvents } = require('distube');
const progressbar = require('string-progressbar');

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
      .setColor(queue.clientMember?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setThumbnail(song?.thumbnail || null)
      .setDescription(
        `Playing ${inlineCode(song.name)}\nRequested by ${
          song.user
        }\nVolume: ${inlineCode(`${queue.volume}%`)} | Filter: ${inlineCode(
          queue.filters.names.join(', ') || 'Off',
        )} | Loop: ${inlineCode(
          applyRepeatMode(queue.repeatMode),
        )} | Autoplay: ${inlineCode(queue.autoplay ? 'On' : 'Off')}\n${
          queue.formattedCurrentTime
        } - [${progressbar
          .splitBar(song.duration || 10, queue.currentTime, 12)
          .slice(0, -1)
          .toString()}] - ${song.formattedDuration}`,
      )
      .setAuthor({ name: '🎶 Playing Music' })
      .setFooter({
        text: queue.client.user.username,
        iconURL: queue.client.user.displayAvatarURL(),
      });

    const message = await queue.textChannel.send({ embeds: [embed] });

    const interval = setInterval(async () => {
      if (queue.currentTime === song.duration) {
        clearInterval(interval);
      }

      embed.setDescription(
        `${inlineCode(song.name)}\nRequested by: ${
          song.user
        }\nVolume: ${inlineCode(`${queue.volume}%`)} | Filter: ${inlineCode(
          queue.filters.names.join(', ') || 'Off',
        )} | Loop: ${inlineCode(
          applyRepeatMode(queue.repeatMode),
        )} | Autoplay: ${inlineCode(queue.autoplay ? 'On' : 'Off')}\n${
          queue.formattedCurrentTime
        } - [${progressbar
          .splitBar(song.duration || 10, queue.currentTime, 12)
          .slice(0, -1)
          .toString()}] - ${song.formattedDuration}`,
      );

      await message.edit({ embeds: [embed] });
    }, 1000);
  },
};
