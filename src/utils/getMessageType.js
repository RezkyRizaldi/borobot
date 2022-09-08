const isValidURL = require('./isValidURL');

/**
 *
 * @param {import('discord.js').Message} message
 * @returns {String} The message type.
 */
module.exports = (message) => {
  if (isValidURL(message.content)) return 'Link';

  if (message.content !== '') return 'Regular';

  if (
    (message.content === '' && message.embeds.length) ||
    message.components.length
  ) {
    return 'Embed';
  }
};
