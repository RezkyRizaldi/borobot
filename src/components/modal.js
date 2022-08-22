module.exports = {
	data: {
		name: 'modal',
	},

	/**
	 *
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: `You selected ${interaction.fields.getTextInputValue('input')}`,
		});
	},
};
