module.exports = {
	data: {
		name: 'menu',
	},

	/**
	 *
	 * @param {import('discord.js').SelectMenuInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: `You selected ${interaction.values[0]}`,
		});
	},
};
