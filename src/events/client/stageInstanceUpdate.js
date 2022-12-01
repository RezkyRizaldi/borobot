const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  italic,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');
const { applyStagePrivacyLevel } = require('../../utils');

module.exports = {
  name: Events.StageInstanceUpdate,

  /**
   *
   * @param {import('discord.js').StageInstance} oldStage
   * @param {import('discord.js').StageInstance} newStage
   */
  async execute(oldStage, newStage) {
    const { client, guild } = oldStage;

    if (!guild) return;

    const StageLogger = new WebhookClient({
      id: process.env.CHANNEL_STAGE_WEBHOOK_ID,
      token: process.env.CHANNEL_STAGE_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.StageInstanceUpdate,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setAuthor({ name: '🎤 Stage Channel Edited' });

    if (oldStage.channel.name !== newStage.channel.name) {
      embed
        .setDescription(
          `${oldStage.channel} stage channel's name was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
          { name: '🕒 Before', value: oldStage.channel.name, inline: true },
          { name: '🕒 After', value: newStage.channel.name, inline: true },
          {
            name: '🕒 Edited At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
          },
          { name: '📄 Reason', value: editLog.reason ?? 'No reason' },
        ]);

      await StageLogger.send({ embeds: [embed] });
    }

    if (oldStage.topic !== newStage.topic) {
      embed
        .setDescription(
          `${oldStage.channel} stage channel's topic was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
          {
            name: '🕒 Before',
            value: oldStage.topic ?? italic('None'),
            inline: true,
          },
          {
            name: '🕒 After',
            value: newStage.topic ?? italic('None'),
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

      await StageLogger.send({ embeds: [embed] });
    }

    if (oldStage.privacyLevel !== newStage.privacyLevel) {
      embed
        .setDescription(
          `${oldStage.channel} stage channel's topic was ${bold('edited')} by ${
            editLog.executor
          }.`,
        )
        .setFields([
          {
            name: '🕒 Before',
            value: applyStagePrivacyLevel(oldStage.privacyLevel),
            inline: true,
          },
          {
            name: '🕒 After',
            value: applyStagePrivacyLevel(newStage.privacyLevel),
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

      await StageLogger.send({ embeds: [embed] });
    }
  },
};
