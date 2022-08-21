const { bold, inlineCode, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

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

		if (member.id === interaction.user.id) {
			return interaction.reply({ content: "You can't kick yourself.", ephemeral: true });
		}

		if (!member.kickable) {
			return interaction.reply({ content: 'You cannot kick this member.', ephemeral: true });
		}

		await interaction.guild.members
			.fetch(member.id)
			.then((m) => m.kick(reason))
			.catch((err) => console.error(err));

		await interaction
			.reply({ content: `Successfully kicked ${member.tag}.`, ephemeral: true })
			.then(() =>
				member.send({
					content: `You have been ${bold('kicked')} from ${interaction.guild.name} for ${inlineCode(reason)}.`,
				}),
			)
			.catch((err) => {
				console.error(err);
				console.log(`Could not send a DM to ${member.tag}.`);
				interaction.followUp({ content: `Could not send a DM to ${member.tag}.`, ephemeral: true });
			});
	},
};
