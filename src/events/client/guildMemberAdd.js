const { EmbedBuilder, Events, GuildMember, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,

	/**
	 *
	 * @param {GuildMember} member
	 */
	async execute(member) {
		const { user, guild } = member;

		member.roles.add(process.env.MEMBER_ROLE_ID);

		const WelcomeLogger = new WebhookClient({
			id: process.env.WELCOME_WEBHOOK_ID,
			token: process.env.WELCOME_WEBHOOK_TOKEN,
		});

		const message = new EmbedBuilder()
			.setTitle(`👋 Welcome to ${guild.name}`)
			.setDescription(`hope you enjoy here, ${member}!`)
			.setColor(member.displayHexColor || 0xfcc9b9)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setFooter({
				text: member.client.user.username,
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
					name: '🎊 Account Created',
					value: time(user.createdAt, TimestampStyles.RelativeTime),
					inline: true,
				},
				{
					name: '📆 Joined At',
					value: time(member.joinedAt, TimestampStyles.RelativeTime),
					inline: true,
				},
			]);

		await WelcomeLogger.send({ embeds: [message] }).catch((err) => console.error(err));
	},
};
