const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const { banChoices, banTempChoices } = require('@/constants');
const { generateEmbed, generatePagination } = require('@/utils');

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
        .setName('list')
        .setDescription('📄 Show list of banned users.'),
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
      subcommand
        .setName('temp')
        .setDescription('🔐 Ban a member temporarily from the server.')
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
        .addIntegerOption((option) =>
          option
            .setName('duration')
            .setDescription('⏱️ The duration of the ban.')
            .addChoices(...banTempChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for banning the member.'),
        ),
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

    return {
      add: async () => {
        /** @type {?import('discord.js').GuildMember} */
        const member = options.getMember('member');
        const deleteMessageSeconds = options.getInteger(
          'delete_messages',
          true,
        );
        const reason = options.getString('reason') ?? 'No reason';

        if (!member) throw "Member doesn't exist.";

        if (!member.bannable) {
          throw `You don't have appropiate permissions to ban ${member}.`;
        }

        if (member.id === user.id) throw "You can't ban yourself.";

        await member.ban({ deleteMessageSeconds, reason });

        await interaction.editReply({
          content: `Successfully ${bold('banned')} ${member.user.tag}.`,
        });

        if (!member.user.bot) {
          return await member
            .send({
              content: `You have been banned from ${bold(
                guild,
              )} for ${inlineCode(reason)}`,
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: `Could not send a DM to ${member}.`,
                  ephemeral: true,
                }),
            );
        }
      },
      temp: async () => {
        /** @type {import('discord.js').GuildMember} */
        const member = options.getMember('member');
        const deleteMessageSeconds = options.getInteger(
          'delete_messages',
          true,
        );
        const duration = options.getInteger('duration', true);
        const reason = options.getString('reason') ?? 'No reason';

        if (!member.bannable) {
          throw `You don't have appropiate permissions to ban ${member}.`;
        }

        if (member.id === user.id) throw "You can't ban yourself.";

        await member.ban({ deleteMessageSeconds, reason });

        await interaction.editReply({
          content: `Successfully ${bold('banned')} ${
            member.user.tag
          } for ${inlineCode(`${duration / 1000} seconds`)}.`,
        });

        if (!member.user.bot) {
          await member.user
            .send({
              content: `You have been banned from ${bold(
                guild,
              )} for ${inlineCode(reason)}`,
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: `Could not send a DM to ${member}.`,
                  ephemeral: true,
                }),
            );
        }

        await wait(duration);

        const bannedUser = guild.bans.cache.find(
          (ban) => ban.user.id === user.id,
        );

        if (!bannedUser) throw "This user isn't banned.";

        const banUser = await guild.members.unban(
          bannedUser,
          'ban temporary duration has passed.',
        );

        if (!banUser.bot) {
          return await banUser
            .send({
              content: `Congratulations! You have been unbanned from ${bold(
                guild,
              )} for ${inlineCode('ban temporary duration has passed.')}`,
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: `Could not send a DM to ${banUser}.`,
                  ephemeral: true,
                }),
            );
        }
      },
      remove: async () => {
        const userId = options.get('user_id', true)?.value;
        const reason = options.getString('reason') ?? 'No reason';

        const bannedUser = guild.bans.cache.find(
          (ban) => ban.user.id === userId,
        );

        if (!bannedUser) throw "This user isn't banned.";

        const banUser = await guild.members.unban(bannedUser, reason);

        await interaction.editReply({
          content: `Successfully ${bold('unbanned')} ${banUser.tag}.`,
        });

        if (!banUser.bot) {
          return await banUser
            .send({
              content: `Congratulations! You have been unbanned from ${bold(
                guild,
              )} for ${inlineCode(reason)}`,
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: `Could not send a DM to ${banUser}.`,
                  ephemeral: true,
                }),
            );
        }
      },
      list: async () => {
        const bannedUsers = await guild.bans.fetch();

        if (!bannedUsers.size) throw `No one banned in ${bold(guild)}.`;

        const descriptions = [...bannedUsers.values()].map(
          (bannedUser, i) => `${bold(`${i + 1}.`)} ${bannedUser.user.tag}`,
        );

        if (bannedUsers.size > 10) {
          return await generatePagination({ interaction, limit: 10 })
            .setAuthor({
              name: `🚫 Banned User Lists (${bannedUsers.size.toLocaleString()})`,
            })
            .setDescriptions(descriptions)
            .render();
        }

        const embed = generateEmbed({ interaction })
          .setAuthor({ name: `🚫 Banned User Lists (${bannedUsers.size})` })
          .setDescription(descriptions.join('\n'));

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
