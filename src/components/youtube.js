module.exports = {
  data: {
    name: 'youtube',
  },

  /**
   *
   * @param {import('discord.js').ButtonInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply({
      content: 'https://youtube.com/c/NotReallyClips',
    });
  },
};
