const { bold, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('🔊 Unmute a member from voice channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
		.addUserOption((option) => option.setName('member').setDescription('👤 The member to unmute from.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('📃 The reason for unmute the member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options } = interaction;

		/** @type {import('discord.js').GuildMember} */
		const member = options.getMember('member');
		const reason = options.getString('reason') || 'No reason';

		if (!member.voice.channel) return interaction.reply({ content: 'This member is not connected to a voice channel.', ephemeral: true });

		if (member.id === interaction.user.id) return interaction.reply({ content: "You can't unmute yourself.", ephemeral: true });

		if (!member.voice.serverMute) return interaction.reply({ content: "This member isn't being muted.", ephemeral: true });

		await member.voice
			.setMute(false, reason)
			.then(async (m) => await interaction.reply({ content: `Successfully ${bold('unmuted')} ${m}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
