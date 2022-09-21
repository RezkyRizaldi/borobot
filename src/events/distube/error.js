const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
  name: DistubeEvents.ERROR,

  /**
   *
   * @param {import('discord.js').BaseGuildTextChannel} channel
   * @param {Error} err
   */
  async execute(channel, err) {
    if (!channel) {
      console.error(err);
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: '❌ An Error Encountered',
      })
      .setColor(channel.guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setDescription(err.toString().slice(0, 4096))
      .setFooter({
        text: channel.client.user.username,
        iconURL: channel.client.user.displayAvatarURL({ dynamic: true }),
      });

    return channel.send({ embeds: [embed] });
  },
};
