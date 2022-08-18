const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('timeout a member from the server.')
		.addUserOption((option) => option.setName('member').setDescription('The member to timeout.').setRequired(true))
		.addIntegerOption((option) => option.setName('time').setDescription('The amount of time to timeout the member.'))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for timeouting the member.')),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		let reason = interaction.options.getString('reason') || 'No reason provided';
		let time = interaction.options.getInteger('time') || null;
		const member = await interaction.guild.members.fetch(user.id).catch((err) => console.error(err));

		if (!user) {
			await interaction.reply({ content: 'You must specify a member to do a timeout.', ephemeral: true });
			return;
		}

		await member.timeout(time * 60 * 1000, reason).catch((err) => console.error(err));
		await interaction.reply({ content: `Successfully timeout ${user.tag}.`, ephemeral: true });
		await user
			.send({
				content: `You have been timed out from ${interaction.guild.name} for ${reason}.`,
			})
			.catch((err) => {
				console.error(err);
				console.log(`Could not send a DM to ${user.tag}.`);
			});
	},
};
