const {
  bold,
  inlineCode,
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
    const { guild, options, user } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const deleteMessageDays = options.getInteger('delete_messages');
    const reason = options.getString('reason') ?? 'No reason';

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!member.bannable) {
        return interaction.editReply({
          content: `You don't have appropiate permissions to ban ${member}.`,
        });
      }

      if (member.id === user.id) {
        return interaction.editReply({
          content: "You can't ban yourself.",
        });
      }

      await member.ban({ deleteMessageDays, reason }).then(async (m) => {
        await interaction.editReply({
          content: `Successfully ${bold('banned')} ${m.user.tag}.`,
        });

        await m
          .send({
            content: `You have been banned from ${bold(guild)} for ${inlineCode(
              reason,
            )}`,
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
