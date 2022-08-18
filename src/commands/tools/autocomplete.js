const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autocomplete')
		.setDescription('Return a list of autocomplete options.')
		.addStringOption((option) => option.setName('type').setDescription('The input to complete.').setAutocomplete(true).setRequired(true)),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = ['faq', 'install', 'collection', 'promise', 'debug'];
		const filtered = choices.filter((choice) => choice.startsWith(focusedValue));

		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
	},
	async execute(interaction) {
		const option = interaction.options.getString('type');

		await interaction.reply({ content: `You entered: ${option}`, ephemeral: true });
	},
};
