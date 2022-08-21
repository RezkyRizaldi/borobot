const { bold, cleanCodeBlockContent, codeBlock, EmbedBuilder, Events, hyperlink, italic, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.MessageUpdate,

	/**
	 *
	 * @param {import('discord.js').Message} oldMessage
	 * @param {import('discord.js').Message} newMessage
	 * @param {import('discord.js').Client} client
	 */
	async execute(oldMessage, newMessage, client) {
		if (oldMessage.author.bot) return;

		if (oldMessage.author.id === client.user.id) return;

		if (oldMessage.cleanContent === newMessage.cleanContent) return;

		const oldResponse = oldMessage.cleanContent.slice(0, 1024) + (oldMessage.cleanContent.length > 1024 ? '...' : '');
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
			.setFooter({
				text: client.user.username,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			});

		if (oldMessage.partial || !oldMessage.author) {
			embed.setTitle('Message Edited');
			embed.setDescription(`A message was ${bold('edited')} in ${oldMessage.channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);

			MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}

		embed.setAuthor({
			name: 'Message Edited',
			iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }),
		});
		embed.setDescription(`A ${hyperlink('message', newMessage.url, 'Click here to jump to message')} by ${newMessage.author} was ${bold('edited')} in ${newMessage.channel} at ${time(newMessage.editedAt, TimestampStyles.RelativeTime)}`);
		embed.setFields(
			{
				name: 'Before',
				value: oldResponse.includes('://') ? oldResponse : oldMessage.attachments.size > 0 ? italic('No Content, maybe an attachment') : codeBlock('css', cleanCodeBlockContent(oldResponse)),
			},
			{
				name: 'After',
				value: newResponse.includes('://') ? newResponse : newMessage.attachments.size > 0 ? italic('No Content, maybe an attachment') : codeBlock('css', cleanCodeBlockContent(newResponse)),
			},
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
