const { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('permission').setDescription("This command requires the 'ADMINISTRATOR' permission.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	type: 'Chat Input',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const { roles } = interaction.member;
		const role = await interaction.guild.roles.fetch('792656317906157588').catch((err) => console.error(err));
		const testRole = await interaction.guild.roles
			.create({
				name: 'test',
				permissions: PermissionFlagsBits.KickMembers,
			})
			.catch((err) => console.error(err));

		if (roles.cache.has('792656317906157588')) {
			await interaction.deferReply({ fetchReply: true });

			await roles.remove(role).catch((err) => console.error(err));
			await interaction.editReply({
				content: `${role.name} successfully removed!`,
			});
		} else {
			await interaction.deferReply({ fetchReply: true });

			await interaction.editReply({ content: 'You do not have the required permissions to use this command.' });
		}

		await roles.add(testRole).catch((err) => console.error(err));
		await testRole.setPermissions([PermissionFlagsBits.BanMembers]).catch((err) => console.error(err));

		const channel = await interaction.guild.channels.create({
			name: 'test',
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: testRole.id,
					allow: [PermissionFlagsBits.ViewChannel],
				},
			],
		});

		await channel.permissionOverwrites
			.edit(testRole.id, {
				SendMessages: false,
			})
			.catch((err) => console.error(err));
	},
};
