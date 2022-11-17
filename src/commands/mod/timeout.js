const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const { Pagination } = require('pagination.djs');

const { timeoutChoices } = require('../../constants');

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
    const { client, guild, options, user } = interaction;

    if (!guild) return;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    const reason = options.getString('reason') ?? 'No reason';

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      switch (options.getSubcommand()) {
        case 'apply': {
          /** @type {import('discord.js').GuildMember} */
          const member = options.getMember('member', true);
          const duration = options.getInteger('duration', true);

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

          return member.timeout(duration, reason).then(async (m) => {
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
        }

        case 'cease': {
          /** @type {import('discord.js').GuildMember} */
          const member = options.getMember('member', true);

          if (!member.moderatable) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to removing the timeout from ${member}.`,
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

          return member.timeout(null, reason).then(async (m) => {
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
        }

        case 'list': {
          const timedoutMembers = guild.members.cache.filter((m) =>
            m.isCommunicationDisabled(),
          );

          if (!timedoutMembers.size) {
            return interaction.editReply({
              content: `No one being timed out in ${bold(guild)}.`,
            });
          }

          const descriptions = [...timedoutMembers.values()].map(
            (timedoutMember, index) =>
              `${bold(`${index + 1}.`)} ${timedoutMember} (${
                timedoutMember.user.username
              })`,
          );

          if (timedoutMembers.size > 10) {
            const pagination = new Pagination(interaction, {
              limit: 10,
            });

            pagination.setColor(guild.members.me?.displayHexColor ?? null);
            pagination.setTimestamp(Date.now());
            pagination.setFooter({
              text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            });
            pagination.setAuthor({
              name: `🚫 Timed Out Member Lists (${timedoutMembers.size})`,
            });
            pagination.setDescriptions(descriptions);

            pagination.buttons = {
              ...pagination.buttons,
              extra: new ButtonBuilder()
                .setCustomId('jump')
                .setEmoji('↕️')
                .setDisabled(false)
                .setStyle(ButtonStyle.Secondary),
            };

            paginations.set(pagination.interaction.id, pagination);

            return pagination.render();
          }

          const embed = new EmbedBuilder()
            .setColor(guild.members.me?.displayHexColor ?? null)
            .setTimestamp(Date.now())
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setAuthor({
              name: `🚫 Timed Out Member Lists (${timedoutMembers.size})`,
            })
            .setDescription(descriptions.join('\n'));

          return interaction.editReply({ embeds: [embed] });
        }
      }
    });
  },
};
