module.exports = {
	data: {
		name: 'youtube',
	},
	async execute(interaction, client) {
		await interaction.reply({
			content: 'https://youtube.com/c/NotReallyClips',
		});
	},
};
