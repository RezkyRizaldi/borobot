const { GuildPremiumTier } = require('discord.js');

/**
 *
 * @param {GuildPremiumTier} tier
 */
module.exports = (tier) => {
	switch (tier) {
		case GuildPremiumTier.None:
			return 'No Boosts';
		case GuildPremiumTier.Tier1:
			return 'Level 1';
		case GuildPremiumTier.Tier2:
			return 'Level 2';
		case GuildPremiumTier.Tier3:
			return 'Level 3';
		default:
			break;
	}
};
