const { bold, inlineCode, PermissionFlagsBits, SlashCommandBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('timeout a member from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to timeout.').setRequired(true))
		.addIntegerOption((option) =>
			option
				.setName('duration')
				.setDescription('The duration of the timeout.')
				.addChoices(
					{
						name: '60 secs',
						value: 1000 * 60,
					},
					{
						name: '5 mins',
						value: 1000 * 60 * 5,
					},
					{
						name: '10 mins',
						value: 1000 * 60 * 10,
					},
					{
						name: '1 hour',
						value: 1000 * 60 * 60,
					},
					{
						name: '1 day',
						value: 1000 * 60 * 60 * 24,
					},
					{
						name: '1 week',
						value: 1000 * 60 * 60 * 24 * 7,
					},
				)
				.setRequired(true),
		)
		.addStringOption((option) => option.setName('reason').setDescription('The reason for timeouting the member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') || 'No reason';
		const duration = interaction.options.getInteger('duration');

		if (!member) return interaction.reply({ content: 'You must specify a member to do a timeout.', ephemeral: true });

		if (!member.moderatable) return interaction.reply({ content: "You don't have appropiate permissions to timeout this member.", ephemeral: true });

		if (member.id === interaction.user.id) return interaction.reply({ content: "You can't timeout yourself.", ephemeral: true });

		if (member.isCommunicationDisabled()) return interaction.reply({ content: `This member is already timed out. Available back ${time(member.communicationDisabledUntil, TimestampStyles.RelativeTime)}`, ephemeral: true });

		await member
			.timeout(duration, reason)
			.then(async (m) => {
				await interaction.reply({ content: `Successfully ${bold('timed out')} ${m}. Available back ${time(m.communicationDisabledUntil, TimestampStyles.RelativeTime)}.`, ephemeral: true });

				await m.send({ content: `You have been ${bold('timed out')} from ${bold(interaction.guild.name)} for ${inlineCode(reason)}.` });
			})
			.catch(async (err) => {
				console.error(err);
				console.log(`Could not send a DM to ${member}.`);
				await interaction.followUp({ content: `Could not send a DM to ${member}.`, ephemeral: true });
			});
	},
};
