const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  hyperlink,
} = require('discord.js');

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

    if (!guild) return;

    await interaction.deferReply();

    const member = await guild.members.fetch(targetId);

    const embed = new EmbedBuilder()
      .setAuthor({ name: `👤 ${member.user.username}'s Avatar` })
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

    return interaction.editReply({ embeds: [embed] });
  },
};
