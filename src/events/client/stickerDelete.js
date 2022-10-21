const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  hyperlink,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildStickerDelete,

  /**
   *
   * @param {import('discord.js').Sticker} sticker
   */
  async execute(sticker) {
    const { client, guild } = sticker;

    const StickerLogger = new WebhookClient({
      id: process.env.SERVER_STICKER_WEBHOOK_ID,
      token: process.env.SERVER_STICKER_WEBHOOK_TOKEN,
    });

    const deleteLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.StickerDelete,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '😀 Sticker Deleted',
      })
      .setDescription(
        `A sticker was ${bold('deleted')} by ${deleteLog.executor}.`,
      )
      .setFields([
        {
          name: '🔤 Name',
          value: hyperlink(
            sticker.name,
            sticker.url,
            sticker.description ?? 'Click here to view the sticker.',
          ),
          inline: true,
        },
        {
          name: '🕒 Created At',
          value: time(sticker.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '🕒 Deleted At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        {
          name: '📄 Reason',
          value: deleteLog.reason ?? 'No reason',
        },
      ]);

    await StickerLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
