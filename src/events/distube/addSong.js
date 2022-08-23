const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
	name: DistubeEvents.ADD_SONG,

	/**
	 *
	 * @param {import('distube').Queue} queue
	 * @param {import('distube').Song} song
	 */
	async execute(queue, song) {
		await queue.textChannel.send({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)] });
	},
};
