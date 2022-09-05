/**
 *
 * @param {import('discord.js').Collection<String, import('discord.js').Message>} arr
 * @returns {Array<Array<import('discord.js').Message>>}
 */
module.exports = (arr) => [...arr.reduce((a, c) => a.set(c.author.id, [...(a.get(c.author.id) || []), c]), new Map()).values()];
