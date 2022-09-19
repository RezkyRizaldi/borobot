const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('🔓 Unban a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName('user_id')
        .setDescription('👤 The user id to unban.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for unbanning the user.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options } = interaction;

    const userId = options.get('user_id')?.value;
    const reason = options.getString('reason') ?? 'No reason';

    const bannedUser = guild.bans.cache.find((ban) => ban.user.id === userId);

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!bannedUser) {
        return interaction.editReply({
          content: "This user isn't banned.",
        });
      }

      await interaction.guild.members
        .unban(bannedUser, reason)
        .then(async (user) => {
          await interaction.editReply({
            content: `Successfully ${bold('unbanned')} ${user.tag}.`,
          });

          await user
            .send({
              content: `Congratulations! You have been unbanned from ${bold(
                guild,
              )} for ${inlineCode(reason)}`,
            })
            .catch(async (err) => {
              console.error(err);

              await interaction.followUp({
                content: `Could not send a DM to ${user}.`,
                ephemeral: true,
              });
            });
        });
    });
  },
};
