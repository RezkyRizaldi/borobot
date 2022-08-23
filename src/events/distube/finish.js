const { EmbedBuilder } = require('discord.js');
const { Events: DistubeEvents } = require('distube');

module.exports = {
	name: DistubeEvents.FINISH,

	/**
	 *
	 * @param {import('distube').Queue} queue
	 */
	async execute(queue) {
		const embed = new EmbedBuilder()
			.setTitle('⏹️ Queue Finished')
			.setColor(0xfcc9b9)
			.setTimestamp(Date.now())
			.setDescription('The queue has been finished.')
			.setFooter({
				text: queue.client.user.username,
				iconURL: queue.client.user.displayAvatarURL({ dynamic: true }),
			});

		await queue.textChannel.send({ embeds: [embed] });
	},
};
