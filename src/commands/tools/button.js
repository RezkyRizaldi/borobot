const { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('button').setDescription('Send a button'),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const button = new ButtonBuilder().setCustomId('youtube').setLabel('YouTube').setStyle(ButtonStyle.Primary);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(button)],
		});
	},
};
