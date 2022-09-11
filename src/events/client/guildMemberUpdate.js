const Canvas = require('@napi-rs/canvas');
const {
  AttachmentBuilder,
  AuditLogEvent,
  EmbedBuilder,
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
    const { guild } = newMember;

    const embed = new EmbedBuilder()
      .setFooter({
        text: newMember.client.user.username,
        iconURL: newMember.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor(newMember.displayHexColor || 0xfcc9b9);

    // If the member has boosted the server
    if (!oldMember.premiumSince && newMember.premiumSince) {
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
        newMember.user.displayAvatarURL({ extension: 'jpg' }),
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
      embed.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }));
      embed.setDescription(`Welcome to test, ${newMember.displayName}!`);
      embed.setImage('attachment://nitro.png');

      await guild.systemChannel
        .send({ embeds: [embed], files: [attachment] })
        .catch((err) => console.error(err));

      embed.setDescription('Thank you for boosting test!');
      await newMember.send({ embeds: [embed] }).catch((err) => {
        console.error(err);
        console.log(`Could not send a DM to ${newMember.user.tag}.`);
      });
    }

    // If the member roles have changed
    const roleLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberRoleUpdate,
      })
      .then((audit) => audit.entries.first());

    if (roleLog.target.id === newMember.id) {
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

    // If the member timed out by a moderator
    if (newMember.isCommunicationDisabled()) {
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
        `${newMember} has been timed out by ${timeoutLog.executor} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );
      embed.setFields([
        {
          name: '📄 Reason',
          value: timeoutLog.reason || 'No reason',
        },
      ]);

      if (timeoutLog.target.id === newMember.id) {
        return TimeoutLogger.send({ embeds: [embed] }).catch((err) =>
          console.error(err),
        );
      }
    }

    if (!newMember.isCommunicationDisabled()) {
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
        )}`,
      );

      if (timeoutRemoveLog.target.id === newMember.id) {
        return TimeoutRemoveLogger.send({ embeds: [embed] }).catch((err) =>
          console.error(err),
        );
      }
    }
  },
};
