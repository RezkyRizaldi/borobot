const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect a member from voice channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to disconnect.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for moving this member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') || 'No reason';

		/** @type {import('discord.js').GuildMember} */
		const guildMember = member;

		if (!guildMember.voice.channel) return interaction.reply({ content: 'This member is not connected to a voice channel.', ephemeral: true });

		await guildMember.voice
			.disconnect(reason)
			.then(async (m) => await interaction.reply({ content: `Successfully ${bold('disconnected')} ${m}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
