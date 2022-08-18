const { CommandInteraction } = require('discord.js');

module.exports = {
	data: {
		name: 'youtube',
	},

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: 'https://youtube.com/c/NotReallyClips',
		});
	},
};
