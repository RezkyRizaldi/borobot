module.exports = {
	data: {
		name: 'youtube',
	},

	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: 'https://youtube.com/c/NotReallyClips',
		});
	},
};
