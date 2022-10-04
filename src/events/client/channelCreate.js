const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  WebhookClient,
  time,
  TimestampStyles,
} = require('discord.js');

const { channelType } = require('../../constants');

module.exports = {
  name: Events.ChannelCreate,

  /**
   *
   * @param {import('discord.js').GuildChannel} channel
   */
  async execute(channel) {
    const { client, guild } = channel;

    const ChannelLogger = new WebhookClient({
      id: process.env.CHANNEL_CREATE_WEBHOOK_ID,
      token: process.env.CHANNEL_CREATE_WEBHOOK_TOKEN,
    });

    const createLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelCreate,
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
        name: '#️⃣ New Channel Created',
      })
      .setDescription(
        `${channel} channel was ${bold('created')} ${
          channel.parent ? `in ${channel.parent}` : ''
        } by ${createLog.executor}.`,
      )
      .setFields([
        {
          name: 'Name',
          value: channel.name,
          inline: true,
        },
        {
          name: '🔣 Type',
          value: channelType.find((type) => channel.type === type.value).name,
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

    return ChannelLogger.send({ embeds: [embed] }).catch(console.error);
  },
};
