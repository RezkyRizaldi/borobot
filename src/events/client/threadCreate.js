const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  inlineCode,
  time,
  TimestampStyles,
  userMention,
  WebhookClient,
} = require('discord.js');

const { applyThreadAutoArchiveDuration } = require('@/utils');

module.exports = {
  name: Events.ThreadCreate,

  /**
   *
   * @param {import('discord.js').ThreadChannel} thread
   * @param {Boolean} newlyCreated
   */
  async execute(thread, newlyCreated) {
    const { client, guild } = thread;

    const ThreadLogger = new WebhookClient({
      id: process.env.CHANNEL_THREAD_WEBHOOK_ID,
      token: process.env.CHANNEL_THREAD_WEBHOOK_TOKEN,
    });

    const createLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ThreadCreate,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setAuthor({
        name: `💭 ${newlyCreated ? 'New' : ''} Thread Channel Created`,
      })
      .setDescription(
        `${thread} thread channel was ${bold('created')} ${
          thread.parent ? `in ${thread.parent}` : ''
        } ${
          thread.ownerId ? `by ${userMention(thread.ownerId)}` : ''
        } for ${inlineCode(
          applyThreadAutoArchiveDuration(thread.autoArchiveDuration),
        )} inactivity duration.`,
      )
      .setFields([
        { name: '🔤 Name', value: thread.name, inline: true },
        {
          name: '🕒 Created At',
          value: time(thread.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        { name: '📄 Reason', value: createLog.reason ?? 'No reason' },
      ]);

    return ThreadLogger.send({ embeds: [embed] });
  },
};
