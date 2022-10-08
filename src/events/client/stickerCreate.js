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

const { applyStickerFormat, applyStickerType } = require('../../utils');

module.exports = {
  name: Events.GuildStickerCreate,

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

    const createLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.StickerCreate,
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
        name: '😀 New Sticker Created',
      })
      .setDescription(
        `${sticker} sticker was ${bold('created')} ${
          sticker.user ? `by ${sticker.user}` : ''
        }.`,
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
          name: '🗃️ Format',
          value: applyStickerFormat(sticker.format),
          inline: true,
        },
        {
          name: '🔣 Type',
          value: applyStickerType(sticker.type),
          inline: true,
        },
        {
          name: '🕒 Created At',
          value: time(sticker.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '📄 Reason',
          value: createLog.reason ?? 'No reason',
        },
      ]);

    await StickerLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
