const { capitalCase } = require('change-case');
const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  inlineCode,
  italic,
  OverwriteType,
  roleMention,
  time,
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
      .setColor(guild.members.me?.displayHexColor ?? null)
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
      embed
        .setDescription(
          `${oldChannel} channel's name was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
          { name: '🕒 Before', value: oldChannel.name, inline: true },
          { name: '🕒 After', value: newChannel.name, inline: true },
          {
            name: '🕒 Edited At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      embed
        .setDescription(
          `${oldChannel} channel's nsfw state was ${bold(
            `turned ${newChannel.nsfw ? 'on' : 'off'}`,
          )} by ${editLog.executor}.`,
        )
        .setFields([
          {
            name: `🕒 Turned ${newChannel.nsfw ? 'On' : 'Off'} At`,
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      embed
        .setDescription(
          `${oldChannel} channel's category was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
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
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
    }

    if (oldChannel.userLimit !== newChannel.userLimit) {
      embed
        .setDescription(
          `${oldChannel} channel's user limit was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
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
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
    }

    if (oldChannel.topic !== newChannel.topic) {
      embed
        .setDescription(
          `${oldChannel} channel's topic was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
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
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
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

      embed
        .setDescription(
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
        )
        .setFields([
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
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
    }

    const permissionUpdateLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelOverwriteUpdate,
      })
      .then((audit) => audit.entries.first());

    const oldGrantedPermissions = oldChannelPermissions.filter((oldPerm) =>
      newChannelPermissions.some(
        (newPerm) => oldPerm.allow.bitfield !== newPerm.allow.bitfield,
      ),
    );

    const newGrantedPermissions = newChannelPermissions.filter((oldPerm) =>
      oldChannelPermissions.some(
        (newPerm) => oldPerm.allow.bitfield !== newPerm.allow.bitfield,
      ),
    );

    if (
      oldGrantedPermissions.reduce(
        (acc, curr) => acc + Number(curr.allow),
        0,
      ) !==
      newGrantedPermissions.reduce((acc, curr) => acc + Number(curr.allow), 0)
    ) {
      const newGrantedPermission =
        newGrantedPermissions.size > 1
          ? newGrantedPermissions.find(
              (perm) => perm.id === permissionUpdateLog.extra.id,
            )
          : newGrantedPermissions.first();

      const oldGrantedPermission =
        oldGrantedPermissions.size > 1
          ? oldGrantedPermissions.find(
              (perm) => perm.id === permissionUpdateLog.extra.id,
            )
          : oldGrantedPermissions.first();

      embed
        .setDescription(
          `${newChannel} permissions was ${bold(
            newGrantedPermission.allow
              .toArray()
              .filter(
                (permission) =>
                  !oldGrantedPermission.allow.toArray().includes(permission),
              ).length
              ? 'granted'
              : 'resetted',
          )} for ${
            newGrantedPermission.type === OverwriteType.Role
              ? newGrantedPermission.id === guild.roles.everyone.id
                ? guild.roles.everyone
                : roleMention(newGrantedPermission.id)
              : userMention(newGrantedPermission.id)
          } by ${permissionUpdateLog.executor}.`,
        )
        .setFields([
          {
            name: '🕒 Previous Permissions',
            value:
              oldGrantedPermission.allow
                .toArray()
                .map((permission) => inlineCode(capitalCase(permission)))
                .join(', ') || italic('None'),
          },
          {
            name: `${
              newGrantedPermission.allow
                .toArray()
                .filter(
                  (permission) =>
                    !oldGrantedPermission.allow.toArray().includes(permission),
                ).length
                ? '🟢 Granted'
                : '⚫ Resetted'
            } Permissions`,
            value: oldGrantedPermissions.size
              ? newGrantedPermission.allow
                  .toArray()
                  .filter(
                    (permission) =>
                      !oldGrantedPermission.allow
                        .toArray()
                        .includes(permission),
                  ).length
                ? newGrantedPermission.allow
                    .toArray()
                    .filter(
                      (permission) =>
                        !oldGrantedPermission.allow
                          .toArray()
                          .includes(permission),
                    )
                    .map((permission) => inlineCode(capitalCase(permission)))
                    .join(', ')
                : newGrantedPermission.allow
                    .missing(oldGrantedPermission.allow.bitfield)
                    .map((permission) => inlineCode(capitalCase(permission)))
                    .join(', ')
              : newGrantedPermission.allow
                  .toArray()
                  .map((permission) => inlineCode(capitalCase(permission)))
                  .join(', '),
          },
          {
            name: `🕒 ${
              newGrantedPermission.allow
                .toArray()
                .filter(
                  (permission) =>
                    !oldGrantedPermission.allow.toArray().includes(permission),
                ).length
                ? 'Granted'
                : 'Resetted'
            } At`,
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          {
            name: '📄 Reason',
            value: permissionUpdateLog.reason ?? 'No reason',
          },
        ]);

      await ChannelLogger.send({ embeds: [embed] });
    }

    const oldDeniedPermissions = oldChannelPermissions.filter((oldPerm) =>
      newChannelPermissions.some(
        (newPerm) => oldPerm.deny.bitfield !== newPerm.deny.bitfield,
      ),
    );

    const newDeniedPermissions = newChannelPermissions.filter((oldPerm) =>
      oldChannelPermissions.some(
        (newPerm) => oldPerm.deny.bitfield !== newPerm.deny.bitfield,
      ),
    );

    if (
      oldDeniedPermissions.reduce((acc, curr) => acc + Number(curr.deny), 0) !==
      newDeniedPermissions.reduce((acc, curr) => acc + Number(curr.deny), 0)
    ) {
      const newDeniedPermission =
        newDeniedPermissions.size > 1
          ? newDeniedPermissions.find(
              (perm) => perm.id === permissionUpdateLog.extra.id,
            )
          : newDeniedPermissions.first();

      const oldDeniedPermission =
        oldDeniedPermissions.size > 1
          ? oldDeniedPermissions.find(
              (perm) => perm.id === permissionUpdateLog.extra.id,
            )
          : oldDeniedPermissions.first();

      embed.setDescription(
        `${newChannel} permissions was ${bold(
          newDeniedPermission.deny
            .toArray()
            .filter(
              (permission) =>
                !oldDeniedPermission.deny.toArray().includes(permission),
            ).length
            ? 'denied'
            : 'resetted',
        )} for ${
          newDeniedPermission.type === OverwriteType.Role
            ? newDeniedPermission.id === guild.roles.everyone.id
              ? guild.roles.everyone
              : roleMention(newDeniedPermission.id)
            : userMention(newDeniedPermission.id)
        } by ${permissionUpdateLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Previous Permissions',
          value:
            oldDeniedPermission.deny
              .toArray()
              .map((permission) => inlineCode(capitalCase(permission)))
              .join(', ') || italic('None'),
        },
        {
          name: `${
            newDeniedPermission.deny
              .toArray()
              .filter(
                (permission) =>
                  !oldDeniedPermission.deny.toArray().includes(permission),
              ).length
              ? '🚫 Denied'
              : '⚫ Resetted'
          } Permissions`,
          value: oldDeniedPermissions.size
            ? newDeniedPermission.deny
                .toArray()
                .filter(
                  (permission) =>
                    !oldDeniedPermission.deny.toArray().includes(permission),
                ).length
              ? newDeniedPermission.deny
                  .toArray()
                  .filter(
                    (permission) =>
                      !oldDeniedPermission.deny.toArray().includes(permission),
                  )
                  .map((permission) => inlineCode(capitalCase(permission)))
                  .join(', ')
              : newDeniedPermission.deny
                  .missing(oldDeniedPermission.deny.bitfield)
                  .map((permission) => inlineCode(capitalCase(permission)))
                  .join(', ')
            : newDeniedPermission.deny
                .toArray()
                .map((permission) => inlineCode(capitalCase(permission)))
                .join(', '),
        },
        {
          name: `🕒 ${
            newDeniedPermission.deny
              .toArray()
              .filter(
                (permission) =>
                  !oldDeniedPermission.deny.toArray().includes(permission),
              ).length
              ? 'Denied'
              : 'Resetted'
          } At`,
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '📄 Reason',
          value: permissionUpdateLog.reason ?? 'No reason',
        },
      ]);

      await ChannelLogger.send({ embeds: [embed] });
    }
  },
};
