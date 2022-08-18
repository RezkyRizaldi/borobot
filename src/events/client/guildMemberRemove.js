const { Client, EmbedBuilder, GuildMember, WebhookClient } = require('discord.js');

module.exports = {
	name: 'guildMemberRemove',

	/**
	 *
	 * @param {GuildMember} member
	 * @param {Client} client
	 */
	async execute(member, client) {
		const { user, guild } = member;

		member.roles.remove(process.env.MEMBER_ROLE_ID);

		const LeaveLogger = new WebhookClient({
			id: process.env.LEAVE_WEBHOOK_ID,
			token: process.env.LEAVE_WEBHOOK_TOKEN,
		});

		const message = new EmbedBuilder()
			.setTitle(`Goodbye. Thanks for being with ${guild.name}`)
			.setDescription(`It's been a long time, ${member}!`)
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
					name: 'Member Since',
					value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: 'Left At',
					value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
					inline: true,
				},
			]);

		await LeaveLogger.send({ embeds: [message] });
	},
};
