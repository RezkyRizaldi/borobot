const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

const { slowmodeChoices } = require('../../constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('🐌 Set the slowmode for a text channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('on')
        .setDescription('🐌 Turn on slowmode in this channel.')
        .addIntegerOption((option) =>
          option
            .setName('duration')
            .setDescription('⏱️ The duration of the slowmode.')
            .addChoices(...slowmodeChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for turn on the slowmode.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('off')
        .setDescription('🐌 Turn off slowmode in this channel.')
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for turn off the slowmode.'),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: import('discord.js').TextChannel }} */
    const { channel } = interaction;

    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') ?? 'No reason';

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      switch (interaction.options.getSubcommand()) {
        case 'on':
          if (channel.rateLimitPerUser > 0) {
            return interaction.editReply({
              content: `${channel} slowmode already turned on for ${channel.rateLimitPerUser} seconds.`,
            });
          }

          return channel.setRateLimitPerUser(duration, reason).then(
            async (ch) =>
              await interaction.editReply({
                content: `Successfully ${bold(
                  'turned on',
                )} slowmode in ${ch} for ${inlineCode(`${duration} seconds`)}.`,
              }),
          );

        case 'off':
          if (channel.rateLimitPerUser === 0) {
            return interaction.editReply({
              content: `${channel} slowmode is'nt being turned on.`,
            });
          }

          return channel.setRateLimitPerUser(0, reason).then(
            async (ch) =>
              await interaction.editReply({
                content: `Successfully ${bold(
                  'turned off',
                )} slowmode in ${ch}.`,
              }),
          );
      }
    });
  },
};
