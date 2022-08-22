const { GuildPremiumTier } = require('discord.js');

/**
 *
 * @param {GuildPremiumTier} tier
 */
module.exports = (tier) => {
	return {
		[GuildPremiumTier.None]: 'No Boosts',
		[GuildPremiumTier.Tier1]: 'Level 1',
		[GuildPremiumTier.Tier2]: 'Level 2',
		[GuildPremiumTier.Tier3]: 'Level 3',
	}[tier];
};
