/**
 *
 * @param {import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>} messages
 * @returns {import('discord.js').Message[][]} Array of message grouped by its author.
 */
module.exports = (messages) => [...messages.reduce((a, c) => a.set(c.author.id, [...(a.get(c.author.id) || []), c]), new Map()).values()];
