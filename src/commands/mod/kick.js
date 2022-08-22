const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to kick.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for kicking the member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') || 'No reason';

		if (!member) {
			return interaction.reply({ content: 'You must specify a member to kick.', ephemeral: true });
		}

		if (!member.kickable) {
			return interaction.reply({ content: "You don't have appropiate permissions to kick this member.", ephemeral: true });
		}

		if (member.id === interaction.user.id) {
			return interaction.reply({ content: "You can't kick yourself.", ephemeral: true });
		}

		await member
			.kick(reason)
			.then((m) => interaction.reply({ content: `Successfully ${bold('kicked')} ${m}.`, ephemeral: true }))
			.catch((err) => {
				console.error(err);
				console.log(`Could not send a DM to ${member}.`);
				interaction.followUp({ content: `Could not send a DM to ${member}.`, ephemeral: true });
			});
	},
};
