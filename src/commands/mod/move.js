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

    await interaction.deferReply();

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');

    /** @type {import('discord.js').BaseGuildVoiceChannel} */
    const channel = options.getChannel('channel', true);
    const reason = options.getString('reason') ?? 'No reason';
    const { voice } = member;

    if (!voice.channel) {
      throw 'This member is not connected to a voice channel.';
    }

    if (voice.channelId === channel.id) {
      throw `This member is already in ${channel}.`;
    }

    await voice.setChannel(channel, reason);

    return interaction.editReply({
      content: `Successfully ${bold('moved')} ${member} to ${channel}.`,
    });
  },
};
