const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

const { applyMessageType } = require('../../utils');

module.exports = {
  name: Events.MessageDelete,

  /**
   *
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    const botColor = await message.guild.members
      .fetch(message.client.user.id)
      .then((res) => res.displayHexColor);

    const MessageLogger = new WebhookClient({
      id: process.env.MESSAGE_DELETE_WEBHOOK_ID,
      token: process.env.MESSAGE_DELETE_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setColor(botColor || 0xfcc9b9)
      .setTimestamp(Date.now())
      .setFooter({
        text: message.client.user.username,
        iconURL: message.client.user.displayAvatarURL({ dynamic: true }),
      });

    if (!message.guild) return;

    if (message.partial || !message.author) {
      embed.setAuthor({
        name: '❌ Message Deleted',
      });
      embed.setDescription(
        `A message was ${bold('deleted')} in ${message.channel} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );

      return MessageLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    const deleteLog = await message.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
      })
      .then((audit) => audit.entries.first());

    const response = `A message from ${message.author} was ${bold(
      'deleted',
    )} by ${deleteLog.executor} in ${message.channel} at ${time(
      Math.floor(Date.now() / 1000),
      TimestampStyles.RelativeTime,
    )}\n${bold('Deleted Message')}\n${applyMessageType(message)}`;

    embed.setAuthor({
      name: 'Message Deleted',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    });
    embed.setDescription(response);

    if (response.length > 4096) {
      embed.setDescription(response.slice(0, 4096));

      const secondEmbed = new EmbedBuilder().setDescription(
        response.slice(4096, response.length),
      );

      return MessageLogger.send({ embeds: [embed, secondEmbed] }).catch((err) =>
        console.error(err),
      );
    }

    await MessageLogger.send({ embeds: [embed] }).catch((err) =>
      console.error(err),
    );
  },
};
