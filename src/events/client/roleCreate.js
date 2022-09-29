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
  name: Events.GuildRoleCreate,

  /**
   *
   * @param {import('discord.js').Role} role
   */
  async execute(role) {
    const { client, guild } = role;

    const RoleLogger = new WebhookClient({
      id: process.env.ROLE_CREATE_WEBHOOK_ID,
      token: process.env.ROLE_CREATE_WEBHOOK_TOKEN,
    });

    const createLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleCreate,
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
        name: '🛠️ New Role Created',
      });

    embed.setDescription(
      `${role} role was ${bold('created')} by ${createLog.executor}.`,
    );
    embed.setFields([
      {
        name: '🕒 Created At',
        value: time(role.createdAt, TimestampStyles.RelativeTime),
      },
      {
        name: '📄 Reason',
        value: createLog.reason ?? 'No reason',
      },
    ]);

    return RoleLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
