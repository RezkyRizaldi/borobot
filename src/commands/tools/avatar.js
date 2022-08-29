const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User),
	type: 'Context Menu',

	/**
	 *
	 * @param {import('discord.js').ContextMenuCommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.guild.members
			.fetch(interaction.targetId)
			.then(async (target) => {
				const embed = new EmbedBuilder()
					.setTitle(`${target.user.username}'s Avatar`)
					.setColor(target.displayHexColor || 0xfcc9b9)
					.setTimestamp(Date.now())
					.setFooter({
						text: target.client.user.username,
						iconURL: target.client.user.displayAvatarURL({ dynamic: true }),
					})
					.setDescription(hyperlink('Avatar URL', target.user.displayAvatarURL({ dynamic: true, size: 4096 }), 'Click here to view the avatar.'))
					.setImage(target.user.displayAvatarURL({ dynamic: true, size: 4096 }));

				await interaction.deferReply({ fetchReply: true }).then(async () => await interaction.editReply({ embeds: [embed] }));
			})
			.catch((err) => console.error(err))
			.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
	},
};
