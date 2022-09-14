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
    await interaction
      .deferReply()
      .then(async () => {
        await interaction.guild.members
          .fetch(interaction.targetId)
          .then(async (target) => {
            const embed = new EmbedBuilder()
              .setTitle(`${target.user.username}'s Avatar`)
              .setColor(target.displayHexColor)
              .setTimestamp(Date.now())
              .setFooter({
                text: target.client.user.username,
                iconURL: target.client.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                hyperlink(
                  'Avatar URL',
                  target.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                  'Click here to view the avatar.',
                ),
              )
              .setImage(
                target.user.displayAvatarURL({ dynamic: true, size: 4096 }),
              );

            await interaction.editReply({ embeds: [embed] });
          });
      })
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
