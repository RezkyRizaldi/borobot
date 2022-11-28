const {
  AuditLogEvent,
  bold,
  channelMention,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  userMention,
  WebhookClient,
} = require('discord.js');
const pluralize = require('pluralize');

const {
  applyMessageType,
  groupMessageByAuthor,
  groupMessageByType,
  truncate,
} = require('../../utils');

module.exports = {
  name: Events.MessageBulkDelete,

  /**
   *
   * @param {import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>} messages
   */
  async execute(messages) {
    const MessageLogger = new WebhookClient({
      id: process.env.MESSAGE_DELETE_WEBHOOK_ID,
      token: process.env.MESSAGE_DELETE_WEBHOOK_TOKEN,
    });

    if (!messages.first().guild) return;

    const embed = new EmbedBuilder()
      .setColor(messages.first().guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: messages.first().client.user.username,
        iconURL: messages
          .first()
          .client.user.displayAvatarURL({ dynamic: true }),
      });

    if (messages.first().partial || !messages.first().author) {
      embed
        .setAuthor({ name: '❌ Messages Deleted' })
        .setDescription(
          `${messages.size.toLocaleString()} messages was ${bold(
            'deleted',
          )} in ${messages.first().channel} at ${time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          )}.`,
        );

      return MessageLogger.send({ embeds: [embed] });
    }

    const bulkDeleteLog = await messages
      .first()
      .guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageBulkDelete,
      })
      .then((audit) => audit.entries.first());

    if (
      !messages.every(
        (message) => message.author.id === messages.first().author.id,
      )
    ) {
      const groupedMessages = groupMessageByType(
        groupMessageByAuthor(messages),
      );

      const response = `${groupedMessages
        .flatMap(
          (arrMessage) =>
            `${arrMessage
              .reduce((acc, curr) => acc + curr.length, 0)
              .toLocaleString()} ${pluralize(
              'message',
              arrMessage.reduce((acc, curr) => acc + curr.length, 0),
            )} from ${userMention(arrMessage[0][0].author.id)} was ${bold(
              'deleted',
            )} by ${bulkDeleteLog.executor} in ${channelMention(
              arrMessage[0][0].channel.id,
            )} at ${time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            )}.`,
        )
        .join('\n')}\n\n${bold('Deleted Messages')}\n${groupedMessages
        .flatMap(
          (arrMessage) =>
            `from ${userMention(arrMessage[0][0].author.id)}\n${arrMessage
              .map((msgs) =>
                msgs.map((message) => applyMessageType(message)).join('\n'),
              )
              .join('\n')}`,
        )
        .join('\n\n')}`;

      embed.setAuthor({ name: '❌ Messages Deleted' }).setDescription(response);

      if (response.length > 4096) {
        embed.setDescription(response.slice(0, 4096));

        const secondEmbed = new EmbedBuilder().setDescription(
          response.slice(4096, response.length),
        );

        return MessageLogger.send({ embeds: [embed, secondEmbed] });
      }

      return MessageLogger.send({ embeds: [embed] });
    }

    const response = `${messages.size.toLocaleString()} messages from ${
      messages.first().author
    } was ${bold('deleted')} by ${bulkDeleteLog.executor} in ${
      messages.first().channel
    } at ${time(
      Math.floor(Date.now() / 1000),
      TimestampStyles.RelativeTime,
    )}.\n\n${bold('Deleted Messages')}\n${messages
      .map((message) => applyMessageType(message))
      .join('\n')}`;

    embed
      .setAuthor({
        name: 'Messages Deleted',
        iconURL: messages.first().author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(truncate(response, 4096));

    return MessageLogger.send({ embeds: [embed] });
  },
};
