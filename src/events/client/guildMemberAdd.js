const { EmbedBuilder, Events, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,

	/**
	 *
	 * @param {import('discord.js').GuildMember} member
	 */
	async execute(member) {
		const { user, guild } = member;

		const WelcomeLogger = new WebhookClient({
			id: process.env.MEMBER_GUILD_WELCOME_WEBHOOK_ID,
			token: process.env.MEMBER_GUILD_WELCOME_WEBHOOK_TOKEN,
		});

		const message = new EmbedBuilder()
			.setTitle(`👋 Welcome to ${guild.name}`)
			.setDescription(`hope you enjoy here, ${member}!`)
			.setColor(0xfcc9b9)
			.setFooter({
				text: member.client.user.username,
				iconURL: member.client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now());

		await member.send({ embeds: [message] }).catch((err) => {
			console.error(err);
			console.log(`Could not send a DM to ${member.user.tag}`);
		});

		await member.roles
			.add(process.env.MEMBER_ROLE_ID)
			.then(async (m) => {
				message.setColor(m.displayHexColor || 0xfcc9b9);
				message.setThumbnail(user.displayAvatarURL({ dynamic: true }));
				message.setFields([
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
						value: time(m.joinedAt, TimestampStyles.RelativeTime),
						inline: true,
					},
				]);

				await WelcomeLogger.send({ embeds: [message] });
			})
			.catch((err) => console.error(err));
	},
};
