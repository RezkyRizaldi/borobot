const {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildBanAdd,

  /**
   *
   * @param {import('discord.js').GuildBan} ban
   */
  async execute(ban) {
    const { client, guild, user } = ban;

    const BanLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_BAN_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_BAN_WEBHOOK_TOKEN,
    });

    const banLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
      })
      .then((audit) => audit.entries.first());

    const message = new EmbedBuilder()
      .setDescription(`${user.tag} has been banned by ${banLog.executor}.`)
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setAuthor({
        name: 'Member Banned',
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setFields([
        {
          name: '🆔 Member ID',
          value: user.id,
          inline: true,
        },
        {
          name: '🕒 Banned At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        {
          name: '📄 Reason',
          value: banLog.reason ?? 'No reason',
        },
      ]);

    if (banLog.target.id === user.id) {
      return BanLogger.send({ embeds: [message] }).catch(console.error);
    }
  },
};
