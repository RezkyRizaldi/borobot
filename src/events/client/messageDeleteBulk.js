const { AuditLogEvent, bold, cleanCodeBlockContent, codeBlock, EmbedBuilder, Events, italic, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.MessageBulkDelete,

	/**
	 *
	 * @param {import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>} messages
	 */
	async execute(messages) {
		const botColor = await messages
			.first()
			.guild.members.fetch(messages.first().client.user.id)
			.then((res) => res.displayHexColor);

		const MessageLogger = new WebhookClient({
			id: process.env.MESSAGE_DELETE_WEBHOOK_ID,
			token: process.env.MESSAGE_DELETE_WEBHOOK_TOKEN,
		});

		const embed = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: messages.first().client.user.username,
				iconURL: messages.first().client.user.displayAvatarURL({ dynamic: true }),
			});

		if (!messages.first().guild) return;

		if (messages.first().partial || !messages.first().author) {
			embed.setTitle('Messages Deleted');
			embed.setDescription(`${messages.size} messages was ${bold('deleted')} in ${messages.first().channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);

			return MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}

		const bulkDeleteLog = await messages
			.first()
			.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MessageBulkDelete })
			.then((audit) => audit.entries.first());

		embed.setAuthor({
			name: 'Messages Deleted',
			iconURL: messages.first().author.displayAvatarURL({ dynamic: true }),
		});
		embed.setDescription(
			`${messages.size} messages from ${messages.first().author} was ${bold('deleted')} by ${bulkDeleteLog.executor} in ${messages.first().channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`,
		);
		embed.setFields({
			name: 'Deleted Messages',
			value: messages
				.map((message) =>
					message.content.includes('://') ? message.content : message.embeds.length > 0 || message.components.length > 0 ? italic('No Content, maybe an embed or component.') : codeBlock('css', cleanCodeBlockContent(message.content)),
				)
				.join('\n'),
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

		await MessageLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
