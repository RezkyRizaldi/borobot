const {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildBanRemove,

  /**
   *
   * @param {import('discord.js').GuildBan} ban
   */
  async execute(ban) {
    const UnbanLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_UNBAN_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_UNBAN_WEBHOOK_TOKEN,
    });

    const UnbanLog = await ban.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanRemove,
      })
      .then((audit) => audit.entries.first());

    const botColor = await ban.guild.members
      .fetch(ban.client.user.id)
      .then((res) => res.displayHexColor);

    const message = new EmbedBuilder()
      .setDescription(
        `${ban.user.tag} has been unbanned by ${UnbanLog.executor}`,
      )
      .setColor(botColor || 0xfcc9b9)
      .setAuthor({
        name: 'Member Unbanned',
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
          name: '🕒 Unbanned At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        {
          name: '📄 Reason',
          value: UnbanLog.reason || 'No reason',
        },
      ]);

    if (UnbanLog.target.id === ban.user.id) {
      return UnbanLogger.send({ embeds: [message] }).catch((err) =>
        console.error(err),
      );
    }
  },
};
