const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.names.join(', ') || 'Off'
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? 'All Queue'
        : 'This Song'
      : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

module.exports = {
  name: DistubeEvents.ADD_LIST,

  /**
   *
   * @param {import('distube').Queue} queue
   * @param {import('distube').Playlist} playlist
   */
  async execute(queue, playlist) {
    await queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setDescription(
            `Added \`${playlist.name}\` playlist (${
              playlist.songs.length
            } songs) to queue\n${status(queue)}`,
          ),
      ],
    });
  },
};
