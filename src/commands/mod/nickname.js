const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('🔤 Manage members nickname.')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageNicknames | PermissionFlagsBits.ChangeNickname,
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('reset')
        .setDescription("📝 Reset the member's nickname.")
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('👤 The member to set.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription(
              "📃 The reason for resetting the member's nickname.",
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription("✏️ Set the member's nickname.")
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('👤 The member to set.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('nickname')
            .setDescription('👤 The nickname to set.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription("📃 The reason for setting the member's nickname."),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member', true);
    const nickname = options.getString('nickname', true);
    const reason = options.getString('reason') ?? 'No reason';

    return interaction.deferReply({ ephemeral: true }).then(async () => {
      switch (options.getSubcommand()) {
        case 'set':
          if (member.nickname && member.nickname === nickname) {
            return interaction.editReply({
              content: 'You have to specify different nickname.',
            });
          }

          return member.setNickname(nickname, reason).then(
            async (m) =>
              await interaction.editReply({
                content: `Successfully set ${m}'s nickname.`,
              }),
          );

        case 'reset':
          if (!member.nickname) {
            return interaction.editReply({
              content: `${member} doesn't have any nickname.`,
            });
          }

          return member.setNickname(null, reason).then(
            async (m) =>
              await interaction.editReply({
                content: `Successfully reset ${m}'s nickname.`,
              }),
          );
      }
    });
  },
};
