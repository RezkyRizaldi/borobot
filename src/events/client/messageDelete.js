const { bold, cleanCodeBlockContent, codeBlock, EmbedBuilder, Events, italic, time, TimestampStyles, WebhookClient, hyperlink } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,

	/**
	 *
	 * @param {import('discord.js').Message} message
	 */
	async execute(message) {
		const botColor = await message.guild.members.fetch(message.client.user.id).then((res) => res.displayHexColor);

		const MessageLogger = new WebhookClient({
			id: process.env.MESSAGE_WEBHOOK_ID,
			token: process.env.MESSAGE_WEBHOOK_TOKEN,
		});

		const embed = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: message.client.user.username,
				iconURL: message.client.user.displayAvatarURL({ dynamic: true }),
			});

		if (message.partial || !message.author) {
			embed.setTitle('Message Deleted');
			embed.setDescription(`A message was ${bold('deleted')} in ${message.channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);

			return MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}

		embed.setDescription(`A message by ${message.author} was ${bold('deleted')} in ${message.channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);
		embed.setFields({
			name: 'Deleted Message',
			value: message.content.includes('://') ? message.content : message.embeds.length > 0 || message.components.length > 0 ? italic('No Content, maybe an embed or component.') : codeBlock('css', cleanCodeBlockContent(message.content)),
		});
		embed.setAuthor({
			name: 'Message Deleted',
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		});

		if (message.attachments.size >= 1) {
			embed.addFields({
				name: 'Attachments',
				value: message.attachments.map((attachment) => hyperlink(attachment.name, attachment.url, 'Click here to jump to attachment')).join('\n'),
			});
		}

		await MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
