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
  name: Events.GuildRoleUpdate,

  /**
   *
   * @param {import('discord.js').Role} oldRole
   * @param {import('discord.js').Role} newRole
   */
  async execute(oldRole, newRole) {
    const { client, guild } = oldRole;

    const RoleLogger = new WebhookClient({
      id: process.env.ROLE_EDIT_WEBHOOK_ID,
      token: process.env.ROLE_EDIT_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate,
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
        name: '⚒️ Role Edited',
      });

    if (oldRole.position !== newRole.position) return;

    if (oldRole.name !== newRole.name) {
      embed.setDescription(
        `${oldRole} role's name was ${bold('edited')} by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Edited At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '🕒 Before',
          value: oldRole.name,
        },
        {
          name: '🕒 After',
          value: newRole.name,
        },
      ]);

      return RoleLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      embed.setDescription(
        `${oldRole} role's color was ${bold('edited')} by ${
          editLog.executor
        } at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}.`,
      );
      embed.setFields([
        {
          name: '🕒 Edited At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '🕒 Before',
          value: oldRole.hexColor,
        },
        {
          name: '🕒 After',
          value: newRole.hexColor,
        },
      ]);

      return RoleLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }
  },
};
