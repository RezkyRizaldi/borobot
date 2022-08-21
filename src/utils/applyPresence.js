/**
 *
 * @param {import('discord.js').PresenceStatus} presenceStatus
 */
module.exports = (presenceStatus) => {
	return {
		online: '🟢 Online',
		idle: '🌙 Idle',
		dnd: '🔴 Do Not Disturb',
		invisible: '⚫ Offline',
	}[presenceStatus];
};
