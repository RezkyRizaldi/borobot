const { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to ban.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for baning the member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		let reason = interaction.options.getString('reason') || 'No reason provided';
		const member = await interaction.guild.members.fetch(user.id).catch((err) => console.error(err));

		if (!user) {
			await interaction.reply({ content: 'You must specify a member to ban.', ephemeral: true });
			return;
		}

		if (!user.bannable) {
			await interaction.reply({ content: 'You cannot ban this member.', ephemeral: true });
			return;
		}

		await member
			.ban({
				deleteMessageDays: 1,
				reason,
			})
			.catch((err) => console.error(err));
		await interaction.reply({ content: `Successfully banned ${user.tag}.`, ephemeral: true });
		await user
			.send({
				content: `You have been banned from ${interaction.guild.name} for ${reason}.`,
			})
			.catch((err) => {
				console.error(err);
				console.log(`Could not send a DM to ${user.tag}.`);
			});
	},
};
