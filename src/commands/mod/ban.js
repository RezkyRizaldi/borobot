const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const { banChoices } = require('../../constants');

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
				.addChoices(...banChoices)
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

		/** @type {import('discord.js').GuildMember} */
		const guildMember = member;

		if (!member) return interaction.reply({ content: 'You must specify a member to ban.', ephemeral: true });

		if (!guildMember.bannable) return interaction.reply({ content: "You don't have appropiate permissions to ban this member.", ephemeral: true });

		if (guildMember.id === interaction.user.id) return interaction.reply({ content: "You can't ban yourself.", ephemeral: true });

		await guildMember
			.ban({ deleteMessageDays: deleteMessages, reason })
			.then(async (m) => await interaction.reply({ content: `Successfully ${bold('banned')} ${m.user.tag}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
