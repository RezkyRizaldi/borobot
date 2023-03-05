const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('🔨 Kick a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to kick.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for kicking the member.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, locale, options, user } = interaction;

    await changeLanguage(locale);

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') ?? t('misc.noReason');

    await interaction.deferReply();

    if (!guild) throw t('global.error.guild');

    if (!member.kickable) throw t('global.error.kick.perm', { member });

    if (member.id === user.id) throw t('global.error.kick.yourself');

    await member.kick(reason);

    await interaction.editReply({
      content: t('global.success.kick.channel', {
        status: bold(t('misc.kick')),
        member,
      }),
    });

    if (!member.user.bot) {
      return await member
        .send({
          content: t('global.success.ban.user', {
            from: bold(guild),
            reason: inlineCode(reason),
          }),
        })
        .catch(async () => {
          await interaction.followUp({
            content: t('global.error.kick.user', {
              user: inlineCode(member),
            }),
            ephemeral: true,
          });
        });
    }
  },
};
