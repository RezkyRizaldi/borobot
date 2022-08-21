const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('embed').setDescription('Send an embed.'),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const botColor = await interaction.guild.members
			.fetch(interaction.client.user.id)
			.then((res) => res.displayHexColor)
			.catch((err) => console.error(err));

		const embed = new EmbedBuilder()
			.setTitle('Test Embed')
			.setDescription('This is a test embed.')
			.setColor(botColor || 0xfcc9b9)
			.setImage(interaction.client.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
				url: 'https://youtube.com/c/NotReallyClips',
			})
			.setFooter({
				text: interaction.client.user.tag,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			})
			.setURL('https://youtube.com/c/NotReallyClips')
			.setTimestamp(Date.now())
			.setFields([
				{
					name: 'Test Field 1',
					value: 'This is a test field',
					inline: true,
				},
				{
					name: 'Test Field 2',
					value: 'This is a test field',
					inline: true,
				},
			]);

		await interaction.reply({ embeds: [embed] });
	},
};
