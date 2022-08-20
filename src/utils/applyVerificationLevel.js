const { GuildVerificationLevel } = require('discord.js');

/**
 *
 * @param {GuildVerificationLevel} level
 */
module.exports = (level) => {
	switch (level) {
		case GuildVerificationLevel.None:
			return 'Unrestricted';
		case GuildVerificationLevel.Low:
			return 'Must have verified email on account';
		case GuildVerificationLevel.Medium:
			return 'Must be registered on Discord for longer than 5 minutes';
		case GuildVerificationLevel.High:
			return 'Must be a member of the guild for longer than 10 minutes';
		case GuildVerificationLevel.VeryHigh:
			return 'Must have a verified phone number';
		default:
			break;
	}
};
