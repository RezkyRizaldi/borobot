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
    if (!channel) return;

    const { client, guild } = channel;

    const embed = new EmbedBuilder()
      .setAuthor({ name: '❌ An Error Encountered' })
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setDescription(err.toString().slice(0, 4096))
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    return channel.send({ embeds: [embed] });
  },
};
