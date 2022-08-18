module.exports = {
	data: {
		name: 'menu',
	},
	async execute(interaction, client) {
		await interaction.reply({
			content: `You selected ${interaction.values[0]}`,
		});
	},
};
