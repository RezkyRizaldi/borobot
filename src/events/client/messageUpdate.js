const { bold, cleanCodeBlockContent, Client, codeBlock, EmbedBuilder, Events, hyperlink, italic, Message, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.MessageUpdate,

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

		const botColor = await oldMessage.guild.members
			.fetch(oldMessage.client.user.id)
			.then((res) => res.displayHexColor)
			.catch((err) => console.error(err));

		const MessageLogger = new WebhookClient({
			id: process.env.MESSAGE_WEBHOOK_ID,
			token: process.env.MESSAGE_WEBHOOK_TOKEN,
		});

		const embed = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setAuthor({
				name: 'Message Edited',
				iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }),
			})
			.setFooter({
				text: client.user.username,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription(`A ${hyperlink('message', newMessage.url, 'Click here to jump to message')} by ${newMessage.author} was ${bold('edited')} in ${newMessage.channel} at ${time(newMessage.editedAt, TimestampStyles.RelativeTime)}`)
			.setFields(
				{
					name: 'Before',
					value: originResponse.includes('://') ? originResponse : oldMessage.attachments.size > 0 ? italic('No Content, maybe an attachment') : codeBlock('css', cleanCodeBlockContent(originResponse)),
				},
				{
					name: 'After',
					value: newResponse.includes('://') ? newResponse : newMessage.attachments.size > 0 ? italic('No Content, maybe an attachment') : codeBlock('css', cleanCodeBlockContent(newResponse)),
				}
			);

		if (oldMessage.attachments.size > 0) {
			embed.addFields({
				name: 'Attachments',
				value: oldMessage.attachments.map((attachment) => hyperlink(attachment.name, attachment.url, 'Click here to jump to attachment')).join('\n'),
			});
		}

		await MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
