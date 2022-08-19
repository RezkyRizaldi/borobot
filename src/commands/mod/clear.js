const { Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes a specifc amount of messages from a channel or guild member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption((option) => option.setName('amount').setDescription('The amount of messages to delete.').setRequired(true))
		.addUserOption((option) => option.setName('member').setDescription('The member to delete messages from.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { channel, options } = interaction;

		const amount = options.getInteger('amount');
		const member = options.getMember('member');

		const messages = await channel.messages.fetch();
		const response = new EmbedBuilder()
			.setColor(0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

		if (messages.first().deletable) {
			if (member) {
				let i = 0;
				const filteredMessages = [];
				messages.filter((message) => {
					if (message.author.id === member.id && amount > i) {
						filteredMessages.push(message);
						i++;
					}
				});

				await channel
					.bulkDelete(filteredMessages, true)
					.then((messages) => {
						response.setTitle('Successfully Deleted');
						response.setDescription(`Deleted ${messages.size} messages from ${member}.`);
						interaction.reply({ embeds: [response] });
					})
					.catch((err) => console.error(err));
			} else {
				await channel
					.bulkDelete(amount, true)
					.then((messages) => {
						response.setTitle('Successfully Deleted');
						response.setDescription(`Deleted ${messages.size} messages.`);
						interaction.reply({ embeds: [response] });
					})
					.catch((err) => console.error(err));
			}
		} else {
			response.setTitle('Something Went Wrong');
			response.setDescription("Message can't be deleted. Please check my permissions.");
			interaction.reply({ embeds: [response] });
		}
	},
};
