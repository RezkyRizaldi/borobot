const { ApplicationCommandType, CommandInteraction, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('getAvatar').setType(ApplicationCommandType.User),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({ content: interaction.targetUser.displayAvatarURL({ dynamic: true }) });
	},
};
