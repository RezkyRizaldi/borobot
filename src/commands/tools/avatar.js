const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  hyperlink,
} = require('discord.js');

const { generateEmbed } = require('@/utils');

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
    const { guild, targetId } = interaction;

    if (!guild) return;

    await interaction.deferReply();

    const member = await guild.members.fetch(targetId);

    const embed = generateEmbed({ interaction, type: 'member' })
      .setAuthor({ name: `👤 ${member.user.username}'s Avatar` })
      .setDescription(
        hyperlink(
          'Avatar URL',
          member.displayAvatarURL({ size: 4096 }),
          'Click here to view the avatar.',
        ),
      )
      .setImage(member.displayAvatarURL({ size: 4096 }));

    await interaction.editReply({ embeds: [embed] });
  },
};
