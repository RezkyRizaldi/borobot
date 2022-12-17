const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');

const { timeoutChoices } = require('../../constants');
const { generateEmbed, generatePagination } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('🕒 Timeout command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('apply')
        .setDescription('🔐 Apply Timeout for specified member.')
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('cease')
        .setDescription('🔓 Cease Timeout from specified member.')
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('📄 Show list of timed out members.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options, user } = interaction;

    if (!guild) return;

    await interaction.deferReply();

    const reason = options.getString('reason') ?? 'No reason';

    return {
      apply: async () => {
        /** @type {import('discord.js').GuildMember} */
        const member = options.getMember('member', true);
        const duration = options.getInteger('duration', true);

        if (!member.moderatable) {
          throw `You don't have appropiate permissions to timeout ${member}.`;
        }

        if (member.id === user.id) throw "You can't timeout yourself.";

        if (member.isCommunicationDisabled()) {
          throw `${member} is already timed out. Available back ${time(
            member.communicationDisabledUntil,
            TimestampStyles.RelativeTime,
          )}`;
        }

        await member.timeout(duration, reason);

        await interaction.editReply({
          content: `Successfully ${bold(
            'timed out',
          )} ${member}. Available back ${time(
            member.communicationDisabledUntil,
            TimestampStyles.RelativeTime,
          )}.`,
        });

        if (!member.user.bot) {
          await member
            .send({
              content: `You have been ${bold('timed out')} from ${bold(
                guild,
              )} for ${inlineCode(reason)}.`,
            })
            .catch(async () => {
              await interaction.followUp({
                content: `Could not send a DM to ${member}.`,
              });
            });
        }
      },
      cease: async () => {
        /** @type {import('discord.js').GuildMember} */
        const member = options.getMember('member', true);

        if (!member.moderatable) {
          throw `You don't have appropiate permissions to removing the timeout from ${member}.`;
        }

        if (member.id === user.id) {
          throw "You can't remove timeout by yourself.";
        }

        if (!member.isCommunicationDisabled()) {
          throw "This member isn't being timed out.";
        }

        await member.timeout(null, reason);

        await interaction.editReply({
          content: `Successfully ${bold('removing timeout')} from ${member}.`,
        });

        if (!member.user.bot) {
          await member
            .send({
              content: `Congratulations! Your ${bold(
                'timeout',
              )} has passed from ${bold(guild)}.`,
            })
            .catch(async () => {
              await interaction.followUp({
                content: `Could not send a DM to ${member}.`,
                ephemeral: true,
              });
            });
        }
      },
      list: async () => {
        const timedoutMembers = guild.members.cache.filter((m) =>
          m.isCommunicationDisabled(),
        );

        if (!timedoutMembers.size) {
          throw `No one being timed out in ${bold(guild)}.`;
        }

        const descriptions = [...timedoutMembers.values()].map(
          (timedoutMember, index) =>
            `${bold(`${index + 1}.`)} ${timedoutMember} (${
              timedoutMember.user.username
            })`,
        );

        if (timedoutMembers.size > 10) {
          return await generatePagination({ interaction, limit: 10 })
            .setAuthor({
              name: `🚫 Timed Out Member Lists (${timedoutMembers.size})`,
            })
            .setDescriptions(descriptions)
            .render();
        }

        const embed = generateEmbed({ interaction })
          .setAuthor({
            name: `🚫 Timed Out Member Lists (${timedoutMembers.size})`,
          })
          .setDescription(descriptions.join('\n'));

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
