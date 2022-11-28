const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

const { channelType } = require('../../constants');

module.exports = {
  name: Events.ChannelDelete,

  /**
   *
   * @param {import('discord.js').GuildChannel} channel
   */
  async execute(channel) {
    const { client, guild } = channel;

    const ChannelLogger = new WebhookClient({
      id: process.env.CHANNEL_DELETE_WEBHOOK_ID,
      token: process.env.CHANNEL_DELETE_WEBHOOK_TOKEN,
    });

    const deleteLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete,
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
        name: `${
          channelType.find((type) => channel.type === type.value).name
        } Channel Deleted`,
      })
      .setDescription(
        `A channel ${channel.parent ? `in ${channel.parent}` : ''} was ${bold(
          'deleted',
        )} by ${deleteLog.executor}.`,
      )
      .setFields([
        { name: '🔤 Name', value: channel.name, inline: true },
        {
          name: '🕒 Created At',
          value: time(channel.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '🕒 Deleted At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        { name: '📄 Reason', value: deleteLog.reason ?? 'No reason' },
      ]);

    return ChannelLogger.send({ embeds: [embed] });
  },
};
