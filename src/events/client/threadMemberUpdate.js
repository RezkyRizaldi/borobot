const {
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.ThreadMemberUpdate,

  /**
   *
   * @param {import('discord.js').ThreadMember} oldMember
   * @param {import('discord.js').ThreadMember} newMember
   */
  async execute(oldMember, newMember) {
    const { client, guildMember } = oldMember;

    const ThreadLogger = new WebhookClient({
      id: process.env.CHANNEL_THREAD_WEBHOOK_ID,
      token: process.env.CHANNEL_THREAD_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setColor(guildMember?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });

    if (!oldMember.thread && newMember.thread) {
      embed
        .setAuthor({ name: '💭 Bot Joined Thread Channel' })
        .setDescription(
          `${oldMember} was ${bold('joined')} ${
            newMember.thread
          } thread channel.`,
        )
        .setFields([
          {
            name: '🕒 Joined At',
            value: time(newMember.joinedAt, TimestampStyles.RelativeTime),
            inline: true,
          },
        ]);

      await ThreadLogger.send({ embeds: [embed] });
    }

    if (oldMember.thread && !newMember.thread) {
      embed
        .setAuthor({ name: '💭 Bot Left Thread Channel' })
        .setDescription(
          `${oldMember} was ${bold('left')} ${
            oldMember.thread
          } thread channel.`,
        )
        .setFields([
          {
            name: '🕒 Left At',
            value: time(
              Math.floor(Date.now() / 1000),
              TimestampStyles.RelativeTime,
            ),
            inline: true,
          },
        ]);

      await ThreadLogger.send({ embeds: [embed] });
    }
  },
};
