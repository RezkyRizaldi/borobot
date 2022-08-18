const { ApplicationCommandType, CommandInteraction, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User),
	type: 'Context Menu',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({ content: interaction.targetUser.displayAvatarURL({ dynamic: true }) });
	},
};
