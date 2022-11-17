const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

const { applyStagePrivacyLevel } = require('../../utils');

module.exports = {
  name: Events.StageInstanceCreate,

  /**
   *
   * @param {import('discord.js').StageInstance} stage
   */
  async execute(stage) {
    const { channel, client, guild } = stage;

    const StageLogger = new WebhookClient({
      id: process.env.CHANNEL_STAGE_WEBHOOK_ID,
      token: process.env.CHANNEL_STAGE_WEBHOOK_TOKEN,
    });

    const createLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.StageInstanceCreate,
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
        name: '🎤 New Stage Channel Created',
      })
      .setDescription(
        `${channel} stage channel was ${bold('created')} ${
          channel.parent ? `in ${channel.parent}` : ''
        } by ${createLog.executor}.`,
      )
      .setFields([
        {
          name: '🔤 Name',
          value: channel.name,
          inline: true,
        },
        {
          name: '🔏 Privacy Level',
          value: applyStagePrivacyLevel(stage.privacyLevel),
          inline: true,
        },
        {
          name: '🕒 Created At',
          value: time(channel.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '📄 Reason',
          value: createLog.reason ?? 'No reason',
        },
      ]);

    await StageLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
