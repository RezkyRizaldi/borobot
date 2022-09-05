const { bold, inlineCode, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const { slowmodeChoices } = require('../../constants');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Slowmode command.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('on')
				.setDescription('Turn on slowmode in this channel.')
				.addIntegerOption((option) =>
					option
						.setName('duration')
						.setDescription('The duration of the slowmode.')
						.addChoices(...slowmodeChoices)
						.setRequired(true),
				)
				.addStringOption((option) => option.setName('reason').setDescription('The reason for turn on the slowmode.')),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('off')
				.setDescription('Turn off slowmode in this channel.')
				.addStringOption((option) => option.setName('reason').setDescription('The reason for turn off the slowmode.')),
		),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { channel, options } = interaction;

		const duration = options.getInteger('duration');
		const reason = options.getString('reason') || 'No reason';

		/** @type {import('discord.js').TextChannel} */
		const textChannel = channel;

		switch (options.getSubcommand()) {
			case 'on':
				return textChannel
					.setRateLimitPerUser(duration, reason)
					.then(
						/**
						 *
						 * @param {import('discord.js').TextChannel} ch
						 */
						async (ch) => await interaction.reply({ content: `Successfully ${bold('turned on')} slowmode in ${ch} for ${inlineCode(`${duration} seconds`)}.`, ephemeral: true }),
					)
					.catch((err) => console.error(err));

			case 'off':
				if (textChannel.rateLimitPerUser === 0) return interaction.reply({ content: `${textChannel} slowmode is'nt being turned on.`, ephemeral: true });

				return textChannel
					.setRateLimitPerUser(0, reason)
					.then(
						/**
						 *
						 * @param {import('discord.js').TextChannel} ch
						 */
						async (ch) => await interaction.reply({ content: `Successfully ${bold('turned off')} slowmode in ${ch}.`, ephemeral: true }),
					)
					.catch((err) => console.error(err));
		}
	},
};
