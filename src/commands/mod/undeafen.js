const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('undeafen')
    .setDescription('👂 Undeafen a member from voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to undeafen from.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for undeafen the member.'),
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
    const reason = options.getString('reason') || 'No reason';

    if (!member.voice.channel) {
      return interaction.reply({
        content: 'This member is not connected to a voice channel.',
        ephemeral: true,
      });
    }

    if (member.voice.serverDeaf) {
      return interaction.reply({
        content: "This member isn't being deafen.",
        ephemeral: true,
      });
    }

    await member.voice
      .setDeaf(false, reason)
      .then(
        async (m) =>
          await interaction.reply({
            content: `Successfully ${bold('undeafen')} ${m}.`,
            ephemeral: true,
          }),
      )
      .catch((err) => console.error(err));
  },
};