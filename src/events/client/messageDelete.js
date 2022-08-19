const { Client, EmbedBuilder, Message, WebhookClient } = require('discord.js');

module.exports = {
	name: 'messageDelete',

	/**
	 *
	 * @param {Message} message
	 * @param {Client} client
	 */
	async execute(message, client) {
		const MessageLogger = new WebhookClient({
			id: process.env.MESSAGE_WEBHOOK_ID,
			token: process.env.MESSAGE_WEBHOOK_TOKEN,
		});

		const embed = new EmbedBuilder()
			.setColor(0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			});

		if (message.partial || !message.author) {
			embed.setTitle('Message Deleted');
			embed.setDescription(`A message was **deleted** in ${message.channel} at <t:${Math.floor(Date.now() / 1000)}:R>`);
		} else {
			embed.setDescription(`A message by ${message.author} was **deleted** in ${message.channel} at <t:${Math.floor(Date.now() / 1000)}:R>`);
			embed.setFields({
				name: 'Deleted Message',
				value: message.content.includes('://') ? message.content : ('```css\n' + message.content + '```').slice(0, 4096) || 'No Content',
			});
			embed.setAuthor({
				name: 'Message Deleted',
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			});

			if (message.attachments.size >= 1) {
				embed.addFields({
					name: 'Attachments',
					value: message.attachments.map((attachment) => attachment.url).join('\n'),
				});
			}
		}

		await MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
