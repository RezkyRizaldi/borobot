const { GuildNSFWLevel } = require('discord.js');

/**
 *
 * @param {GuildNSFWLevel} level
 */
module.exports = (level) => {
	switch (level) {
		case GuildNSFWLevel.Default:
			return 'No Restrictions';
		case GuildNSFWLevel.Explcit:
			return 'Explicit';
		case GuildNSFWLevel.Safe:
			return 'Safe';
		case GuildNSFWLevel.AgeRestricted:
			return 'Age Restricted';
		default:
			break;
	}
};
