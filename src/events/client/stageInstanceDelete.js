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
  name: Events.StageInstanceDelete,

  /**
   *
   * @param {import('discord.js').StageInstance} stage
   */
  async execute(stage) {
    const { channel, client, guild } = stage;

    if (!guild || !channel) return;

    const StageLogger = new WebhookClient({
      id: process.env.CHANNEL_STAGE_WEBHOOK_ID,
      token: process.env.CHANNEL_STAGE_WEBHOOK_TOKEN,
    });

    const deleteLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.StageInstanceDelete,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({ name: '🎤 Stage Channel Deleted' })
      .setDescription(
        `${channel} stage channel was ${bold('deleted')} by ${
          deleteLog.executor
        }.`,
      )
      .setFields([
        { name: '🔤 Name', value: channel.name, inline: true },
        {
          name: '🕒 Created At',
          value: time(channel.createdAt, TimestampStyles.RelativeTime),
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
        { name: '📄 Reason', value: deleteLog.reason ?? 'No reason' },
      ]);

    return StageLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
