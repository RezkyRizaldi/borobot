const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');

const { timeoutChoices } = require('../../constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('🕒 Timeout a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to timeout.')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('duration')
        .setDescription('⏱️ The duration of the timeout.')
        .addChoices(...timeoutChoices)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('📃 The reason for timeouting the member.'),
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
    const duration = options.getInteger('duration');

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!member.moderatable) {
        return interaction.editReply({
          content: `You don't have appropiate permissions to timeout ${member}.`,
        });
      }

      if (member.id === user.id) {
        return interaction.editReply({
          content: "You can't timeout yourself.",
        });
      }

      if (member.isCommunicationDisabled()) {
        return interaction.editReply({
          content: `${member} is already timed out. Available back ${time(
            member.communicationDisabledUntil,
            TimestampStyles.RelativeTime,
          )}`,
        });
      }

      await member.timeout(duration, reason).then(async (m) => {
        await interaction.editReply({
          content: `Successfully ${bold(
            'timed out',
          )} ${m}. Available back ${time(
            m.communicationDisabledUntil,
            TimestampStyles.RelativeTime,
          )}.`,
        });

        await m
          .send({
            content: `You have been ${bold('timed out')} from ${bold(
              guild,
            )} for ${inlineCode(reason)}.`,
          })
          .catch(async (err) => {
            console.error(err);

            await interaction.followUp({
              content: `Could not send a DM to ${member}.`,
            });
          });
      });
    });
  },
};
