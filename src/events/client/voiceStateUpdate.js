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
    if (oldState.member?.user.bot || newState.member?.user.bot) return;

    const embed = new EmbedBuilder()
      .setFooter({
        text: newState.client.user.username,
        iconURL: newState.client.user.displayAvatarURL(),
      })
      .setTimestamp(Date.now())
      .setColor(newState.member?.displayHexColor ?? null);

    // If the member join to a voice channel
    if (!oldState.channel && newState.channel) {
      const VoiceJoinLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_JOIN_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_JOIN_WEBHOOK_TOKEN,
      });

      embed
        .setAuthor({
          name: 'Member Joined Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(`${oldState.member} has joined to ${newState.channel}.`)
        .setFields([
          {
            name: '🕒 Joined At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
        ]);

      await VoiceJoinLogger.send({ embeds: [embed] });
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

        embed
          .setAuthor({
            name: 'Member Disconnected from Voice Channel',
            iconURL: newState.member.displayAvatarURL(),
          })
          .setDescription(
            `${newState.member} has disconnected from ${oldState.channel} by ${disconnectLog.executor}.`,
          )
          .setFields([
            {
              name: '🕒 Disconnected At',
              value: time(
                Math.floor(Date.now() / 1000),
                TimestampStyles.RelativeTime,
              ),
            },
            { name: '📄 Reason', value: disconnectLog.reason ?? 'No reason' },
          ]);

        await VoiceDisconnectLogger.send({ embeds: [embed] });
      }

      const VoiceLeaveLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_TOKEN,
      });

      embed
        .setAuthor({
          name: 'Member Left from Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(`${newState.member} has left from ${oldState.channel}.`)
        .setFields([
          {
            name: '🕒 Left At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: disconnectLog.reason ?? 'No reason' },
        ]);

      await VoiceLeaveLogger.send({ embeds: [embed] });
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

        embed
          .setAuthor({
            name: 'Member Moved from Voice Channel',
            iconURL: newState.member.displayAvatarURL(),
          })
          .setDescription(
            `${newState.member} has been moved from ${oldState.channel} to ${newState.channel} by ${moveLog.executor}.`,
          )
          .setFields([
            {
              name: '🕒 Moved At',
              value: time(
                Math.floor(Date.now() / 1000),
                TimestampStyles.RelativeTime,
              ),
            },
            { name: '📄 Reason', value: moveLog.reason ?? 'No reason' },
          ]);

        await VoiceMoveLogger.send({ embeds: [embed] });
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

      embed
        .setAuthor({
          name: 'Member Muted from Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(
          `${oldState.member} has been muted from text channels by ${muteLog.executor}.`,
        )
        .setFields([
          {
            name: '🕒 Muted At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: muteLog.reason ?? 'No reason' },
        ]);

      await VoiceMuteLogger.send({ embeds: [embed] });
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

      embed
        .setAuthor({
          name: 'Member Unmuted from Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(
          `${newState.member} has been unmuted from text channels by ${unmuteLog.executor}.`,
        )
        .setFields([
          {
            name: '🕒 Unmuted At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: unmuteLog.reason ?? 'No reason' },
        ]);

      await VoiceUnmuteLogger.send({ embeds: [embed] });
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

      embed
        .setAuthor({
          name: 'Member Deafened from Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(
          `${oldState.member} has been deafen from ${newState.channel} by ${deafenLog.executor}.`,
        )
        .setFields([
          {
            name: '🕒 Deafened At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: deafenLog.reason ?? 'No reason' },
        ]);

      await VoiceDeafenLogger.send({ embeds: [embed] });
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

      embed
        .setAuthor({
          name: 'Member Undeafened from Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(
          `${oldState.member} has been undeafen from ${newState.channel} by ${deafenLog.executor}.`,
        )
        .setFields([
          {
            name: '🕒 Undeafened At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: deafenLog.reason ?? 'No reason' },
        ]);

      await VoiceDeafenLogger.send({ embeds: [embed] });
    }

    // IF the member is streaming using "Screen Share"
    if (!oldState.streaming && newState.streaming) {
      const VoiceStreamLogger = new WebhookClient({
        id: process.env.MEMBER_VOICE_STREAM_WEBHOOK_ID,
        token: process.env.MEMBER_VOICE_STREAM_WEBHOOK_TOKEN,
      });

      embed
        .setAuthor({
          name: 'Member Streaming in Voice Channel',
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(
          `${oldState.member} is streaming in ${newState.channel}.`,
        )
        .setFields([
          {
            name: '🕒 Streaming At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
        ]);

      await VoiceStreamLogger.send({ embeds: [embed] });
    }
  },
};
