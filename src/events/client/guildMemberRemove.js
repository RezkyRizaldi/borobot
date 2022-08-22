const { EmbedBuilder, Events, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,

	/**
	 *
	 * @param {import('discord.js').GuildMember} member
	 */
	async execute(member) {
		const { user, guild } = member;

		const LeaveLogger = new WebhookClient({
			id: process.env.LEAVE_WEBHOOK_ID,
			token: process.env.LEAVE_WEBHOOK_TOKEN,
		});

		const message = new EmbedBuilder()
			.setTitle(`🖐️ Goodbye. Thanks for being with ${guild.name}`)
			.setDescription(`It's been a long time, ${member}!`)
			.setColor(member.displayHexColor || 0xfcc9b9)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setFooter({
				text: member.client.user.tag,
				iconURL: member.client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setFields([
				{
					name: '🆔 Member ID',
					value: user.id,
					inline: true,
				},
				{
					name: '📆 Member Since',
					value: time(member.joinedAt, TimestampStyles.RelativeTime),
					inline: true,
				},
				{
					name: '🕒 Left At',
					value: time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime),
					inline: true,
				},
			]);

		await LeaveLogger.send({ embeds: [message] }).catch((err) => console.error(err));
	},
};
