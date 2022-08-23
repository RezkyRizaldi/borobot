const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
	name: DistubeEvents.ERROR,

	/**
	 *
	 * @param {import('discord.js').BaseGuildTextChannel} channel
	 * @param {Error} err
	 */
	async execute(channel, err) {
		if (channel) return channel.send({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`An error encountered: ${err.toString().slice(0, 1974)}`)] });

		console.error(err);
	},
};
