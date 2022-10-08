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
  name: Events.GuildEmojiCreate,

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

    const createLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.EmojiCreate,
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
        name: `😀 New ${emoji.animated ? 'Animated' : ''} Emoji Created`,
      })
      .setDescription(
        `${emoji} emoji was ${bold('created')} ${
          emoji.author ? `by ${emoji.author}` : ''
        }.`,
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
          name: '📄 Reason',
          value: createLog.reason ?? 'No reason',
        },
      ]);

    await EmojiLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
