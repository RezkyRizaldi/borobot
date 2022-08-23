const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
	name: DistubeEvents.EMPTY,

	/**
	 *
	 * @param {import('distube').Queue} queue
	 */
	async execute(queue) {
		await queue.textChannel.send({ embeds: [new EmbedBuilder().setColor('Red').setDescription('Voice channel is empty! Leaving the channel...')] });
	},
};
