const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  hyperlink,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(ApplicationCommandType.User),
  type: 'Context Menu',

  /**
   *
   * @param {import('discord.js').ContextMenuCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, targetId } = interaction;

    await interaction
      .deferReply()
      .then(
        async () =>
          await guild.members.fetch(targetId).then(async (member) => {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `👤 ${member.user.username}'s Avatar`,
              })
              .setColor(member.displayHexColor)
              .setTimestamp(Date.now())
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                hyperlink(
                  'Avatar URL',
                  member.displayAvatarURL({ dynamic: true, size: 4096 }),
                  'Click here to view the avatar.',
                ),
              )
              .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }));

            await interaction.editReply({ embeds: [embed] });
          }),
      )
      .catch(async (err) => {
        console.error(err);

        await interaction.editReply({ content: err.message });
      })
      .finally(
        async () =>
          await wait(15000).then(async () => await interaction.deleteReply()),
      );
  },
};
