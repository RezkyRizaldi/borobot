const { Events, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emit')
		.setDescription('Emit an event.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option.setName('event').setDescription('The event to emit.').setRequired(true).addChoices(
				{
					name: Events.GuildMemberAdd,
					value: Events.GuildMemberAdd,
				},
				{
					name: Events.GuildMemberRemove,
					value: Events.GuildMemberRemove,
				},
				{
					name: Events.GuildMemberUpdate,
					value: Events.GuildMemberUpdate,
				},
			),
		),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const event = interaction.options.getString('event');
		await interaction
			.deferReply({ fetchReply: true, ephemeral: true })
			.then(() => {
				interaction.client.emit(event, interaction.member);
				interaction.editReply({ content: `Emitted ${event} event.` });
			})
			.catch((err) => console.error(err));
	},
};
