const { cleanCodeBlockContent, codeBlock, hyperlink, italic, time, TimestampStyles } = require('discord.js');

const getMessageType = require('./getMessageType');

/**
 *
 * @param {import('discord.js').Message} message
 * @returns {String}
 */
module.exports = (message) => {
	if (getMessageType(message) === 'Link') {
		return `${message.content} (sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`;
	}

	if (getMessageType(message) === 'Embed') {
		return `${italic('No content, maybe an embed or component.')} (sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`;
	}

	if (message.attachments.size) {
		if (message.content !== '') {
			return `Attachment:\n${message.attachments.map((attachment) => hyperlink(attachment.name, attachment.url, attachment.description || 'Click here to jump to the attachment.')).join('\n')} with message ${codeBlock(
				'css',
				cleanCodeBlockContent(message.content),
			)} (sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`;
		}

		return `Attachment: ${message.attachments.map((attachment) => hyperlink(attachment.name, attachment.url, attachment.description || 'Click here to jump to the attachment.')).join('\n')} (sent at ${time(
			new Date(message.createdTimestamp),
			TimestampStyles.RelativeTime,
		)})`;
	}

	if (getMessageType(message) === 'Regular') {
		return `${codeBlock('css', cleanCodeBlockContent(message.content))} sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)}`;
	}
};
