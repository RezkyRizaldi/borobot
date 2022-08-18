const { Client, EmbedBuilder, GuildMember, WebhookClient } = require('discord.js');

module.exports = {
	name: 'guildMemberAdd',

	/**
	 *
	 * @param {GuildMember} member
	 * @param {Client} client
	 */
	async execute(member, client) {
		const { user, guild } = member;

		member.roles.add(process.env.MEMBER_ROLE_ID);

		const WelcomeLogger = new WebhookClient({
			id: process.env.WELCOME_WEBHOOK_ID,
			token: process.env.WELCOME_WEBHOOK_TOKEN,
		});

		const message = new EmbedBuilder()
			.setTitle(`Welcome to ${guild.name}`)
			.setDescription(`hope you enjoy here, ${member}!`)
			.setColor(0xfcc9b9)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL({ dynamic: true, size: 512 }),
				url: 'https://youtube.com/c/NotReallyClips',
			})
			.setFooter({
				text: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setFields([
				{
					name: 'Member ID',
					value: user.id,
					inline: true,
				},
				{
					name: 'Account Created',
					value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: 'Joined At',
					value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
					inline: true,
				},
			]);

		await WelcomeLogger.send({ embeds: [message] });
	},
};
