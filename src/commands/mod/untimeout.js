const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('🕒 Remove timeout for a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to remove the timeout.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for removing the timeout.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options, user } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') ?? 'No reason';

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!member.moderatable) {
        return interaction.editReply({
          content:
            "You don't have appropiate permissions to removing the timeout from this member.",
        });
      }

      if (member.id === user.id) {
        return interaction.editReply({
          content: "You can't remove timeout by yourself.",
        });
      }

      if (!member.isCommunicationDisabled()) {
        return interaction.editReply({
          content: "This member isn't being timed out.",
        });
      }

      await member.timeout(null, reason).then(async (m) => {
        await interaction.editReply({
          content: `Successfully ${bold('removing timeout')} from ${m}.`,
        });

        await m
          .send({
            content: `Congratulations! Your ${bold(
              'timeout',
            )} has passed from ${bold(guild)}.`,
          })
          .catch(async (err) => {
            console.error(err);

            await interaction.followUp({
              content: `Could not send a DM to ${member}.`,
              ephemeral: true,
            });
          });
      });
    });
  },
};
