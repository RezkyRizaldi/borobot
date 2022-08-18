const { CommandInteraction } = require('discord.js');

module.exports = {
	data: {
		name: 'modal',
	},

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: `You selected ${interaction.fields.getTextInputValue('input')}`,
		});
	},
};
