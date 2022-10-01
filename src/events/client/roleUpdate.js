/* global BigInt */
const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  inlineCode,
  italic,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

const { applySpacesBetweenPascalCase } = require('../../utils');

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
      .setColor(newRole.hexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '🛠️ Role Edited',
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
        {
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);

      return RoleLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      embed.setDescription(
        `${oldRole} role's color was ${bold('edited')} by ${editLog.executor}.`,
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
        {
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);

      return RoleLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldRole.hoist !== newRole.hoist) {
      embed.setDescription(
        `${oldRole} role's hoist state was ${bold(
          `turned ${newRole.hoist ? 'on' : 'off'}`,
        )} by ${editLog.executor}.`,
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
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);

      return RoleLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      embed.setDescription(
        `${oldRole} role's mentionable state was ${bold(
          `turned ${newRole.mentionable ? 'on' : 'off'}`,
        )} by ${editLog.executor}.`,
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
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);

      return RoleLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      const oldRolePermissions = oldRole.permissions.toArray();
      const newRolePermissions = newRole.permissions.toArray();

      if (newRole.permissions.bitfield === BigInt(0)) {
        embed.setDescription(
          `${oldRole} role's permissions was ${bold('removed')} by ${
            editLog.executor
          }.`,
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
            name: '📄 Reason',
            value: editLog.reason ?? 'No reason',
          },
        ]);

        return RoleLogger.send({ embeds: [embed] }).catch(console.error);
      }

      embed.setDescription(
        `${oldRole} role's permissions was ${bold(
          oldRolePermissions.length < newRolePermissions.length
            ? 'granted'
            : 'denied',
        )} by ${editLog.executor}.`,
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
          name: '🕒 Previous Permissions',
          value:
            oldRolePermissions
              .map((permission) =>
                inlineCode(applySpacesBetweenPascalCase(permission)),
              )
              .join(', ') ?? italic('None'),
        },
        {
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);
      embed.spliceFields(2, 0, {
        name: `${
          oldRolePermissions.length < newRolePermissions.length
            ? '🟢 Granted'
            : '🚫 Denied'
        } Permissions`,
        value:
          oldRolePermissions.length < newRolePermissions.length
            ? newRolePermissions
                .filter(
                  (permission) => !oldRolePermissions.includes(permission),
                )
                .map((permission) =>
                  inlineCode(applySpacesBetweenPascalCase(permission)),
                )
                .join(', ')
            : oldRolePermissions
                .filter(
                  (permission) => !newRolePermissions.includes(permission),
                )
                .map((permission) =>
                  inlineCode(applySpacesBetweenPascalCase(permission)),
                )
                .join(', '),
      });

      return RoleLogger.send({ embeds: [embed] }).catch(console.error);
    }
  },
};
