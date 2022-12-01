const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildStickerUpdate,

  /**
   *
   * @param {import('discord.js').Sticker} oldSticker
   * @param {import('discord.js').Sticker} newSticker
   */
  async execute(oldSticker, newSticker) {
    const { client, guild } = oldSticker;

    if (!guild) return;

    const StickerLogger = new WebhookClient({
      id: process.env.SERVER_STICKER_WEBHOOK_ID,
      token: process.env.SERVER_STICKER_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.StickerUpdate,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setAuthor({ name: '😀 Sticker Edited' })
      .setDescription(
        `${oldSticker} sticker was ${bold('edited')} by ${editLog.executor}.`,
      )
      .setFields([
        { name: '🕒 Before', value: oldSticker.name, inline: true },
        { name: '🕒 After', value: newSticker.name, inline: true },
        {
          name: '🕒 Edited At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
      ]);

    return StickerLogger.send({ embeds: [embed] });
  },
};
