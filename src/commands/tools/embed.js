const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('embed').setDescription('Send an embed'),
	async execute(interaction, client) {
		const embed = new EmbedBuilder()
			.setTitle('Test Embed')
			.setDescription('This is a test embed')
			.setColor(0xfcc9b9)
			.setImage(client.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
				url: 'https://youtube.com/c/NotReallyClips',
			})
			.setFooter({
				text: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
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
