const {
  bold,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');
const wait = require('node:timers/promises').setTimeout;

const { banChoices, banTempChoices } = require('@/constants');
const { count, generateEmbed, generatePagination } = require('@/utils');

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
    /** @type {{ guild: ?import('discord.js').Guild, locale: import('discord.js').Locale, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'>, user: import('discord.js').User }} */
    const { guild, locale, options, user } = interaction;

    await interaction.deferReply();

    await changeLanguage(locale);

    if (!guild) throw t('global.error.guild');

    return {
      add: async () => {
        /** @type {?import('discord.js').GuildMember} */
        const member = options.getMember('member');
        const deleteMessageSeconds = options.getInteger(
          'delete_messages',
          true,
        );
        const reason = options.getString('reason') ?? t('misc.noReason');

        if (!member) throw t('global.error.member');

        if (!member.bannable) {
          throw t('global.error.ban.member', { member });
        }

        if (member.id === user.id) throw t('global.error.ban.yourself');

        await member.ban({ deleteMessageSeconds, reason });

        await interaction.editReply({
          content: t('global.success.ban.channel', {
            status: bold(t('misc.ban')),
            member: member.user.tag,
          }),
        });

        if (!member.user.bot) {
          return await member
            .send({
              content: t('global.success.ban.user', {
                from: bold(guild),
                reason: inlineCode(reason),
              }),
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: t('global.error.ban.user', {
                    user: inlineCode(member),
                  }),
                  ephemeral: true,
                }),
            );
        }
      },
      list: async () => {
        const bannedUsers = await guild.bans.fetch();

        if (!bannedUsers.size) {
          throw t('global.error.ban.noUser', { guild: bold(guild) });
        }

        const descriptions = [...bannedUsers.values()].map(
          (bannedUser, i) => `${bold(`${i + 1}.`)} ${bannedUser.user.tag}`,
        );

        if (bannedUsers.size > 10) {
          return await generatePagination({ interaction, limit: 10 })
            .setAuthor({
              name: t('command.ban.subcommand.list', {
                total: count(bannedUsers.size),
              }),
            })
            .setDescriptions(descriptions)
            .render();
        }

        const embed = generateEmbed({ interaction })
          .setAuthor({
            name: t('command.ban.subcommand.list', {
              total: count(bannedUsers.size),
            }),
          })
          .setDescription(descriptions.join('\n'));

        await interaction.editReply({ embeds: [embed] });
      },
      remove: async () => {
        const userId = options.get('user_id', true)?.value;
        const reason = options.getString('reason') ?? t('misc.noReason');

        const bannedUser = guild.bans.cache.find(
          (ban) => ban.user.id === userId,
        );

        if (!bannedUser) throw t('global.error.ban.noBanned');

        const banUser = await guild.members.unban(bannedUser, reason);

        await interaction.editReply({
          content: t('global.success.ban.channel', {
            status: bold(t('misc.unban')),
            member: banUser.tag,
          }),
        });

        if (!banUser.bot) {
          return await banUser
            .send({
              content: t('global.success.ban.unban', {
                from: bold(guild),
                reason: inlineCode(reason),
              }),
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: t('global.error.ban.user', { user: banUser }),
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
        const reason = options.getString('reason') ?? t('misc.noReason');

        if (!member.bannable) {
          throw t('global.error.ban.member', { member });
        }

        if (member.id === user.id) throw t('global.error.ban.yourself');

        await member.ban({ deleteMessageSeconds, reason });

        await interaction.editReply({
          content: t('global.success.ban.channel2', {
            status: bold(t('misc.ban')),
            member: member.user.tag,
            for: inlineCode(`${duration / 1000} seconds`),
          }),
        });

        if (!member.user.bot) {
          await member.user
            .send({
              content: t('global.success.ban.user', {
                from: bold(guild),
                reason: inlineCode(reason),
              }),
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: t('global.error.ban.user', { member }),
                  ephemeral: true,
                }),
            );
        }

        await wait(duration);

        const bannedUser = guild.bans.cache.find(
          (ban) => ban.user.id === user.id,
        );

        if (!bannedUser) throw t('global.error.user.noBanned');

        const banUser = await guild.members.unban(
          bannedUser,
          t('misc.setup.temp'),
        );

        if (!banUser.bot) {
          return await banUser
            .send({
              content: t('global.success.ban.unban', {
                from: bold(guild),
                reason: inlineCode(t('misc.setup.temp')),
              }),
            })
            .catch(
              async () =>
                await interaction.followUp({
                  content: t('global.error.ban.user', { user: banUser }),
                  ephemeral: true,
                }),
            );
        }
      },
    }[options.getSubcommand()]();
  },
};
