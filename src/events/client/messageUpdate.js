const { Client, EmbedBuilder, Message, WebhookClient } = require('discord.js');

module.exports = {
	name: 'messageUpdate',

	/**
	 *
	 * @param {Message} oldMessage
	 * @param {Message} newMessage
	 * @param {Client} client
	 */
	async execute(oldMessage, newMessage, client) {
		if (oldMessage.author.bot) return;

		if (oldMessage.author.id === client.user.id) return;

		if (oldMessage.cleanContent === newMessage.cleanContent) return;

		const originResponse = oldMessage.cleanContent.slice(0, 1024) + (oldMessage.cleanContent.length > 1024 ? '...' : '');
		const newResponse = newMessage.cleanContent.slice(0, 1024) + (newMessage.cleanContent.length > 1024 ? '...' : '');

		const MessageLogger = new WebhookClient({
			id: process.env.MESSAGE_WEBHOOK_ID,
			token: process.env.MESSAGE_WEBHOOK_TOKEN,
		});

		const embed = new EmbedBuilder()
			.setColor(0xfcc9b9)
			.setTimestamp(Date.now())
			.setAuthor({
				name: 'Message Edited',
				iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }),
			})
			.setFooter({
				text: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription(`A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel} at <t:${Math.floor(newMessage.editedAt / 1000)}:R>`)
			.setFields(
				{
					name: 'Before',
					value: ('```css\n' + originResponse + '```').slice(0, 4096),
				},
				{
					name: 'After',
					value: ('```css\n' + newResponse + '```').slice(0, 4096),
				}
			);

		await MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
