const { PresenceStatus } = require('discord.js');

/**
 *
 * @param {PresenceStatus} presenceStatus
 */
module.exports = (presenceStatus) => {
	switch (presenceStatus) {
		case 'online':
			return `🟢 Online`;

		case 'idle':
			return `🌙 Idle`;

		case 'dnd':
			return `🔴 Do Not Disturb`;

		case 'invisible':
			return `⚫ Offline`;

		default:
			break;
	}
};
