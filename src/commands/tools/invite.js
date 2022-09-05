const { EmbedBuilder, hyperlink, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('invite').setDescription("🔗 Grab the bot's invite link."),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const botColor = await interaction.guild.members.fetch(interaction.client.user.id).then((res) => res.displayHexColor);

		const embed = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction
			.deferReply({ fetchReply: true })
			.then(async () => {
				embed.setTitle(`${interaction.client.user.username}'s Invite Link`);
				embed.setDescription(
					`Here's your ${hyperlink('invite link', 'https://discord.com/api/oauth2/authorize?client_id=1009685216580882512&permissions=8&scope=applications.commands%20bot', 'Get your invite link here')} for invite me to your server!`,
				);
				embed.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }));

				await interaction.editReply({ embeds: [embed] });
			})
			.catch((err) => console.error(err))
			.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
	},
};
