const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autocomplete')
    .setDescription('Return a list of autocomplete options.')
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('The input to complete.')
        .setAutocomplete(true)
        .setRequired(true),
    ),
  type: 'Autocomplete',

  /**
   *
   * @param {import('discord.js').AutocompleteInteraction} interaction
   */
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = ['faq', 'install', 'collection', 'promise', 'debug'];
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue),
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const option = interaction.options.getString('type');

    await interaction.reply({
      content: `You entered: ${option}`,
      ephemeral: true,
    });
  },
};
