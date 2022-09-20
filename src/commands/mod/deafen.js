const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deafen')
    .setDescription('🦻 Deafen a member from voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to deafen from.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for deafen the member.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') ?? 'No reason';
    const { voice } = member;

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!voice.channel) {
        return interaction.editReply({
          content: `${member} is not connected to a voice channel.`,
        });
      }

      if (voice.serverDeaf) {
        return interaction.editReply({
          content: `${member} is already being deafen.`,
        });
      }

      await voice.setDeaf(true, reason).then(
        async (m) =>
          await interaction.editReply({
            content: `Successfully ${bold('deafen')} ${m}.`,
          }),
      );
    });
  },
};
