/**
 *
 * @param {import('discord.js').PresenceStatus} presenceStatus
 * @returns {String} The user presence status.
 */
module.exports = (presenceStatus) => {
	return {
		online: '🟢 Online',
		idle: '🌙 Idle',
		dnd: '🔴 Do Not Disturb',
		invisible: '⚫ Offline',
	}[presenceStatus];
};
