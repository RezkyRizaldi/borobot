module.exports = {
	data: {
		name: 'menu',
	},

	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: `You selected ${interaction.values[0]}`,
		});
	},
};
