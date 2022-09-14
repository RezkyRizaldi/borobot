const {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.VoiceStateUpdate,

  /**
   *
   * @param {import('discord.js').VoiceState} oldState
   * @param {import('discord.js').VoiceState} newState
   */
  async execute(oldState, newState) {
    if (oldState.member.user.bot || newState.member.user.bot) return;

    const embed = new EmbedBuilder()
      .setFooter({
        text: newState.client.user.username,
        iconURL: newState.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor(newState.member.displayHexColor);

    // If the member join to a voice channel
    if (!oldState.channel && newState.channel) {
      const VoiceJoinLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_JOIN_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_JOIN_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Joined',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has join to ${newState.channel} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );

      return VoiceJoinLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // If the member leave from a voice channel or disconnected by a moderator
    if (oldState.channel && !newState.channel) {
      const VoiceLeaveLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Left',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${newState.member} has left from ${oldState.channel} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );

      return VoiceLeaveLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // If the member being moved by a moderator
    if (oldState.channel !== newState.channel) {
      const moveLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberMove,
        })
        .then((audit) => audit.entries.first());

      if (new Date() - moveLog.createdAt > 5 * 1000) return;

      const VoiceMoveLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_MOVE_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_MOVE_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Moved',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${newState.member} has been moved from ${oldState.channel} to ${
          newState.channel
        } by ${moveLog.executor} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );
      embed.setFields([
        {
          name: '📄 Reason',
          value: moveLog.reason || 'No reason',
        },
      ]);

      return VoiceMoveLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // If the member being muted by a moderator
    if (!oldState.serverMute && newState.serverMute) {
      const muteLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        })
        .then((audit) => audit.entries.first());

      const VoiceMuteLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_MUTE_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_MUTE_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Muted',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has been muted from ${newState.channel} by ${
          muteLog.executor
        } at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );
      embed.setFields([
        {
          name: '📄 Reason',
          value: muteLog.reason || 'No reason',
        },
      ]);

      return VoiceMuteLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // If the member being unmuted by a moderator
    if (oldState.serverMute && !newState.serverMute) {
      const unmuteLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        })
        .then((audit) => audit.entries.first());

      const VoiceUnmuteLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_MUTE_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_MUTE_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Unmuted',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${newState.member} has been unmuted from ${oldState.channel} by ${
          unmuteLog.executor
        } at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );
      embed.setFields([
        {
          name: '📄 Reason',
          value: unmuteLog.reason || 'No reason',
        },
      ]);

      return VoiceUnmuteLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // If the member being deafen by a moderator.
    if (!oldState.serverDeaf && newState.serverDeaf) {
      const deafenLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        })
        .then((audit) => audit.entries.first());

      const VoiceDeafenLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_DEAFEN_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_DEAFEN_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Deafen',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has been deafen from ${newState.channel} by ${
          deafenLog.executor
        } at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );
      embed.setFields([
        {
          name: '📄 Reason',
          value: deafenLog.reason || 'No reason',
        },
      ]);

      return VoiceDeafenLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // If the member being undeafen by a moderator.
    if (oldState.serverDeaf && !newState.serverDeaf) {
      const deafenLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        })
        .then((audit) => audit.entries.first());

      const VoiceDeafenLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_DEAFEN_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_DEAFEN_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Undeafen',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has been undeafen from ${newState.channel} by ${
          deafenLog.executor
        } at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );
      embed.setFields([
        {
          name: '📄 Reason',
          value: deafenLog.reason || 'No reason',
        },
      ]);

      return VoiceDeafenLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    // IF the member is streaming using "Screen Share"
    if (!oldState.streaming && newState.streaming) {
      const VoiceStreamLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_DEAFEN_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_DEAFEN_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Streaming',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} is streaming in ${newState.channel} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );

      return VoiceStreamLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }
  },
};
