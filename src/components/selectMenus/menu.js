const { CommandInteraction } = require('discord.js');

module.exports = {
	data: {
		name: 'menu',
	},

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: `You selected ${interaction.values[0]}`,
		});
	},
};
