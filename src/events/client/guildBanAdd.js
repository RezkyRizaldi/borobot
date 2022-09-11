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
    const BanLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_BAN_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_BAN_WEBHOOK_TOKEN,
    });

    const banLog = await ban.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
      })
      .then((audit) => audit.entries.first());

    const message = new EmbedBuilder()
      .setDescription(`${ban.user.tag} has been banned by ${banLog.executor}`)
      .setColor(ban.guild.members.me.displayHexColor)
      .setAuthor({
        name: 'Member Banned',
        iconURL: ban.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: ban.client.user.tag,
        iconURL: ban.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setFields([
        {
          name: '🆔 Member ID',
          value: ban.user.id,
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
          value: banLog.reason || 'No reason',
        },
      ]);

    if (banLog.target.id === ban.user.id) {
      return BanLogger.send({ embeds: [message] }).catch((err) =>
        console.error(err),
      );
    }
  },
};
