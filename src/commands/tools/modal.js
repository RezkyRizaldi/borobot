const { ActionRowBuilder, CommandInteraction, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('modal').setDescription('Open a modal.'),
	type: 'Modal',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const modal = new ModalBuilder().setCustomId('modal').setTitle('Modal');

		const textInput = new TextInputBuilder().setCustomId('input').setPlaceholder('Enter text here').setLabel('Text Input').setRequired(true).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(100);

		modal.addComponents(new ActionRowBuilder().addComponents(textInput));

		await interaction.showModal(modal);
	},
};
