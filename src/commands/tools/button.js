const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('button').setDescription('Send a button'),
	async execute(interaction) {
		const button = new ButtonBuilder().setCustomId('youtube').setLabel('YouTube').setStyle(ButtonStyle.Primary);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(button)],
		});
	},
};
