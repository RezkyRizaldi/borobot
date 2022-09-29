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
  name: Events.GuildRoleDelete,

  /**
   *
   * @param {import('discord.js').Role} role
   */
  async execute(role) {
    const { client, guild } = role;

    const RoleLogger = new WebhookClient({
      id: process.env.ROLE_DELETE_WEBHOOK_ID,
      token: process.env.ROLE_DELETE_WEBHOOK_TOKEN,
    });

    const deleteLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(role.hexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '🛠️ Role Deleted',
      })
      .setDescription(
        `${role} role was ${bold('deleted')} by ${deleteLog.executor}.`,
      )
      .setFields([
        {
          name: 'Name',
          value: role.name,
          inline: true,
        },
        {
          name: '🕒 Created At',
          value: time(role.createdAt, TimestampStyles.RelativeTime),
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

    return RoleLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
