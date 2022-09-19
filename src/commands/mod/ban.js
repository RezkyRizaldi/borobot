const {
  bold,
  EmbedBuilder,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { Pagination } = require('pagination.djs');

const { banChoices } = require('../../constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🚫 Ban command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('🔒 Ban a member from the server.')
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('🔓 Unban a user from the server.')
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
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('📄 Show list of banned user.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options, user } = interaction;

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      switch (options.getSubcommand()) {
        case 'add': {
          /** @type {import('discord.js').GuildMember} */
          const member = options.getMember('member');
          const deleteMessageDays = options.getInteger('delete_messages');
          const reason = options.getString('reason') ?? 'No reason';

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

          return member.ban({ deleteMessageDays, reason }).then(async (m) => {
            await interaction.editReply({
              content: `Successfully ${bold('banned')} ${m.user.tag}.`,
            });

            await m
              .send({
                content: `You have been banned from ${bold(
                  guild,
                )} for ${inlineCode(reason)}`,
              })
              .catch(async (err) => {
                console.error(err);

                await interaction.followUp({
                  content: `Could not send a DM to ${m}.`,
                  ephemeral: true,
                });
              });
          });
        }

        case 'remove': {
          const userId = options.get('user_id')?.value;
          const reason = options.getString('reason') ?? 'No reason';

          const bannedUser = guild.bans.cache.find(
            (ban) => ban.user.id === userId,
          );

          if (!bannedUser) {
            return interaction.editReply({
              content: "This user isn't banned.",
            });
          }

          return guild.members.unban(bannedUser, reason).then(async (u) => {
            await interaction.editReply({
              content: `Successfully ${bold('unbanned')} ${u.tag}.`,
            });

            await u
              .send({
                content: `Congratulations! You have been unbanned from ${bold(
                  guild,
                )} for ${inlineCode(reason)}`,
              })
              .catch(async (err) => {
                console.error(err);

                await interaction.followUp({
                  content: `Could not send a DM to ${u}.`,
                  ephemeral: true,
                });
              });
          });
        }

        case 'list': {
          const bannedUsers = await guild.bans.fetch();

          if (!bannedUsers.size) {
            return interaction.editReply({
              content: 'No one banned in this server.',
            });
          }

          const descriptions = bannedUsers.map(
            (bannedUser, index) => `${index + 1}. ${bannedUser.user.tag}`,
          );

          if (bannedUsers.size > 10) {
            const pagination = new Pagination(interaction, {
              limit: 10,
            });

            pagination.setColor(guild.members.me.displayHexColor);
            pagination.setTimestamp(Date.now());
            pagination.setFooter({
              text: `${interaction.client.user.username} | Page {pageNumber} of {totalPages}`,
              iconURL: interaction.client.user.displayAvatarURL({
                dynamic: true,
              }),
            });
            pagination.setDescriptions(descriptions);

            return pagination.render();
          }

          const embed = new EmbedBuilder()
            .setColor(guild.members.me.displayHexColor)
            .setTimestamp(Date.now())
            .setFooter({
              text: interaction.client.user.username,
              iconURL: interaction.client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setAuthor({
              name: '🚫 Banned User Lists',
            })
            .setDescription(descriptions.join('\n'));

          return interaction.editReply({ embeds: [embed] });
        }
      }
    });
  },
};
