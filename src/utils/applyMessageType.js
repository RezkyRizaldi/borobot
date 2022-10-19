const {
  cleanCodeBlockContent,
  codeBlock,
  hyperlink,
  italic,
  time,
  TimestampStyles,
} = require('discord.js');

const getMessageType = require('./getMessageType');

/**
 *
 * @param {import('discord.js').Message} message
 * @param {Boolean} [edit=false]
 * @returns {String} The message.
 */
module.exports = (message, edit = false) => {
  const messageTimestamps = edit
    ? `(edited at ${time(
        new Date(message.editedTimestamp),
        TimestampStyles.RelativeTime,
      )})`
    : `(sent at ${time(
        new Date(message.createdTimestamp),
        TimestampStyles.RelativeTime,
      )})`;

  if (message.attachments.size) {
    const attachments = `Attachment:\n${message.attachments
      .map((attachment) =>
        hyperlink(
          attachment.name,
          attachment.url,
          attachment.description ?? 'Click here to jump to the attachment.',
        ),
      )
      .join('\n')}`;

    if (message.content !== '') {
      return `${attachments} with message ${codeBlock(
        'css',
        cleanCodeBlockContent(message.content),
      )} ${messageTimestamps}`;
    }

    return `${attachments} ${messageTimestamps}`;
  }

  return `${
    {
      Link: message.content,
      Embed: italic('No content, maybe an embed or component.'),
      Regular: codeBlock('css', cleanCodeBlockContent(message.content)),
    }[getMessageType(message)]
  } ${messageTimestamps}`;
};
