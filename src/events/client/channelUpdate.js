const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
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

    const oldChannelPermissions = oldChannel.permissionOverwrites.cache;
    const newChannelPermissions = newChannel.permissionOverwrites.cache;

    const oldChannelPermissionsWithoutEveryone = oldChannelPermissions.filter(
      (permission) => permission.id !== guild.roles.everyone.id,
    );

    const newChannelPermissionsWithoutEveryone = newChannelPermissions.filter(
      (permission) => permission.id !== guild.roles.everyone.id,
    );

    const oldChannelPermissionsArray = [
      ...oldChannelPermissionsWithoutEveryone.values(),
    ];
    const newChannelPermissionsArray = [
      ...newChannelPermissionsWithoutEveryone.values(),
    ];

    const attachedPermission = newChannelPermissionsArray.filter(
      (permissions) => !oldChannelPermissionsArray.includes(permissions),
    )[newChannelPermissionsArray.length - 1];

    const detachedPermission = oldChannelPermissionsArray.filter(
      (permissions) => !newChannelPermissionsArray.includes(permissions),
    )[oldChannelPermissionsArray.length - 1];

    if (
      oldChannelPermissionsWithoutEveryone.size !==
      newChannelPermissionsWithoutEveryone.size
    ) {
      const permissionCreateLog = await guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.ChannelOverwriteCreate,
        })
        .then((audit) => audit.entries.first());

      const permissionDeleteLog = await guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.ChannelOverwriteDelete,
        })
        .then((audit) => audit.entries.first());

      embed.setDescription(
        `${newChannel} permissions was ${bold(
          oldChannelPermissionsWithoutEveryone.size <
            newChannelPermissionsWithoutEveryone.size
            ? 'attached'
            : 'detached',
        )} for ${
          oldChannelPermissionsWithoutEveryone.size <
          newChannelPermissionsWithoutEveryone.size
            ? attachedPermission.type === OverwriteType.Role
              ? roleMention(attachedPermission.id)
              : userMention(attachedPermission.id)
            : detachedPermission.type === OverwriteType.Role
            ? roleMention(detachedPermission.id)
            : userMention(detachedPermission.id)
        } by ${
          oldChannelPermissionsWithoutEveryone.size <
          newChannelPermissionsWithoutEveryone.size
            ? permissionCreateLog.executor
            : permissionDeleteLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: `🕒 ${
            oldChannelPermissionsWithoutEveryone.size <
            newChannelPermissionsWithoutEveryone.size
              ? 'Attached'
              : 'Detached'
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    // TODO: WIP
    // const permissionUpdateLog = await guild
    //   .fetchAuditLogs({
    //     limit: 1,
    //     type: AuditLogEvent.ChannelOverwriteUpdate,
    //   })
    //   .then((audit) => audit.entries.first());

    // if (oldChannelPermissions.size !== newChannelPermissions.size) {
    //   embed.setDescription(
    //     `${newChannel} permissions was ${bold(
    //       oldChannelPermissions.size < newChannelPermissions.size
    //         ? 'granted'
    //         : 'denied',
    //     )} for ${
    //       oldChannelPermissions.size < newChannelPermissions.size
    //         ? grantedPermission.type === OverwriteType.Role
    //           ? roleMention(grantedPermission.id)
    //           : userMention(grantedPermission.id)
    //         : deniedPermission.type === OverwriteType.Role
    //         ? roleMention(deniedPermission.id)
    //         : userMention(deniedPermission.id)
    //     } by ${editLog.executor}.`,
    //   );
    //   embed.setFields([
    //     {
    //       name: `🕒 ${
    //         oldChannelPermissions.size < newChannelPermissions.size
    //           ? 'Granted'
    //           : 'Denied'
    //       } At`,
    //       value: time(
    //         Math.floor(Date.now() / 1000),
    //         TimestampStyles.RelativeTime,
    //       ),
    //     },
    //     {
    //       name: '📄 Reason',
    //       value: editLog.reason ?? 'No reason',
    //     },
    //   ]);
    //   embed.spliceFields(0, 0, {
    //     name: `${
    //       oldChannelPermissions.size < newChannelPermissions.size
    //         ? '🟢 Granted'
    //         : '🚫 Denied'
    //     } Permissions`,
    //     value:
    //       oldChannelPermissions.size < newChannelPermissions.size
    //         ? grantedPermission.allow.bitfield !== BigInt(0)
    //           ? grantedPermission.allow
    //               .toArray()
    //               .map((permission) =>
    //                 inlineCode(applySpacesBetweenPascalCase(permission)),
    //               )
    //               .join(', ')
    //           : italic('None')
    //         : deniedPermission.deny.bitfield !== BigInt(0)
    //         ? deniedPermission.deny
    //             .toArray()
    //             .map((permission) =>
    //               inlineCode(applySpacesBetweenPascalCase(permission)),
    //             )
    //             .join(', ')
    //         : italic('None'),
    //   });

    //   return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    // }
  },
};
