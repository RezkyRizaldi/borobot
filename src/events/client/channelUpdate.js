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

module.exports = {
  name: Events.ChannelUpdate,

  /**
   *
   * @param {import('discord.js').GuildChannel} oldChannel
   * @param {import('discord.js').GuildChannel} newChannel
   */
  async execute(oldChannel, newChannel) {
    const { client, guild } = oldChannel;

    const ChannelLogger = new WebhookClient({
      id: process.env.CHANNEL_EDIT_WEBHOOK_ID,
      token: process.env.CHANNEL_EDIT_WEBHOOK_TOKEN,
    });

    const editLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelUpdate,
      })
      .then((audit) => audit.entries.first());

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '#️⃣ Channel Edited',
      });

    if (oldChannel.name !== newChannel.name) {
      embed.setDescription(
        `${oldChannel} channel's name was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldChannel.name,
          inline: true,
        },
        {
          name: '🕒 After',
          value: newChannel.name,
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      embed.setDescription(
        `${oldChannel} channel's nsfw state was ${bold(
          `turned ${newChannel.nsfw ? 'on' : 'off'}`,
        )} by ${editLog.executor}.`,
      );
      embed.setFields([
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.parent !== newChannel.parent) {
      embed.setDescription(
        `${oldChannel} channel's category was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldChannel.parent ?? italic('None'),
          inline: true,
        },
        {
          name: '🕒 After',
          value: newChannel.parent ?? italic('None'),
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }

    if (oldChannel.topic !== newChannel.topic) {
      embed.setDescription(
        `${oldChannel} channel's topic was ${bold('edited')} by ${
          editLog.executor
        }.`,
      );
      embed.setFields([
        {
          name: '🕒 Before',
          value: oldChannel.topic ?? italic('None'),
          inline: true,
        },
        {
          name: '🕒 After',
          value: newChannel.topic ?? italic('None'),
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

      return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
    }
  },
};
