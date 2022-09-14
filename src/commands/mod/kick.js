const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

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
    const { options } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') || 'No reason';

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!member.kickable) {
        return interaction.editReply({
          content: "You don't have appropiate permissions to kick this member.",
        });
      }

      if (member.id === interaction.user.id) {
        return interaction.editReply({ content: "You can't kick yourself." });
      }

      await member.kick(reason).then(async (m) => {
        await interaction.editReply({
          content: `Successfully ${bold('kicked')} ${m}.`,
        });

        await m
          .send({
            content: `You have been kicked from ${
              interaction.guild
            } for ${inlineCode(reason)}`,
          })
          .catch(async (err) => {
            console.error(err);

            await interaction.followUp({
              content: `Could not send a DM to ${m}.`,
              ephemeral: true,
            });
          });
      });
    });
  },
};
