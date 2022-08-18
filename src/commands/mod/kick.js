const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member from the server.')
		.addUserOption((option) => option.setName('member').setDescription('The member to kick.').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for kicking the member.')),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		let reason = interaction.options.getString('reason') || 'No reason provided';
		const member = await interaction.guild.members.fetch(user.id).catch((err) => console.error(err));

		if (!user) {
			await interaction.reply({ content: 'You must specify a member to kick.', ephemeral: true });
			return;
		}

		if (!user.kickable) {
			await interaction.reply({ content: 'You cannot kick this member.', ephemeral: true });
			return;
		}

		await member.kick(reason).catch((err) => console.error(err));
		await interaction.reply({ content: `Successfully kicked ${user.tag}.`, ephemeral: true });
		await user
			.send({
				content: `You have been kicked from ${interaction.guild.name} for ${reason}.`,
			})
			.catch((err) => {
				console.error(err);
				console.log(`Could not send a DM to ${user.tag}.`);
			});
	},
};
