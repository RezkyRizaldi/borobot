const isValidURL = require('./isValidURL');

/**
 *
 * @param {import('discord.js').Message} message
 */
module.exports = (message) => {
	if (isValidURL(message.content)) return 'Link';

	if (message.content !== '') return 'Regular';

	if ((message.content === '' && message.embeds.length > 0) || message.components.length > 0) return 'Embed';
};
