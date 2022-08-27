const { bold, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
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

		/** @type {import('discord.js').TextChannel} */
		const textChannel = channel;

		const messages = await channel.messages.fetch().then(
			/** @param {Promise<import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>>} m */
			(m) => m,
		);
		const botColor = await interaction.guild.members.fetch(interaction.client.user.id).then((res) => res.displayHexColor);

		const embed = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			});

		if (!messages.first().deletable) {
			embed.setTitle('Something Went Wrong');
			embed.setDescription("You don't have appropiate permissions to delete messages.");
			return interaction.reply({ embeds: [embed], ephemeral: true }).catch((err) => console.error(err));
		}

		if (member) {
			/** @type {Number} */
			let i = 0;

			/** @type {import('discord.js').Message[]} */
			const filteredMessages = [];
			messages.filter((message) => {
				if (message.author.id === member.id && amount > i) {
					filteredMessages.push(message);
					i++;
				}
			});

			if (filteredMessages.length > 50) {
				embed.setTitle('Amount Too Large');
				embed.setDescription(`You can only delete up to ${bold('50')} messages at a time.`);
				return interaction.reply({ embeds: [embed], ephemeral: true }).catch((err) => console.error(err));
			}

			return textChannel
				.bulkDelete(filteredMessages, true)
				.then(async (msg) => {
					embed.setTitle('Message Deleted');
					embed.setDescription(`Deleted ${bold(`${msg.size}`)} ${pluralize('message', msg.size)} from ${member}.`);
					await interaction.reply({ embeds: [embed], ephemeral: true });
				})
				.catch((err) => console.error(err));
		}

		if (amount > 50) {
			embed.setTitle('Amount Too Large');
			embed.setDescription(`You can only delete up to ${bold('50')} messages at a time.`);
			return interaction.reply({ embeds: [embed], ephemeral: true }).catch((err) => console.error(err));
		}

		await textChannel
			.bulkDelete(amount, true)
			.then(async (msg) => {
				embed.setTitle('Message Deleted');
				embed.setDescription(`Deleted ${bold(`${msg.size}`)} ${pluralize('message', msg.size)}.`);
				await interaction.reply({ embeds: [embed], ephemeral: true });
			})
			.catch(async (err) => {
				console.error(err);
				embed.setTitle('Something Went Wrong');
				embed.setDescription(err.message);
				await interaction.reply({ embeds: [embed], ephemeral: true });
			});
	},
};
