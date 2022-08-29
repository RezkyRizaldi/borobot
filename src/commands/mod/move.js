const { bold, ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move a member to specific voice channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
		.addUserOption((option) => option.setName('member').setDescription('The member to move.').setRequired(true))
		.addChannelOption((option) => option.setName('channel').setDescription('The channel destination.').setRequired(true).addChannelTypes(ChannelType.GuildVoice))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for moving this member.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const member = interaction.options.getMember('member');
		const channel = interaction.options.getChannel('channel');
		const reason = interaction.options.getString('reason') || 'No reason';

		/** @type {import('discord.js').GuildMember} */
		const guildMember = member;

		if (!guildMember.voice.channel) return interaction.reply({ content: 'This member is not connected to a voice channel.', ephemeral: true });

		if (guildMember.voice.channelId === channel.id) return interaction.reply({ content: `This member is already in ${channel}.`, ephemeral: true });

		await guildMember.voice
			.setChannel(channel, reason)
			.then(async (m) => await interaction.reply({ content: `Successfully ${bold('moved')} ${m} to ${channel}.`, ephemeral: true }))
			.catch((err) => console.error(err));
	},
};
