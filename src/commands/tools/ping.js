const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription("Test the bot's latency"),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const message = await interaction.deferReply({ fetchReply: true });
		const newMessage = `API Latency: ${Math.round(client.ws.ping)}ms.\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}ms.`;
		await interaction.editReply({
			content: newMessage,
			ephemeral: true,
		});
	},
};
