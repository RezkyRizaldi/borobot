const {
  bold,
  EmbedBuilder,
  Events,
  hyperlink,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

const { applyMessageType } = require('../../utils');

module.exports = {
  name: Events.MessageUpdate,

  /**
   *
   * @param {import('discord.js').Message} oldMessage
   * @param {import('discord.js').Message} newMessage
   */
  async execute(oldMessage, newMessage) {
    const MessageLogger = new WebhookClient({
      id: process.env.MESSAGE_EDIT_WEBHOOK_ID,
      token: process.env.MESSAGE_EDIT_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setColor(oldMessage.guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: oldMessage.client.user.username,
        iconURL: oldMessage.client.user.displayAvatarURL({ dynamic: true }),
      });

    if (!oldMessage.guild) return;

    if (oldMessage.partial || !oldMessage.author) {
      embed.setAuthor({
        name: '✏️ Message Edited',
      });
      embed.setDescription(
        `A message was ${bold('edited')} in ${oldMessage.channel} at ${time(
          Math.floor(Date.now() / 1000),
          TimestampStyles.RelativeTime,
        )}`,
      );

      return MessageLogger.send({ embeds: [embed] }).catch((err) =>
        console.error(err),
      );
    }

    if (oldMessage.author.bot) return;

    if (oldMessage.author.id === oldMessage.client.user.id) return;

    if (oldMessage.cleanContent === newMessage.cleanContent) return;

    embed.setAuthor({
      name: 'Message Edited',
      iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }),
    });
    embed.setDescription(
      `A ${hyperlink(
        'message',
        newMessage.url,
        'Click here to jump to message',
      )} by ${newMessage.author} was ${bold('edited')} in ${
        newMessage.channel
      } at ${time(newMessage.editedAt, TimestampStyles.RelativeTime)}`,
    );

    embed.setFields(
      {
        name: 'Before',
        value: applyMessageType(oldMessage),
      },
      {
        name: 'After',
        value: applyMessageType(newMessage, true),
      },
    );

    await MessageLogger.send({ embeds: [embed] }).catch((err) =>
      console.error(err),
    );
  },
};
