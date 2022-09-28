const Canvas = require('@napi-rs/canvas');
const {
  AttachmentBuilder,
  AuditLogEvent,
  EmbedBuilder,
  italic,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');
const pluralize = require('pluralize');

const { applyText } = require('../../utils');

module.exports = {
  name: 'guildMemberUpdate',

  /**
   *
   * @param {import('discord.js').GuildMember} oldMember
   * @param {import('discord.js').GuildMember} newMember
   */
  async execute(oldMember, newMember) {
    const { client, guild } = newMember;

    const embed = new EmbedBuilder()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor(newMember.displayHexColor);

    const roleLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberRoleUpdate,
      })
      .then((audit) => audit.entries.first());

    switch (true) {
      // If the member has boosted the server
      case !oldMember.premiumSince && newMember.premiumSince: {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(
          './src/assets/images/nitro.png',
        );

        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#fcc9b9';
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.font = applyText(canvas, `${newMember.displayName}!`);
        context.textAlign = 'center';
        context.fillStyle = '#ffffff';
        context.fillText(
          `Welcome to test, ${newMember.displayName}!`,
          canvas.width / 2,
          canvas.height / 1.2,
        );

        const avatar = await Canvas.loadImage(
          newMember.displayAvatarURL({ extension: 'jpg' }),
        );

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), {
          name: 'nitro.png',
        });

        embed.setAuthor({
          name: 'Server Boosted',
          iconURL: guild.iconURL({ dynamic: true }),
        });
        embed.setThumbnail(newMember.displayAvatarURL({ dynamic: true }));
        embed.setDescription(`Welcome to test, ${newMember.displayName}!`);
        embed.setImage('attachment://nitro.png');

        await guild.systemChannel
          .send({ embeds: [embed], files: [attachment] })
          .catch((err) => console.error(err));

        embed.setDescription('Thank you for boosting test!');

        return newMember
          .send({ embeds: [embed] })
          .catch((err) => console.error(err));
      }

      // If the member roles have changed
      case roleLog.target.id === newMember.id:
        {
          const RoleAddLogger = new WebhookClient({
            id: process.env.MEMBER_ROLE_ADD_WEBHOOK_ID,
            token: process.env.MEMBER_ROLE_ADD_WEBHOOK_TOKEN,
          });

          const removedRoles = oldMember.roles.cache.filter(
            (role) => !newMember.roles.cache.has(role.id),
          );

          if (removedRoles.size) {
            embed.setAuthor({
              name: 'Roles Removed',
              iconURL: oldMember.displayAvatarURL({ dynamic: true }),
            });
            embed.setDescription(
              `The ${pluralize('role', removedRoles.size)} ${removedRoles
                .map((role) => `${role}`)
                .join(', ')} have been removed from ${oldMember} by ${
                roleLog.executor
              } at ${time(
                Math.floor(Date.now() / 1000),
                TimestampStyles.RelativeTime,
              )}.`,
            );

            return RoleAddLogger.send({ embeds: [embed] }).catch((err) =>
              console.error(err),
            );
          }

          const RoleRemoveLogger = new WebhookClient({
            id: process.env.MEMBER_ROLE_REMOVE_WEBHOOK_ID,
            token: process.env.MEMBER_ROLE_REMOVE_WEBHOOK_TOKEN,
          });

          const addedRoles = newMember.roles.cache.filter(
            (role) => !oldMember.roles.cache.has(role.id),
          );

          if (addedRoles.size) {
            embed.setAuthor({
              name: 'Roles Added',
              iconURL: newMember.displayAvatarURL({ dynamic: true }),
            });
            embed.setDescription(
              `The ${pluralize('role', removedRoles.size)} ${addedRoles
                .map((role) => `${role}`)
                .join(', ')} have been added to ${newMember} by ${
                roleLog.executor
              } at ${time(
                Math.floor(Date.now() / 1000),
                TimestampStyles.RelativeTime,
              )}.`,
            );

            return RoleRemoveLogger.send({ embeds: [embed] }).catch((err) =>
              console.error(err),
            );
          }
        }
        break;

      // If the member timed out by a moderator
      case newMember.isCommunicationDisabled() &&
        oldMember.nickname === newMember.nickname:
        {
          const TimeoutLogger = new WebhookClient({
            id: process.env.MEMBER_GUILD_TIMEOUT_WEBHOOK_ID,
            token: process.env.MEMBER_GUILD_TIMEOUT_WEBHOOK_TOKEN,
          });

          const timeoutLog = await guild
            .fetchAuditLogs({
              limit: 1,
              type: AuditLogEvent.MemberUpdate,
            })
            .then((audit) => audit.entries.first());

          embed.setAuthor({
            name: 'Member Timed Out',
            iconURL: newMember.displayAvatarURL({ dynamic: true }),
          });
          embed.setDescription(
            `${newMember} has been timed out by ${
              timeoutLog.executor
            } at ${time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            )}.`,
          );
          embed.setFields([
            {
              name: '📄 Reason',
              value: timeoutLog.reason ?? 'No reason',
            },
          ]);

          if (timeoutLog.target.id === newMember.id) {
            return TimeoutLogger.send({ embeds: [embed] }).catch((err) =>
              console.error(err),
            );
          }
        }
        break;

      case !newMember.isCommunicationDisabled() &&
        oldMember.nickname === newMember.nickname:
        {
          const TimeoutRemoveLogger = new WebhookClient({
            id: process.env.MEMBER_GUILD_TIMEOUT_REMOVE_WEBHOOK_ID,
            token: process.env.MEMBER_GUILD_TIMEOUT_REMOVE_WEBHOOK_TOKEN,
          });

          const timeoutRemoveLog = await guild
            .fetchAuditLogs({
              limit: 1,
              type: AuditLogEvent.MemberUpdate,
            })
            .then((audit) => audit.entries.first());

          embed.setAuthor({
            name: 'Member Timeout Removed',
            iconURL: newMember.displayAvatarURL({ dynamic: true }),
          });
          embed.setDescription(
            `${newMember} timeout has been removed by ${
              timeoutRemoveLog.executor
            } at ${time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            )}.`,
          );

          if (timeoutRemoveLog.target.id === newMember.id) {
            return TimeoutRemoveLogger.send({ embeds: [embed] }).catch((err) =>
              console.error(err),
            );
          }
        }
        break;

      // If the member's nickname changed.
      case oldMember.nickname !== newMember.nickname:
        {
          const NicknameLogger = new WebhookClient({
            id: process.env.MEMBER_NICKNAME_WEBHOOK_ID,
            token: process.env.MEMBER_NICKNAME_WEBHOOK_TOKEN,
          });

          const nicknameLog = await guild
            .fetchAuditLogs({
              limit: 1,
              type: AuditLogEvent.MemberUpdate,
            })
            .then((audit) => audit.entries.first());

          embed.setAuthor({
            name: 'Member Nickname Changed',
            iconURL: newMember.displayAvatarURL({ dynamic: true }),
          });
          embed.setDescription(
            `${newMember} nickname has been changed by ${
              nicknameLog.executor
            } at ${time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            )}.`,
          );
          embed.setFields(
            {
              name: 'Before',
              value: oldMember.nickname ?? italic('None'),
            },
            {
              name: 'After',
              value: newMember.nickname ?? italic('None'),
            },
          );

          if (nicknameLog.target.id === newMember.id) {
            return NicknameLogger.send({ embeds: [embed] }).catch((err) =>
              console.error(err),
            );
          }
        }
        break;
    }
  },
};
