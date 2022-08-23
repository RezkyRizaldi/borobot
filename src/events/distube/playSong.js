const { EmbedBuilder, inlineCode } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
	name: DistubeEvents.PLAY_SONG,

	/**
	 *
	 * @param {import('distube').Queue} queue
	 * @param {import('distube').Song} song
	 */
	async execute(queue, song) {
		const embed = new EmbedBuilder()
			.setColor(0xfcc9b9)
			.setTimestamp(Date.now())
			.setDescription(
				`Playing ${inlineCode(song.name)} - ${inlineCode(song.formattedDuration)}\nRequested by ${song.user}\nVolume: ${inlineCode(`${queue.volume}%`)} | Filter: ${inlineCode(queue.filters.names.join(', ') || 'Off')} | Loop: ${inlineCode(
					queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off',
				)} | Autoplay: ${inlineCode(queue.autoplay ? 'On' : 'Off')}`,
			)
			.setAuthor({
				name: 'Playing Music',
				iconURL: song.user.displayAvatarURL({ dynamic: true }),
			})
			.setFooter({
				text: queue.client.user.username,
				iconURL: queue.client.user.displayAvatarURL({ dynamic: true }),
			});

		await queue.textChannel.send({ embeds: [embed] });
	},
};
