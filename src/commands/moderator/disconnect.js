const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('🔌 Disconnect a member from voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to disconnect from.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for disconnecting the member.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { locale, options } = interaction;

    await changeLanguage(locale);

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') ?? t('misc.noReason');
    const { voice } = member;

    await interaction.deferReply();

    if (!voice.channel) throw t('global.error.channel.connect', { member });

    await voice.disconnect(reason);

    await interaction.editReply({
      content: t('global.success.disconnect', {
        status: bold(t('misc.disconnect')),
        member,
      }),
    });
  },
};
