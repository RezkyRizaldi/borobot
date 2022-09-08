const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

const { banChoices } = require('../../constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🚫 Ban a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to ban.')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('delete_messages')
        .setDescription(
          "💬 The amount of member's recent message history to delete.",
        )
        .addChoices(...banChoices)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for banning the member.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('user');
    const deleteMessageDays = options.getInteger('delete_messages');
    const reason = options.getString('reason') || 'No reason';

    if (!member.bannable) {
      return interaction.reply({
        content: "You don't have appropiate permissions to ban this member.",
        ephemeral: true,
      });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({
        content: "You can't ban yourself.",
        ephemeral: true,
      });
    }

    await member
      .ban({ deleteMessageDays, reason })
      .then(
        async (m) =>
          await interaction.reply({
            content: `Successfully ${bold('banned')} ${m.user.tag}.`,
            ephemeral: true,
          }),
      )
      .catch((err) => console.error(err));
  },
};
