const {
  bold,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('🚚 Move a member to specific voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to move.')
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('🔊 The voice channel destination.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for moving the member.'),
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
    const channel = options.getChannel('channel');
    const reason = options.getString('reason') || 'No reason';

    if (!member.voice.channel) {
      return interaction.reply({
        content: 'This member is not connected to a voice channel.',
        ephemeral: true,
      });
    }

    if (member.voice.channelId === channel.id) {
      return interaction.reply({
        content: `This member is already in ${channel}.`,
        ephemeral: true,
      });
    }

    await member.voice
      .setChannel(channel, reason)
      .then(
        async (m) =>
          await interaction.reply({
            content: `Successfully ${bold('moved')} ${m} to ${channel}.`,
            ephemeral: true,
          }),
      )
      .catch((err) => console.error(err));
  },
};
