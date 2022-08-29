const { GuildNSFWLevel } = require('discord.js');

/**
 *
 * @param {GuildNSFWLevel} level
 */
module.exports = (level) => {
	return {
		[GuildNSFWLevel.Default]: 'No Restrictions',
		[GuildNSFWLevel.Explicit]: 'Explicit',
		[GuildNSFWLevel.Safe]: 'Safe',
		[GuildNSFWLevel.AgeRestricted]: 'Age Restricted',
	}[level];
};