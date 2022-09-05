const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('🔓 Unban a user from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption((option) => option.setName('user_id').setDescription('👤 The user id to unban.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('📃 The reason for unbanning the user.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options } = interaction;

		const userId = options.get('user_id')?.value;
		const reason = options.getString('reason') || 'No reason';

		const bannedUserId = await interaction.guild.bans.fetch(userId).then((ban) => ban.user.id);

		if (userId !== bannedUserId) return interaction.reply({ content: "This user isn't banned.", ephemeral: true });

		await interaction.guild.members
			.unban(bannedUserId, reason)
			.then(async (user) => await interaction.reply({ content: `Successfully ${bold('unbanned')} ${user.tag}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
