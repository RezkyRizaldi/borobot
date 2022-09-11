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
    const { user, guild } = member;

    const WelcomeLogger = new WebhookClient({
      id: process.env.MEMBER_GUILD_WELCOME_WEBHOOK_ID,
      token: process.env.MEMBER_GUILD_WELCOME_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setTitle(`👋 Welcome to ${guild.name}`)
      .setDescription(`hope you enjoy here, ${member}!`)
      .setColor(guild.members.me.displayHexColor)
      .setFooter({
        text: member.client.user.username,
        iconURL: member.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now());

    await member.send({ embeds: [embed] }).catch((err) => console.error(err));

    await member.roles
      .add(process.env.MEMBER_ROLE_ID)
      .then(async (m) => {
        embed.setColor(m.displayHexColor || 0xfcc9b9);
        embed.setThumbnail(user.displayAvatarURL({ dynamic: true }));
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
