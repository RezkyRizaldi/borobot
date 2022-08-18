const { ActionRowBuilder, CommandInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('menu').setDescription('Select a menu.'),
	type: 'Select Menu',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const menu = new SelectMenuBuilder()
			.setCustomId('menu')
			.setPlaceholder('Select Menu')
			.setMinValues(1)
			.setMaxValues(1)
			.setOptions(
				new SelectMenuOptionBuilder({
					label: 'Option 1',
					value: 'https://youtube.com/c/NotReallyClips',
				}),
				new SelectMenuOptionBuilder({
					label: 'Option 2',
					value: 'https://twitter.com/rezkyrizaldii',
				})
			);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(menu)],
		});
	},
};
