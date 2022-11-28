const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  data: { name: 'jump' },

  /**
   *
   * @param {import('discord.js').MessageComponentInteraction} interaction
   */
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('jumpModal')
      .setTitle('Jump To Page')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('jumpInput')
            .setLabel('Jump To Page')
            .setRequired(true)
            .setPlaceholder('Enter page number here')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1),
        ),
      );

    await interaction.showModal(modal);
  },
};
