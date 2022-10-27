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
        name: 'Member Joined Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has joined to ${newState.channel}.`,
      );
      embed.setFields([
        {
          name: '🕒 Joined At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
      ]);

      return VoiceJoinLogger.send({ embeds: [embed] }).catch(console.error);
    }

    // If the member leave from a voice channel
    if (oldState.channel && !newState.channel) {
      const disconnectLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberDisconnect,
        })
        .then((audit) => audit.entries.first());

      const diff = Math.abs(
        (new Date().getTime() - disconnectLog.createdAt.getTime()) / 1000,
      );

      // If the member disconnected from a voice channel by a moderator
      if (diff <= 5) {
        const VoiceDisconnectLogger = new WebhookClient({
          id: process.env.MEMBER_VOICE_DISCONNECT_WEBHOOK_ID,
          token: process.env.MEMBER_VOICE_DISCONNECT_WEBHOOK_TOKEN,
        });

        embed.setAuthor({
          name: 'Member Disconnected from Voice Channel',
          iconURL: newState.member.displayAvatarURL({ dynamic: true }),
        });
        embed.setDescription(
          `${newState.member} has disconnected from ${oldState.channel} by ${disconnectLog.executor}.`,
        );
        embed.setFields([
          {
            name: '🕒 Disconnected At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
        ]);

        return VoiceDisconnectLogger.send({ embeds: [embed] }).catch(
          console.error,
        );
      }

      const VoiceLeaveLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Left from Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${newState.member} has left from ${oldState.channel}.`,
      );
      embed.setFields([
        {
          name: '🕒 Left At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
      ]);

      return VoiceLeaveLogger.send({ embeds: [embed] }).catch(console.error);
    }

    // If the member being moved by a moderator
    if (oldState.channel !== newState.channel) {
      const moveLog = await newState.guild
        .fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberMove,
        })
        .then((audit) => audit.entries.first());

      const diff = Math.abs(
        (new Date().getTime() - moveLog.createdAt.getTime()) / 1000,
      );

      if (diff <= 5) {
        const VoiceMoveLogger = new WebhookClient({
          id: process.env.MEMBER_VOICE_MOVE_WEBHOOK_ID,
          token: process.env.MEMBER_VOICE_MOVE_WEBHOOK_TOKEN,
        });

        embed.setAuthor({
          name: 'Member Moved from Voice Channel',
          iconURL: newState.member.displayAvatarURL({ dynamic: true }),
        });
        embed.setDescription(
          `${newState.member} has been moved from ${oldState.channel} to ${newState.channel} by ${moveLog.executor}.`,
        );
        embed.setFields([
          {
            name: '🕒 Moved At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          {
            name: '📄 Reason',
            value: moveLog.reason ?? 'No reason',
          },
        ]);

        return VoiceMoveLogger.send({ embeds: [embed] }).catch(console.error);
      }
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
        name: 'Member Muted from Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has been muted from text channels by ${muteLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Muted At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '📄 Reason',
          value: muteLog.reason ?? 'No reason',
        },
      ]);

      return VoiceMuteLogger.send({ embeds: [embed] }).catch(console.error);
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
        name: 'Member Unmuted from Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${newState.member} has been unmuted from text channels by ${unmuteLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Unmuted At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '📄 Reason',
          value: unmuteLog.reason ?? 'No reason',
        },
      ]);

      return VoiceUnmuteLogger.send({ embeds: [embed] }).catch(console.error);
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
        name: 'Member Deafened from Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has been deafen from ${newState.channel} by ${deafenLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Deafened At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '📄 Reason',
          value: deafenLog.reason ?? 'No reason',
        },
      ]);

      return VoiceDeafenLogger.send({ embeds: [embed] }).catch(console.error);
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
        name: 'Member Undeafened from Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} has been undeafen from ${newState.channel} by ${deafenLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Undeafened At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
        {
          name: '📄 Reason',
          value: deafenLog.reason ?? 'No reason',
        },
      ]);

      return VoiceDeafenLogger.send({ embeds: [embed] }).catch(console.error);
    }

    // IF the member is streaming using "Screen Share"
    if (!oldState.streaming && newState.streaming) {
      const VoiceStreamLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_STREAM_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_STREAM_WEBHOOK_TOKEN,
      });

      embed.setAuthor({
        name: 'Member Streaming in Voice Channel',
        iconURL: newState.member.displayAvatarURL({ dynamic: true }),
      });
      embed.setDescription(
        `${oldState.member} is streaming in ${newState.channel}.`,
      );
      embed.setFields([
        {
          name: '🕒 Streaming At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
        },
      ]);

      return VoiceStreamLogger.send({ embeds: [embed] }).catch(console.error);
    }
  },
};
