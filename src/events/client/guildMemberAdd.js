const {
  AuditLogEvent,
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');
const ordinal = require('ordinal');

module.exports = {
  name: Events.GuildMemberAdd,

  /**
   *
   * @param {import('discord.js').GuildMember} member
   */
  async execute(member) {
    const { client, guild, user } = member;

    const WelcomeLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_WELCOME_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_WELCOME_WEBHOOK_TOKEN,
    });

    const botRole = guild.roles.cache.find(
      (role) => role.id === process.env.BOT_ROLE_ID,
    );

    const memberRole = guild.roles.cache.find(
      (role) => role.id === process.env.MEMBER_ROLE_ID,
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `👋 Welcome to ${guild}`,
      })
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now());

    if (!user.bot) {
      await member.send({ embeds: [embed] }).catch(console.error);
    }

    await member.roles
      .add(!user.bot ? memberRole : botRole)
      .then(async (m) => {
        if (!m.user.bot) {
          embed.setDescription(
            `hope you enjoy here, ${m}! You're the ${ordinal(
              guild.memberCount,
            )} member in ${guild}.`,
          );
          embed.setColor(m.displayHexColor);
          embed.setThumbnail(m.displayAvatarURL({ dynamic: true }));
          embed.setFields([
            {
              name: '🆔 Member ID',
              value: m.user.id,
              inline: true,
            },
            {
              name: '🎊 Account Created',
              value: time(m.user.createdAt, TimestampStyles.RelativeTime),
              inline: true,
            },
            {
              name: '📆 Joined At',
              value: time(m.joinedAt, TimestampStyles.RelativeTime),
              inline: true,
            },
          ]);

          return WelcomeLogger.send({ embeds: [embed] });
        }

        const botLog = await guild
          .fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd,
          })
          .then((audit) => audit.entries.first());

        embed.setDescription(
          `${m} bot was ${bold('added')} by ${botLog.executor}.`,
        );
        embed.setColor(m.displayHexColor);
        embed.setThumbnail(m.displayAvatarURL({ dynamic: true }));
        embed.setFields([
          {
            name: '🆔 Bot ID',
            value: m.user.id,
            inline: true,
          },
          {
            name: '🎊 Account Created',
            value: time(m.user.createdAt, TimestampStyles.RelativeTime),
            inline: true,
          },
          {
            name: '📆 Added At',
            value: time(m.joinedAt, TimestampStyles.RelativeTime),
            inline: true,
          },
        ]);

        await WelcomeLogger.send({ embeds: [embed] });
      })
      .catch(console.error);
  },
};
