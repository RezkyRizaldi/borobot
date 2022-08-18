const { ApplicationCommandType, Client, CommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('User Info').setType(ApplicationCommandType.User),
	type: 'Context Menu',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const target = await interaction.guild.members.fetch(interaction.targetId).catch((err) => console.error(err));

		const response = new EmbedBuilder()
			.setTitle(`${target.user.username}'s User Profile`)
			.setColor(0xfcc9b9)
			.setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter({
				text: target.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setFields([
				{
					name: 'User ID',
					value: target.user.id,
					inline: true,
				},
				{
					name: 'Roles',
					value:
						target.roles.cache
							.map((role) => role.toString())
							.join(' ')
							.replace('@everyone', ' ') || 'None',
					inline: true,
				},
				{
					name: 'User Tag',
					value: target.user.tag,
					inline: true,
				},
				{
					name: 'Nickname',
					value: target.nickname || 'None',
					inline: true,
				},
				{
					name: 'Member Since',
					value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: 'Account Created',
					value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: 'Account Type',
					value: target.user.bot ? 'Bot' : 'User',
					inline: true,
				},
				{
					name: 'Status',
					value: target.presence.status,
					inline: true,
				},
				{
					name: 'Activity',
					value: target.presence.activities[0] ? target.presence.activities[0].name : 'None',
					inline: true,
				},
				{
					name: 'Platform',
					value: target.presence.clientStatus ? Object.keys(target.presence.clientStatus).join(', ') : 'None',
					inline: true,
				},
			]);

		await interaction.reply({ embeds: [response], ephemeral: true });
	},
};
