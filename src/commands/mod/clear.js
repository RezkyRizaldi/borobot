const { bold, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, userMention, Collection } = require('discord.js');
const pluralize = require('pluralize');

const { groupMessageByAuthor } = require('../../utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes a specifc amount of messages from a channel or guild member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption((option) => option.setName('amount').setDescription('The amount of messages to delete.').setRequired(true))
		.addUserOption((option) => option.setName('member').setDescription('The member to delete messages from.'))
		.addRoleOption((option) => option.setName('role').setDescription('The members with role to delete messages from.')),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { channel, options } = interaction;
		const amount = options.getInteger('amount');
		const member = options.getMember('member');
		const role = options.getRole('role');

		/** @type {import('discord.js').TextChannel} */
		const textChannel = channel;

		/** @type {import('discord.js').Collection<String, import('discord.js').Message>} */
		const messages = await channel.messages
			.fetch()
			.then((msgs) => msgs)
			.catch((err) => console.error(err));

		const botColor = await interaction.guild.members.fetch(interaction.client.user.id).then((res) => res.displayHexColor);
		const embed = new EmbedBuilder()
			.setTitle('Message Deleted')
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			});

		if (!messages.size) return interaction.reply({ content: `${textChannel} doesn't have any message.`, ephemeral: true });

		if (!messages.first().deletable) return interaction.reply({ content: "You don't have appropiate permissions to delete messages.", ephemeral: true });

		if (amount <= 0) return interaction.reply({ content: 'Please specify the message amount from 1 to 50.', ephemeral: true });

		if (amount > 50) return interaction.reply({ content: `You can only delete up to ${bold('50')} messages at a time.`, ephemeral: true });

		switch (true) {
			case !!member && !!role: {
				const membersWithRole = interaction.guild.members.cache.filter((m) => m.roles.cache.has(role.id)).map((m) => m.id);

				/** @type {Number} */
				let i = 0;

				const filteredMessages = new Collection();
				messages.filter((message) => {
					if ((message.author.id === member.id || membersWithRole.includes(message.author.id)) && amount > i) {
						filteredMessages.set(message.id, message);
						i++;
					}
				});

				if (!filteredMessages.size) return interaction.reply({ content: `members with role ${role} doesn't have any message in ${textChannel}`, ephemeral: true });

				if (filteredMessages.size > 50) return interaction.reply({ content: `You can only delete up to ${bold('50')} messages at a time.`, ephemeral: true });

				return textChannel
					.bulkDelete(filteredMessages, true)
					.then(async () => {
						const groupedMessages = groupMessageByAuthor(filteredMessages);
						const response = groupedMessages.map((msgs) => `Deleted ${bold(`${msgs.length}`)} ${pluralize('message', msgs.length)} from ${userMention(msgs[0].author.id)}`).join('\n');

						embed.setDescription(response);

						await interaction.reply({ embeds: [embed], ephemeral: true });
					})
					.catch((err) => console.error(err));
			}

			case !!member: {
				/** @type {Number} */
				let i = 0;

				const filteredMessages = new Collection();
				messages.filter((message) => {
					if (message.author.id === member.id && amount > i) {
						filteredMessages.set(message.id, message);
						i++;
					}
				});

				if (!filteredMessages.size) return interaction.reply({ content: `${member} doesn't have any message in ${textChannel}`, ephemeral: true });

				if (filteredMessages.size > 50) return interaction.reply({ content: `You can only delete up to ${bold('50')} messages at a time.`, ephemeral: true });

				return textChannel
					.bulkDelete(filteredMessages, true)
					.then(async (msg) => {
						embed.setDescription(`Deleted ${bold(`${msg.size}`)} ${pluralize('message', msg.size)} from ${member}.`);
						await interaction.reply({ embeds: [embed], ephemeral: true });
					})
					.catch((err) => console.error(err));
			}

			case !!role: {
				const membersWithRole = interaction.guild.members.cache.filter((m) => m.roles.cache.has(role.id)).map((m) => m.id);

				/** @type {Number} */
				let i = 0;

				const filteredMessages = new Collection();
				messages.filter((message) => {
					if (membersWithRole.includes(message.author.id) && amount > i) {
						filteredMessages.set(message.id, message);
						i++;
					}
				});

				if (!filteredMessages.size) return interaction.reply({ content: `members with role ${role} doesn't have any message in ${textChannel}`, ephemeral: true });

				if (filteredMessages.size > 50) return interaction.reply({ content: `You can only delete up to ${bold('50')} messages at a time.`, ephemeral: true });

				return textChannel
					.bulkDelete(filteredMessages, true)
					.then(async () => {
						const groupedMessages = groupMessageByAuthor(filteredMessages);
						const response = groupedMessages.map((msgs) => `Deleted ${bold(`${msgs.length}`)} ${pluralize('message', msgs.length)} from ${userMention(msgs[0].author.id)}`).join('\n');

						embed.setDescription(response);

						await interaction.reply({ embeds: [embed], ephemeral: true });
					})
					.catch((err) => console.error(err));
			}
		}

		await textChannel
			.bulkDelete(amount, true)
			.then(async (msg) => {
				embed.setDescription(`Deleted ${bold(`${msg.size}`)} ${pluralize('message', msg.size)}.`);
				await interaction.reply({ embeds: [embed], ephemeral: true });
			})
			.catch(async (err) => {
				console.error(err);
				await interaction.followUp({ content: err.message, ephemeral: true });
			});
	},
};
