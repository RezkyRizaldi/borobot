const {
  bold,
  EmbedBuilder,
  Events,
  time,
  TimestampStyles,
  WebhookClient,
} = require('discord.js');

module.exports = {
  name: Events.ThreadMembersUpdate,

  /**
   *
   * @param {import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').ThreadMember>} addedMembers
   * @param {import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').ThreadMember>} removedMembers
   * @param {import('discord.js').ThreadChannel} thread
   */
  async execute(addedMembers, removedMembers, thread) {
    const { client, guild } = thread;

    const ThreadLogger = new WebhookClient({
      id: process.env.CHANNEL_THREAD_WEBHOOK_ID,
      token: process.env.CHANNEL_THREAD_WEBHOOK_TOKEN,
    });

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    if (addedMembers.size) {
      embed
        .setAuthor({ name: '💭 Member Joined Thread Channel' })
        .setDescription(
          addedMembers
            .map(
              (thr) =>
                `${thr.guildMember} was ${bold('joined')} ${
                  thr.thread
                } thread channel at ${time(
                  thr.joinedAt,
                  TimestampStyles.RelativeTime,
                )}.`,
            )
            .join('\n'),
        );

      await ThreadLogger.send({ embeds: [embed] });
    }

    if (removedMembers.size) {
      embed
        .setAuthor({ name: '💭 Member Left Thread Channel' })
        .setDescription(
          removedMembers
            .map(
              (thr) =>
                `${thr.guildMember} was ${bold('left')} ${
                  thr.thread
                } thread channel at ${time(
                  Math.floor(Date.now() / 1000),
                  TimestampStyles.RelativeTime,
                )}.`,
            )
            .join('\n'),
        );

      await ThreadLogger.send({ embeds: [embed] });
    }
  },
};
