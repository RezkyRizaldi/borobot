const { ApplicationCommandType, CommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');

const { applyActivity, applyPresence, applyTimestamp } = require('../../utils');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('User Info').setType(ApplicationCommandType.User),
	type: 'Context Menu',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const target = await interaction.guild.members.fetch(interaction.user.id).catch((err) => console.error(err));
		const userRoles = target.roles.icon
			? `${target.roles.icon} `
			: '' +
					target.roles.cache
						.map((role) => `${role}`)
						.join(', ')
						.replace(', @everyone', '') || '_None_';

		const userClientStatus = target.presence?.clientStatus
			? Object.keys(target.presence.clientStatus)
					.map((status) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`)
					.join(', ')
			: '_None_';

		const userActivity = target.presence?.activities.map((activity) => `${applyActivity(activity.type)} ${activity.name} at ${applyTimestamp(activity.timestamps.start)}`).join('\n') || '_None_';

		const response = new EmbedBuilder()
			.setTitle(`ℹ️ ${target.user.username}'s User Info`)
			.setColor(target.displayHexColor || 0xfcc9b9)
			.setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
			.setFooter({
				text: target.client.user.tag,
				iconURL: target.client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setFields([
				{
					name: '🆔 ID',
					value: target.user.id,
					inline: true,
				},
				{
					name: '🏷️ Tag',
					value: target.user.tag,
					inline: true,
				},
				{
					name: '👥 Nickname',
					value: target.nickname || target.displayName || '_None_',
					inline: true,
				},
				{
					name: '🔐 Roles',
					value: userRoles,
				},
				{
					name: '📆 Member Since',
					value: applyTimestamp(target.joinedTimestamp),
					inline: true,
				},
				{
					name: '🎊 Account Created',
					value: applyTimestamp(target.user.createdTimestamp),
					inline: true,
				},
				{
					name: '📇 Account Type',
					value: target.user.bot ? 'Bot' : 'User',
					inline: true,
				},
				{
					name: '⭕ Presence Status',
					value: applyPresence(target.presence?.status) || '⚫ Offline',
					inline: true,
				},
				{
					name: '🚀 Nitro Status',
					value: target.premiumSince ? `Boosting since ${applyTimestamp(target.premiumSinceTimestamp)}` : 'Not Boosting',
					inline: true,
				},
				{
					name: '📶 Online Device',
					value: userClientStatus,
					inline: true,
				},
				{
					name: '🎭 Activity',
					value: userActivity,
				},
			]);

		await interaction.reply({ embeds: [response], ephemeral: true });
	},
};
