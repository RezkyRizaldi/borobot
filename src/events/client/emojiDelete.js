const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  hyperlink,
  italic,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildEmojiDelete,

  /**
   *
   * @param {import('discord.js').GuildEmoji} emoji
   */
  async execute(emoji) {
    const { client, guild } = emoji;

    const EmojiLogger = new WebhookClient({
      id: process.env.SERVER_EMOJI_WEBHOOK_ID,
      token: process.env.SERVER_EMOJI_WEBHOOK_TOKEN,
    });

    const deleteLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.EmojiDelete,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '😀 Emoji Deleted',
      })
      .setDescription(
        `An emoji was ${bold('deleted')} by ${deleteLog.executor}.`,
      )
      .setFields([
        {
          name: '🔤 Name',
          value: hyperlink(
            emoji.name ?? italic('None'),
            emoji.url,
            'Click here to view the emoji.',
          ),
          inline: true,
        },
        {
          name: '🕒 Created At',
          value: time(emoji.createdAt, TimestampStyles.RelativeTime),
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

    await EmojiLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
