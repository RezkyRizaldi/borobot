const {
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

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

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `👋 Welcome to ${guild}`,
      })
      .setDescription(`hope you enjoy here, ${member}!`)
      .setColor(guild.members.me.displayHexColor)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now());

    await member.send({ embeds: [embed] }).catch((err) => console.error(err));

    if (user.bot) {
      const botRole = guild.roles.cache.find(
        (role) => role.id === process.env.BOT_ROLE_ID,
      );

      return member.roles
        .add(botRole)
        .then(async (m) => {
          embed.setColor(m.displayHexColor);
          embed.setThumbnail(member.displayAvatarURL({ dynamic: true }));
          embed.setFields([
            {
              name: '🆔 Member ID',
              value: user.id,
              inline: true,
            },
            {
              name: '🎊 Account Created',
              value: time(user.createdAt, TimestampStyles.RelativeTime),
              inline: true,
            },
            {
              name: '📆 Joined At',
              value: time(m.joinedAt, TimestampStyles.RelativeTime),
              inline: true,
            },
          ]);

          await WelcomeLogger.send({ embeds: [embed] });
        })
        .catch((err) => console.error(err));
    }

    const memberRole = guild.roles.cache.find(
      (role) => role.id === process.env.MEMBER_ROLE_ID,
    );

    await member.roles
      .add(memberRole)
      .then(async (m) => {
        embed.setColor(m.displayHexColor);
        embed.setThumbnail(member.displayAvatarURL({ dynamic: true }));
        embed.setFields([
          {
            name: '🆔 Member ID',
            value: user.id,
            inline: true,
          },
          {
            name: '🎊 Account Created',
            value: time(user.createdAt, TimestampStyles.RelativeTime),
            inline: true,
          },
          {
            name: '📆 Joined At',
            value: time(m.joinedAt, TimestampStyles.RelativeTime),
            inline: true,
          },
        ]);

        await WelcomeLogger.send({ embeds: [embed] });
      })
      .catch((err) => console.error(err));
  },
};
