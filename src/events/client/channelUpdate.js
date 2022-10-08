/* global BigInt */
const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  inlineCode,
  italic,
  time,
  OverwriteType,
  roleMention,
  TimestampStyles,
  userMention,
  WebhookClient,
} = require('discord.js');
const pluralize = require('pluralize');

const { channelType } = require('../../constants');
const { applySpacesBetweenPascalCase } = require('../../utils');

module.exports = {
  name: Events.ChannelUpdate,

  /**
   *
   * @param {import('discord.js').GuildChannel} oldChannel
   * @param {import('discord.js').GuildChannel} newChannel
   */
  async execute(oldChannel, newChannel) {
    const { client, guild } = oldChannel;

    const ChannelLogger = new WebhookClient({
      id: process.env.CHANNEL_EDIT_WEBHOOK_ID,
      token: process.env.CHANNEL_EDIT_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelUpdate,
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
        name: `${
          channelType.find((type) => oldChannel.type === type.value).name
        } Channel Edited`,
      });

    if (oldChannel.name !== newChannel.name) {
      embed.setDescription(
        `${oldChannel} channel's name was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldChannel.name,
          inline: true,
        },
        {
          name: '🕒 After',
          value: newChannel.name,
          inline: true,
        },
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      embed.setDescription(
        `${oldChannel} channel's nsfw state was ${bold(
          `turned ${newChannel.nsfw ? 'on' : 'off'}`,
        )} by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: `🕒 Turned ${newChannel.nsfw ? 'On' : 'Off'} At`,
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      embed.setDescription(
        `${oldChannel} channel's category was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldChannel.parent ? `${oldChannel.parent}` : italic('None'),
          inline: true,
        },
        {
          name: '🕒 After',
          value: newChannel.parent ? `${newChannel.parent}` : italic('None'),
          inline: true,
        },
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.userLimit !== newChannel.userLimit) {
      embed.setDescription(
        `${oldChannel} channel's user limit was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: pluralize('user', oldChannel.userLimit, true),
          inline: true,
        },
        {
          name: '🕒 After',
          value: pluralize('user', newChannel.userLimit, true),
          inline: true,
        },
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.topic !== newChannel.topic) {
      embed.setDescription(
        `${oldChannel} channel's topic was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldChannel.topic ?? italic('None'),
          inline: true,
        },
        {
          name: '🕒 After',
          value: newChannel.topic ?? italic('None'),
          inline: true,
        },
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    const oldChannelPermissions = oldChannel.permissionOverwrites.cache.filter(
      (permission) => permission.id !== guild.roles.everyone.id,
    );
    const newChannelPermissions = newChannel.permissionOverwrites.cache.filter(
      (permission) => permission.id !== guild.roles.everyone.id,
    );

    /** @type {import('discord.js').PermissionOverwrites[]} */
    const oldChannelPermissionsArray = [...oldChannelPermissions.values()];

    /** @type {import('discord.js').PermissionOverwrites[]} */
    const newChannelPermissionsArray = [...newChannelPermissions.values()];

    const grantedPermission = newChannelPermissionsArray.filter(
      (permission) => !oldChannelPermissionsArray.includes(permission),
    )[newChannelPermissionsArray.length - 1];

    const deniedPermission = oldChannelPermissionsArray.filter(
      (permissions) => !newChannelPermissionsArray.includes(permissions),
    )[0];

    if (oldChannelPermissions.size !== newChannelPermissions.size) {
      embed.setDescription(
        `${newChannel} permissions was ${bold(
          oldChannelPermissions.size < newChannelPermissions.size
            ? 'granted'
            : 'denied',
        )} for ${
          oldChannelPermissions.size < newChannelPermissions.size
            ? grantedPermission.type === OverwriteType.Role
              ? roleMention(grantedPermission.id)
              : userMention(grantedPermission.id)
            : deniedPermission.type === OverwriteType.Role
            ? roleMention(deniedPermission.id)
            : userMention(deniedPermission.id)
        } by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: `🕒 ${
            oldChannelPermissions.size < newChannelPermissions.size
              ? 'Granted'
              : 'Denied'
          } At`,
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
      embed.spliceFields(0, 0, {
        name: `${
          oldChannelPermissions.size < newChannelPermissions.size
            ? '🟢 Granted'
            : '🚫 Denied'
        } Permissions`,
        value:
          oldChannelPermissions.size < newChannelPermissions.size
            ? grantedPermission.allow.bitfield !== BigInt(0)
              ? grantedPermission.allow
                  .toArray()
                  .map((permission) =>
                    inlineCode(applySpacesBetweenPascalCase(permission)),
                  )
                  .join(', ')
              : italic('None')
            : deniedPermission.deny.bitfield !== BigInt(0)
            ? deniedPermission.deny
                .toArray()
                .map((permission) =>
                  inlineCode(applySpacesBetweenPascalCase(permission)),
                )
                .join(', ')
            : italic('None'),
      });

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }
  },
};
