const { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction, EmbedBuilder, italic, time, TimestampStyles } = require('discord.js');

const { applyActivity, applyPresence } = require('../../utils');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('User Info').setType(ApplicationCommandType.User),
	type: 'Context Menu',

	/**
	 *
	 * @param {ContextMenuCommandInteraction} interaction
	 */
	async execute(interaction) {
		const target = await interaction.guild.members.fetch(interaction.targetId).catch((err) => console.error(err));

		const userRoles = target.roles.icon
			? `${target.roles.icon} `
			: '' +
					target.roles.cache
						.map((role) => `${role}`)
						.join(', ')
						.replace(', @everyone', '') || italic('None');

		const userClientStatus = target.presence?.clientStatus
			? Object.keys(target.presence.clientStatus)
					.map((status) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`)
					.join(', ')
			: italic('None');

		const userActivity = target.presence?.activities.map((activity) => `${applyActivity(activity.type)} ${activity.name} at ${time(activity.timestamps.start, TimestampStyles.RelativeTime)}`).join('\n') || italic('None');

		const embed = new EmbedBuilder()
			.setTitle(`ℹ️ ${target.user.username}'s User Info`)
			.setColor(target.displayHexColor || 0xfcc9b9)
			.setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
			.setFooter({
				text: target.client.user.username,
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
					name: `🔐 Roles${target.roles.cache.size > 0 ? ` (${target.roles.cache.size - 1})` : ''}`,
					value: userRoles,
				},
				{
					name: '📆 Member Since',
					value: time(target.joinedAt, TimestampStyles.RelativeTime),
					inline: true,
				},
				{
					name: '🎊 Account Created',
					value: time(target.user.createdAt, TimestampStyles.RelativeTime),
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
					value: target.premiumSince ? `Boosting since ${time(target.premiumSinceTimestamp, TimestampStyles.RelativeTime)}` : 'Not Boosting',
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

		await interaction
			.deferReply({ fetchReply: true })
			.then(() => interaction.editReply({ embeds: [embed] }))
			.catch((err) => console.error(err))
			.finally(() => setTimeout(() => interaction.deleteReply(), 10000));
	},
};
