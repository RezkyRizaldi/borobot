const { ApplicationCommandType, Client, CommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User),
	type: 'Context Menu',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const embed = new EmbedBuilder()
			.setTitle(`${interaction.user.username}'s Avatar`)
			.setColor(0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription(`[Avatar URL](${interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })})`)
			.setImage(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }));

		await interaction.reply({ embeds: [embed] });
	},
};
