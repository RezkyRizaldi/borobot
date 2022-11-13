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
    console.log(queue);

    const embed = new EmbedBuilder()
      .setColor(queue.clientMember.displayHexColor)
      .setTimestamp(Date.now())
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
      .then((message) => {
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
      })
      .catch(console.error);
  },
};
