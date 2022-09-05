const { cleanCodeBlockContent, codeBlock, hyperlink, italic, time, TimestampStyles } = require('discord.js');

const getMessageType = require('./getMessageType');

/**
 *
 * @param {import('discord.js').Message} message
 * @param {Boolean} edit
 * @returns {String} The message.
 */
module.exports = (message, edit = false) => {
	if (getMessageType(message) === 'Link') {
		return `${message.content} ${edit ? `(edited at ${time(new Date(message.editedTimestamp), TimestampStyles.RelativeTime)})` : `(sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`}`;
	}

	if (getMessageType(message) === 'Embed') {
		return `${italic('No content, maybe an embed or component.')} ${
			edit ? `(edited at ${time(new Date(message.editedTimestamp), TimestampStyles.RelativeTime)})` : `(sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`
		}`;
	}

	if (message.attachments.size) {
		if (message.content !== '') {
			return `Attachment:\n${message.attachments.map((attachment) => hyperlink(attachment.name, attachment.url, attachment.description || 'Click here to jump to the attachment.')).join('\n')} with message ${codeBlock(
				'css',
				cleanCodeBlockContent(message.content),
			)} ${edit ? `(edited at ${time(new Date(message.editedTimestamp), TimestampStyles.RelativeTime)})` : `(sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`}`;
		}

		return `Attachment: ${message.attachments.map((attachment) => hyperlink(attachment.name, attachment.url, attachment.description || 'Click here to jump to the attachment.')).join('\n')} ${
			edit ? `(edited at ${time(new Date(message.editedTimestamp), TimestampStyles.RelativeTime)})` : `(sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)})`
		}`;
	}

	if (getMessageType(message) === 'Regular') {
		return `${codeBlock('css', cleanCodeBlockContent(message.content))} ${
			edit ? `edited at ${time(new Date(message.editedTimestamp), TimestampStyles.RelativeTime)}` : `sent at ${time(new Date(message.createdTimestamp), TimestampStyles.RelativeTime)}`
		}`;
	}
};
