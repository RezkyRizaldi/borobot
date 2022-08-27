const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const { emitChoices } = require('../../constants');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emit')
		.setDescription('Emit an event.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option
				.setName('event')
				.setDescription('The event to emit.')
				.setRequired(true)
				.addChoices(...emitChoices),
		),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const event = interaction.options.getString('event');
		await interaction
			.deferReply({ fetchReply: true, ephemeral: true })
			.then(async () => {
				interaction.client.emit(event, interaction.member);
				await interaction.editReply({ content: `Emitted ${event} event.` });
			})
			.catch((err) => console.error(err));
	},
};
