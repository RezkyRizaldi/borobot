const { Collection, EmbedBuilder, Message, Snowflake, WebhookClient } = require('discord.js');

module.exports = {
	name: 'messageDeleteBulk',

	/**
	 *
	 * @param {Collection<Snowflake, Message>} messages
	 */
	async execute(messages) {
		const MessageLogger = new WebhookClient({
			id: process.env.MESSAGE_WEBHOOK_ID,
			token: process.env.MESSAGE_WEBHOOK_TOKEN,
		});

		const embed = new EmbedBuilder().setColor(0xfcc9b9).setTimestamp(Date.now());

		if (messages.first().partial || !messages.first().author) {
			embed.setTitle('Messages Deleted');
			embed.setDescription(`${messages.size} messages was **deleted** in ${messages.first().channel} at <t:${Math.floor(Date.now() / 1000)}:R>`);
		} else {
			embed.setAuthor({
				name: 'Messages Deleted',
				iconURL: messages.first().author.displayAvatarURL({ dynamic: true }),
			});
			embed.setDescription(`${messages.size} messages by ${messages.first().author} was **deleted** in ${messages.first().channel} at <t:${Math.floor(Date.now() / 1000)}:R>`);
			embed.setFields({
				name: 'Deleted Messages',
				value: messages.map((message) => (message.content.includes('://') ? message.content : ('```css\n' + message.content + '```').slice(0, 4096))).join('\n') || 'No Content',
			});

			if (messages.first().attachments.size >= 1) {
				embed.addFields({
					name: 'Attachments',
					value: messages
						.first()
						.attachments.map((attachment) => attachment.url)
						.join('\n'),
				});
			}
		}

		await MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
