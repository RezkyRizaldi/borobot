const {
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.ChannelPinsUpdate,

  /**
   *
   * @param {import('discord.js').TextChannel} channel
   * @param {Date} timestamp
   */
  async execute(channel, timestamp) {
    const { client, guild } = channel;

    const ChannelLogger = new WebhookClient({
      id: process.env.CHANNEL_PINs_EDIT_WEBHOOK_ID,
      token: process.env.CHANNEL_PINs_EDIT_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '📌 Channel Pins Edited',
      })
      .setDescription(`${channel} channel pins was ${bold('edited')}.`)
      .setFields([
        {
          name: '🕒 Edited At',
          value: time(
            Math.floor(timestamp / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
      ]);

    await ChannelLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
