const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to ban.').setRequired(true))
		.addIntegerOption((option) =>
			option
				.setName('delete_messages')
				.setDescription('The number of member recent message history to delete.')
				.addChoices(
					{
						name: "Don't Delete Any",
						value: 0,
					},
					{
						name: 'Previous 1 Day',
						value: 1,
					},
					{
						name: 'Previous 2 Days',
						value: 2,
					},
					{
						name: 'Previous 3 Days',
						value: 3,
					},
					{
						name: 'Previous 4 Days',
						value: 4,
					},
					{
						name: 'Previous 5 Days',
						value: 5,
					},
					{
						name: 'Previous 6 Days',
						value: 6,
					},
					{
						name: 'Previous 7 Days',
						value: 7,
					},
				)
				.setRequired(true),
		)
		.addStringOption((option) => option.setName('reason').setDescription('The reason for banning the member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const member = interaction.options.getMember('member');
		const deleteMessages = interaction.options.getInteger('delete_messages');
		const reason = interaction.options.getString('reason') || 'No reason';

		if (!member) {
			return interaction.reply({ content: 'You must specify a member to ban.', ephemeral: true });
		}

		if (!member.bannable) {
			return interaction.reply({ content: "You don't have appropiate permissions to ban this member.", ephemeral: true });
		}

		if (member.id === interaction.user.id) {
			return interaction.reply({ content: "You can't ban yourself.", ephemeral: true });
		}

		await member
			.ban({ days: deleteMessages, reason })
			.then((m) => interaction.reply({ content: `Successfully ${bold('banned')} ${m.user.tag}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
