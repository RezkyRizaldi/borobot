const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const pluralize = require('pluralize');

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
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { channel, options } = interaction;
		const amount = options.getInteger('amount');
		const member = options.getMember('member');
		const messages = await channel.messages.fetch().then((m) => m);
		const botColor = await interaction.guild.members.fetch(interaction.client.user.id).then((res) => res.displayHexColor);

		const response = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			});

		if (!messages.first().deletable) {
			response.setTitle('Something Went Wrong');
			response.setDescription("You don't have appropiate permissions to delete messages.");
			return interaction
				.reply({ embeds: [response] })
				.catch((err) => console.error(err))
				.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
		}

		if (member) {
			let i = 0;
			const filteredMessages = [];
			messages.filter((message) => {
				if (message.author.id === member.id && amount > i) {
					filteredMessages.push(message);
					i++;
				}
			});

			if (filteredMessages.length > 50) {
				response.setTitle('Amount Too Large');
				response.setDescription('You can only delete up to 50 messages at a time.');
				return interaction
					.reply({ embeds: [response] })
					.catch((err) => console.error(err))
					.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
			}

			return channel
				.bulkDelete(filteredMessages, true)
				.then(async (msg) => {
					response.setTitle('Message Deleted');
					response.setDescription(`Deleted ${pluralize('message', msg.size, true)} from ${member}.`);
					await interaction.reply({ embeds: [response] });
				})
				.catch((err) => console.error(err))
				.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
		}

		if (amount > 50) {
			response.setTitle('Amount Too Large');
			response.setDescription('You can only delete up to 50 messages at a time.');
			return interaction
				.reply({ embeds: [response] })
				.catch((err) => console.error(err))
				.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
		}

		await channel
			.bulkDelete(amount, true)
			.then((msg) => {
				response.setTitle('Message Deleted');
				response.setDescription(`Deleted ${pluralize('message', msg.size, true)}.`);
				interaction.reply({ embeds: [response] });
			})
			.catch((err) => {
				console.error(err);
				response.setTitle('Something Went Wrong');
				response.setDescription(err.message);
				interaction.reply({ embeds: [response] }).then(() => setTimeout(async () => await interaction.deleteReply(), 10000));
			})
			.finally(() => setTimeout(async () => await interaction.deleteReply(), 10000));
	},
};
