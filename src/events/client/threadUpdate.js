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

const { applyThreadAutoArchiveDuration } = require('../../utils');

module.exports = {
  name: Events.ThreadUpdate,

  /**
   *
   * @param {import('discord.js').ThreadChannel} oldThread
   * @param {import('discord.js').ThreadChannel} newThread
   */
  async execute(oldThread, newThread) {
    const { client, guild } = oldThread;

    const ThreadLogger = new WebhookClient({
      id: process.env.CHANNEL_THREAD_WEBHOOK_ID,
      token: process.env.CHANNEL_THREAD_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ThreadUpdate,
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
        name: '💭 Thread Channel Edited',
      });

    if (oldThread.name !== newThread.name) {
      embed.setDescription(
        `${oldThread} thread channel's name was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldThread.name,
          inline: true,
        },
        {
          name: '🕒 After',
          value: newThread.name,
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

      return ThreadLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldThread.archived !== newThread.archived) {
      embed.setDescription(
        `${oldThread} thread channel was ${bold(
          newThread.archived ? 'closed' : 'opened',
        )} by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: `🕒 ${newThread.archived ? 'Closed' : 'Opened'} At`,
          value: newThread.archived
            ? time(newThread.archivedAt, TimestampStyles.RelativeTime)
            : time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime),
        },
        {
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);

      await ThreadLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldThread.locked !== newThread.locked) {
      embed.setDescription(
        `${oldThread} thread channel was ${bold(
          newThread.locked ? 'locked' : 'unlocked',
        )} by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: `🕒 ${newThread.locked ? 'Locked' : 'Unlocked'} At`,
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

      await ThreadLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldThread.parentId !== newThread.parentId) {
      embed.setDescription(
        `${oldThread} thread channel's category was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldThread.parent ?? italic('None'),
          inline: true,
        },
        {
          name: '🕒 After',
          value: newThread.parent ?? italic('None'),
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

      return ThreadLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
      embed.setDescription(
        `${oldThread} thread channel's slowmode was ${bold(
          `turned ${newThread.rateLimitPerUser ? 'on' : 'off'}`,
        )} by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: `🕒 Turned ${newThread.rateLimitPerUser ? 'On' : 'Off'} At`,
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

      return ThreadLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
      embed.setDescription(
        `${oldThread} thread channel's auto-closed duration was ${bold(
          'edited',
        )} by ${editLog.executor}.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: `After ${inlineCode(
            applyThreadAutoArchiveDuration(oldThread.autoArchiveDuration),
          )}`,
          inline: true,
        },
        {
          name: '🕒 After',
          value: `After ${inlineCode(
            applyThreadAutoArchiveDuration(newThread.autoArchiveDuration),
          )}`,
          inline: true,
        },
        {
          name: '📄 Reason',
          value: editLog.reason ?? 'No reason',
        },
      ]);

      return ThreadLogger.send({ embeds: [embed] }).catch(console.error);
    }
  },
};
