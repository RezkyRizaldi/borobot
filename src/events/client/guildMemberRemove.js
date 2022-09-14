const {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.GuildMemberRemove,

  /**
   *
   * @param {import('discord.js').GuildMember} member
   */
  async execute(member) {
    const { user, guild } = member;

    // If the member leave the server
    const LeaveLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_LEAVE_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_LEAVE_WEBHOOK_TOKEN,
    });

    const leaveMessage = new EmbedBuilder()
      .setTitle(`🖐️ Goodbye. Thanks for being with ${guild.name}`)
      .setDescription(`It's been a long time, ${member}!`)
      .setColor(member.displayHexColor)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: member.client.user.tag,
        iconURL: member.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setFields([
        {
          name: '🆔 Member ID',
          value: user.id,
          inline: true,
        },
        {
          name: '📆 Member Since',
          value: time(member.joinedAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '🕒 Left At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
      ]);

    await LeaveLogger.send({ embeds: [leaveMessage] }).catch((err) =>
      console.error(err),
    );

    // If the member kicked by a moderator
    const KickLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_KICK_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_KICK_WEBHOOK_TOKEN,
    });

    const kickLog = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick,
      })
      .then((audit) => audit.entries.first());

    const kickMessage = new EmbedBuilder()
      .setDescription(`${member} has been kicked out by ${kickLog.executor}`)
      .setColor(member.displayHexColor)
      .setAuthor({
        name: 'Member Kicked',
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: member.client.user.tag,
        iconURL: member.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setFields([
        {
          name: '🆔 Member ID',
          value: user.id,
          inline: true,
        },
        {
          name: '📆 Member Since',
          value: time(member.joinedAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '🕒 Kicked At',
          value: time(
            Math.floor(Date.now() / 1000),
            TimestampStyles.RelativeTime,
          ),
          inline: true,
        },
        {
          name: '📄 Reason',
          value: kickLog.reason ?? 'No reason',
        },
      ]);

    if (kickLog.target.id === user.id) {
      return KickLogger.send({ embeds: [kickMessage] }).catch((err) =>
        console.error(err),
      );
    }
  },
};
