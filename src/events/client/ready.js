const { ActivityType, Client } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,

	/**
	 *
	 * @param {Client} client
	 */
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);
		client.user.setActivity('with you!', { type: ActivityType.Playing });
	},
};
