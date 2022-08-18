const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('reactor').setDescription('Reacts to the message you reply to with the emoji you provide.'),
	type: 'Chat Input',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const message = await interaction.reply({ content: 'React here!', fetchReply: true });

		const filter = (user) => {
			return user.id === interaction.user.id;
		};

		message
			.awaitReactions({ filter, max: 4, time: 10000, errors: ['time'] })
			.then((collected) => console.log(collected.size))
			.catch((collected) => console.error(`After a minute, only ${collected.size} out of 4 reacted.`));
	},
};
