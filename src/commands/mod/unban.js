const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban a user from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption((option) => option.setName('user_id').setDescription('The user id to Unban.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for unbanning the user.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const userId = interaction.options.get('user_id')?.value;
		const reason = interaction.options.getString('reason') || 'No reason';
		const bannedUser = await interaction.guild.bans.fetch(userId).then((user) => user);

		if (!userId) {
			return interaction.reply({ content: 'Please provide a user id.', ephemeral: true });
		}

		if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
			return interaction.reply({ content: "You don't have appropiate permissions to unban this member.", ephemeral: true });
		}

		if (userId !== bannedUser.user.id) {
			return interaction.reply({ content: "This user isn't banned.", ephemeral: true });
		}

		await interaction.guild.members
			.unban(userId, reason)
			.then((user) => interaction.reply({ content: `Successfully ${bold('unbanned')} ${user.tag}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
