const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');
const truncate = require('truncate');

const { applyMessageType } = require('../../utils');

module.exports = {
  name: Events.MessageDelete,

  /**
   *
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    const { author, channel, client, guild } = message;

    const MessageLogger = new WebhookClient({
      id: process.env.MESSAGE_DELETE_WEBHOOK_ID,
      token: process.env.MESSAGE_DELETE_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    if (!guild) return;

    if (message.partial || !author) {
      embed.setAuthor({
        name: '❌ Message Deleted',
      });
      embed.setDescription(
        `A message was ${bold('deleted')} in ${channel} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}.`,
      );

      return MessageLogger.send({ embeds: [embed] }).catch(console.error);
    }

    const deleteLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
      })
      .then((audit) => audit.entries.first());

    const response = `A message from ${author} was ${bold('deleted')} by ${
      deleteLog.executor
    } in ${channel} at ${time(
      Math.floor(Date.now() / 1000),
      TimestampStyles.RelativeTime,
    )}.\n\n${bold('Deleted Message')}\n${applyMessageType(message)}`;

    embed.setAuthor({
      name: 'Message Deleted',
      iconURL: author.displayAvatarURL({ dynamic: true }),
    });
    embed.setDescription(truncate(response, 4096 - 3));

    await MessageLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
