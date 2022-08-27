const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Remove member timeout from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to remove the timeout.').setRequired(true)),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const member = interaction.options.getMember('member');

		/** @type {import('discord.js').GuildMember} */
		const guildMember = member;

		if (!member) return interaction.reply({ content: 'You must specify a member to remove the timeout.', ephemeral: true });

		if (!guildMember.moderatable) return interaction.reply({ content: "You don't have appropiate permissions to removing the timeout from this member.", ephemeral: true });

		if (guildMember.id === interaction.user.id) return interaction.reply({ content: "You can't remove timeout by yourself.", ephemeral: true });

		if (!guildMember.isCommunicationDisabled()) return interaction.reply({ content: "This member isn't being timed out.", ephemeral: true });

		await guildMember
			.timeout(null, 'No reason')
			.then(async (m) => {
				await interaction.reply({ content: `Successfully ${bold('removing timeout')} from ${m}.`, ephemeral: true });

				await m.send({ content: `Your ${bold('timeout')} has passed from ${bold(interaction.guild.name)}.` });
			})
			.catch(async (err) => {
				console.error(err);
				console.log(`Could not send a DM to ${member}.`);
				await interaction.followUp({ content: `Could not send a DM to ${member}.`, ephemeral: true });
			});
	},
};
