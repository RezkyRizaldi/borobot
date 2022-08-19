const { Client, CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emit')
		.setDescription('Emit an event.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option.setName('event').setDescription('The event to emit.').setRequired(true).addChoices(
				{
					name: 'guildMemberAdd',
					value: 'guildMemberAdd',
				},
				{
					name: 'guildMemberRemove',
					value: 'guildMemberRemove',
				},
				{
					name: 'guildMemberUpdate',
					value: 'guildMemberUpdate',
				}
			)
		),
	type: 'Chat Input',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const event = interaction.options.getString('event');
		await interaction.deferReply({ fetchReply: true });
		client.emit(event, interaction.member);
		await interaction.editReply({ content: `Emitted ${event} event.`, ephemeral: true });
	},
};
