const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');

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
    const { locale, options } = interaction;

    await interaction.deferReply();

    await changeLanguage(locale);

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') ?? t('misc.noReason');
    const { voice } = member;

    if (!voice.channel) throw t('global.error.channel.connect', { member });

    if (voice.serverDeaf) throw t('global.error.deafen', { member });

    await voice.setDeaf(true, reason);

    await interaction.editReply({
      content: t('global.success.deafen', {
        status: bold(t('misc.deafen')),
        member,
      }),
    });
  },
};
