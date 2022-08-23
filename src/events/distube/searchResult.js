const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
	name: DistubeEvents.SEARCH_RESULT,

	/**
	 *
	 * @param {import('discord.js').Message} message
	 * @param {import('distube').SearchResult} result
	 * @param {String} query
	 */
	async execute(message, result, query) {
		let i = 0;

		await message.channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor('Red')
					.setDescription(`${query} **Choose an option from below**\n${result.map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n')}\n*Enter anything else or wait 60 seconds to cancel*`),
			],
		});
	},
};
