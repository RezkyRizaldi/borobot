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

    await interaction.deferReply();

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member', true);
    const reason = options.getString('reason') ?? 'No reason';
    const { voice } = member;

    if (!voice.channel) {
      throw `${member} isn't connected to a voice channel.`;
    }

    if (!voice.serverDeaf) throw `${member} isn't being deafen.`;

    await voice.setDeaf(false, reason);

    await interaction.editReply({
      content: `Successfully ${bold('undeafen')} ${member}.`,
    });
  },
};
