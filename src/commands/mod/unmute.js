const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔊 Unmute a member from voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to unmute from.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for unmute the member.'),
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

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!member.voice.channel) {
        return interaction.editReply({
          content: 'This member is not connected to a voice channel.',
        });
      }

      if (!member.voice.serverMute) {
        return interaction.editReply({
          content: "This member isn't being muted.",
        });
      }

      await member.voice.setMute(false, reason).then(
        async (m) =>
          await interaction.editReply({
            content: `Successfully ${bold('unmuted')} ${m}.`,
          }),
      );
    });
  },
};
