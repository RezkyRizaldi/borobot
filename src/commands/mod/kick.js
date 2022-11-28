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
    const { guild, options, user } = interaction;

    await interaction.deferReply();

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const reason = options.getString('reason') ?? 'No reason';

    if (!member.kickable) {
      throw `You don't have appropiate permissions to kick ${member}.`;
    }

    if (member.id === user.id) throw "You can't kick yourself.";

    await member.kick(reason);

    await interaction.editReply({
      content: `Successfully ${bold('kicked')} ${member}.`,
    });

    if (!member.user.bot) {
      return member
        .send({
          content: `You have been kicked from ${bold(guild)} for ${inlineCode(
            reason,
          )}`,
        })
        .catch(async () => {
          await interaction.followUp({
            content: `Could not send a DM to ${member}.`,
            ephemeral: true,
          });
        });
    }
  },
};
