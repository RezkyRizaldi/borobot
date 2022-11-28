const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  italic,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildEmojiUpdate,

  /**
   *
   * @param {import('discord.js').GuildEmoji} oldEmoji
   * @param {import('discord.js').GuildEmoji} newEmoji
   */
  async execute(oldEmoji, newEmoji) {
    const { client, guild } = oldEmoji;

    const EmojiLogger = new WebhookClient({
      id: process.env.SERVER_EMOJI_WEBHOOK_ID,
      token: process.env.SERVER_EMOJI_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.EmojiUpdate,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({ name: '😀 Emoji Edited' })
      .setDescription(
        `${oldEmoji} emoji was ${bold('edited')} by ${editLog.executor}.`,
      )
      .setFields([
        {
          name: '🕒 Before',
          value: oldEmoji.name ?? italic('None'),
          inline: true,
        },
        {
          name: '🕒 After',
          value: newEmoji.name ?? italic('None'),
          inline: true,
        },
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

    return EmojiLogger.send({ embeds: [embed] });
  },
};
