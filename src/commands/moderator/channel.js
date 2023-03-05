const { capitalCase } = require('change-case');
const {
  bold,
  ChannelType,
  formatEmoji,
  inlineCode,
  italic,
  OverwriteType,
  PermissionFlagsBits,
  roleMention,
  SlashCommandBuilder,
  time,
  TimestampStyles,
  userMention,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');
const ordinal = require('ordinal');

const { channelCreateChoices, channelType } = require('@/constants');
const {
  applyThreadAutoArchiveDuration,
  applyVideoQualityMode,
  count,
  generateEmbed,
  generatePagination,
} = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('#️⃣ Channel command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('🆕 Create a new channel.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription("🔤 The channel's name.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName('type')
            .setDescription("🔣 The channel's type.")
            .setRequired(true)
            .addChoices(...channelCreateChoices),
        )
        .addChannelOption((option) =>
          option
            .setName('category')
            .setDescription("🔣 The channel's category.")
            .addChannelTypes(ChannelType.GuildCategory),
        )
        .addStringOption((option) =>
          option.setName('topic').setDescription("🗣️ The channel's topic."),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for creating the channel.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('🗑️ Delete a channel.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('#️⃣ The channel to delete.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for deleting the channel.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('ℹ️ Show the information about the channel.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('🛠️ The channel to show.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('📄 Show list of server channels.'),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('modify')
        .setDescription('✏️ Modify a channel.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('category')
            .setDescription('🔤 Modify the channel category.')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('#️⃣ The channel to modify.')
                .setRequired(true),
            )
            .addChannelOption((option) =>
              option
                .setName('category')
                .setDescription("🔤 The channel's new category channel.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the channel.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('name')
            .setDescription('🔤 Modify the channel name.')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('#️⃣ The channel to modify.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription("🔤 The channel's new name.")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the channel.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('nsfw')
            .setDescription('⚠️ Modify the channel nsfw state.')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('#️⃣ The channel to modify.')
                .setRequired(true),
            )
            .addBooleanOption((option) =>
              option
                .setName('nsfw')
                .setDescription("⚠️ The channel's new nsfw state.")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the channel.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('position')
            .setDescription('🔢 Modify the channel position.')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('#️⃣ The channel to modify.')
                .setRequired(true),
            )
            .addChannelOption((option) =>
              option
                .setName('position')
                .setDescription(
                  "🔢 The role's position to be specified on top of this role.",
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the channel.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('topic')
            .setDescription('🗣️ Modify the channel topic.')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('#️⃣ The channel to modify.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('topic')
                .setDescription("🔤 The channel's new topic.")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the channel.'),
            ),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ guild: ?import('discord.js').Guild, locale: import('discord.js').Locale, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { guild, locale, member, options } = interaction;

    await interaction.deferReply();

    await changeLanguage(locale);

    const reason = options.getString('reason') ?? t('misc.noReason');
    const isMissingPermissions = !member.permissions.has(
      PermissionFlagsBits.ManageChannels,
    );

    if (!guild) throw t('global.error.guild');

    if (!member) throw t('global.error.member');

    if (options.getSubcommandGroup() !== null) {
      return {
        modify: () => {
          /** @type {import('discord.js').GuildChannel} */
          const guildChannel = options.getChannel('channel', true);

          if (isMissingPermissions || !guildChannel.manageable) {
            throw t('global.error.channel.perm.modify', {
              channel: guildChannel,
            });
          }

          return {
            category: async () => {
              /** @type {import('discord.js').CategoryChannel} */
              const parent = options.getChannel('category', true);

              if (guildChannel.type === parent.type) {
                throw t('global.error.channel.category.exact', {
                  channel: guildChannel,
                });
              }

              if (guildChannel.parent && guildChannel.parent === parent) {
                throw t('global.error.channel.category.exists', {
                  channel: guildChannel,
                  parent: guildChannel.parent,
                });
              }

              await guildChannel.setParent(parent, { reason });

              await interaction.editReply({
                content: t('global.success.channel.category', {
                  status: bold(t('misc.modify')),
                  channel: guildChannel,
                  parent: guildChannel.parent,
                }),
              });
            },
            name: async () => {
              const name = options.getString('name', true);

              if (name.toLowerCase() === guildChannel.name.toLowerCase()) {
                throw t('global.error.channel.name');
              }

              await guildChannel.setName(name, reason);

              await interaction.editReply({
                content: t('global.success.channel.name', {
                  status: bold(t('misc.modify')),
                  channel: guildChannel,
                }),
              });
            },
            nsfw: async () => {
              /** @type {import('discord.js').BaseGuildTextChannel} */
              const channel = options.getChannel('channel', true);
              const nsfw = options.getBoolean('nsfw', true);

              if (nsfw === channel.nsfw) {
                throw t('global.error.channel.nsfw', {
                  channel,
                  state: bold(channel.nsfw ? t('misc.on') : t('misc.off')),
                });
              }

              await channel.setNSFW(nsfw, reason);

              await interaction.editReply({
                content: t('global.success.channel.nsfw', {
                  status: bold(t('misc.modify')),
                  channel,
                }),
              });
            },
            position: async () => {
              /** @type {import('discord.js').GuildChannel} */
              const targetChannel = options.getChannel('position', true);

              if (guildChannel.type !== targetChannel.type) {
                throw t('global.error.channel.type', {
                  channel: guildChannel,
                  target: targetChannel,
                });
              }

              if (
                guildChannel.parent &&
                targetChannel.parent &&
                guildChannel.parent !== targetChannel.parent
              ) {
                throw t('global.error.channel.category.same', {
                  channel: guildChannel,
                  target: targetChannel,
                });
              }

              if (guildChannel.position === targetChannel.position) {
                throw t('global.error.channel.position');
              }

              await guildChannel.setPosition(targetChannel.position, {
                reason,
              });

              await interaction.editReply({
                content: t('global.success.channel.position', {
                  status: bold(t('misc.modify')),
                  channel: guildChannel,
                }),
              });
            },
            topic: async () => {
              /** @type {import('discord.js').BaseGuildTextChannel} */
              const channel = options.getChannel('channel', true);
              const topic = options.getString('topic', true);

              if (channel.topic && topic === channel.topic) {
                throw t('global.error.channel.topic');
              }

              await channel.setTopic(topic, reason);

              await interaction.editReply({
                content: t('global.success.channel.topic', {
                  status: bold(t('misc.modify')),
                  channel,
                }),
              });
            },
          }[options.getSubcommand()]();
        },
      }[options.getSubcommandGroup()]();
    }

    return {
      create: async () => {
        const name = options.getString('name', true);
        const type = options.getInteger('type', true);

        /** @type {?import('discord.js').CategoryChannel} */
        const parent = options.getChannel('category');
        const topic = options.getString('topic') ?? undefined;

        if (isMissingPermissions) {
          throw t('global.error.channel.perm.create');
        }

        const mutedRole = guild.roles.cache.find(
          (role) => role.name.toLowerCase() === 'muted',
        );

        if (!mutedRole) {
          throw t('global.error.role', { role: inlineCode('muted') });
        }

        /** @type {import('discord.js').GuildChannel} */
        const ch = await guild.channels.create({
          name,
          type,
          parent: type === ChannelType.GuildCategory ? null : parent,
          topic,
          reason,
        });

        if (!ch.parent) {
          await ch.permissionOverwrites.create(
            mutedRole,
            {
              SendMessages: false,
              AddReactions: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              SendMessagesInThreads: false,
              Speak: false,
            },
            { type: OverwriteType.Role, reason: t('misc.setup.servermute') },
          );

          return await interaction.editReply({
            content: t('global.success.channel.create', { channel: ch }),
          });
        }

        await ch.lockPermissions();

        return await interaction.editReply({
          content: t('global.success.channel.create', { channel: ch }),
        });
      },
      delete: async () => {
        /** @type {import('discord.js').GuildChannel} */
        const guildChannel = options.getChannel('channel', true);

        if (isMissingPermissions || !guildChannel.deletable) {
          throw t('global.error.channel.perm.delete', {
            channel: guildChannel,
          });
        }

        await guildChannel.delete(reason);

        await interaction.editReply({
          content: t('global.error.channel.delete'),
        });
      },
      info: async () => {
        /** @type {import('discord.js').GuildChannel} */
        const guildChannel = options.getChannel('channel', true);

        /** @type {import('discord.js').BaseGuildTextChannel} */
        const baseGuildTextChannel = options.getChannel('channel', true);

        /** @type {import('discord.js').BaseGuildVoiceChannel} */
        const baseGuildVoiceChannel = options.getChannel('channel', true);

        /** @type {import('discord.js').VoiceChannel} */
        const voiceChannel = options.getChannel('channel', true);

        /** @type {import('discord.js').CategoryChannel} */
        const categoryChannel = options.getChannel('channel', true);

        /** @type {import('discord.js').ThreadChannel} */
        const threadChannel = options.getChannel('channel', true);

        /** @type {import('discord.js').ForumChannel} */
        const forumChannel = options.getChannel('channel', true);
        const channelTopic =
          baseGuildTextChannel.topic ?? italic(t('misc.noTopic'));
        const isNSFW = baseGuildTextChannel.nsfw ? t('misc.yes') : t('misc.no');
        const bitrate = `${baseGuildVoiceChannel.bitrate / 1000}kbps`;
        const memberCount = count(guildChannel.members.size, 'member');
        const userLimitVoiceBasedChannel =
          baseGuildVoiceChannel.userLimit > 0
            ? count(baseGuildVoiceChannel.userLimit, 'user')
            : t('misc.unlimited');
        const slowmode = inlineCode(
          `${
            baseGuildTextChannel.rateLimitPerUser &&
            baseGuildTextChannel.rateLimitPerUser > 0
              ? `${baseGuildTextChannel.rateLimitPerUser} ${t('misc.seconds')}`
              : t('misc.off2')
          }`,
        );
        const regionOverride =
          baseGuildVoiceChannel.rtcRegion ?? t('misc.auto');
        const permissionOverwrites = guildChannel.permissionOverwrites.cache;
        const permissionOverwritesList = permissionOverwrites
          .map((permission) => {
            const allowedPermissions = permission.allow.toArray();
            const deniedPermissions = permission.deny.toArray();

            return `${bold('•')} ${
              permission.type === OverwriteType.Role
                ? permission.id === guild.roles.everyone.id
                  ? guild.roles.everyone
                  : roleMention(permission.id)
                : userMention(permission.id)
            }\n${
              allowedPermissions.length
                ? `${t('misc.allowed')}: ${allowedPermissions
                    .map((allowedPermission) =>
                      inlineCode(capitalCase(allowedPermission)),
                    )
                    .join(', ')}`
                : ''
            }${
              deniedPermissions.length
                ? `${t('misc.denied')}: ${deniedPermissions
                    .map((deniedPermission) =>
                      inlineCode(capitalCase(deniedPermission)),
                    )
                    .join(', ')}`
                : ''
            }`;
          })
          .join('\n\n');

        const embed = generateEmbed({ interaction })
          .setAuthor({
            name: t('command.channel.subcommand.info.embed.author', {
              channel: guildChannel.name,
            }),
          })
          .setFields([
            {
              name: t('command.channel.subcommand.info.embed.field.createdAt'),
              value: time(guildChannel.createdAt, TimestampStyles.RelativeTime),
              inline: true,
            },
            {
              name: t('command.channel.subcommand.info.embed.field.type'),
              value: channelType.find(
                (type) => guildChannel.type === type.value,
              ).name,
              inline: true,
            },
          ]);

        const textBased = async () => {
          const messageCount = baseGuildTextChannel.messages.cache.size;

          const pinnedMessageCount = await baseGuildTextChannel.messages
            .fetchPinned()
            .then((pinned) => pinned.size);

          const activeThreads = await baseGuildTextChannel.threads
            .fetchActive()
            .then((fectedThreads) => fectedThreads.threads);

          const archivedThreads = await baseGuildTextChannel.threads
            .fetchArchived()
            .then((fetchedThreads) => fetchedThreads.threads);

          const publicThreads = baseGuildTextChannel.threads.cache.filter(
            (thread) => thread.type === ChannelType.PublicThread,
          );
          const activePublicThreads = activeThreads.filter(
            (thread) => thread.type === ChannelType.PublicThread,
          );
          const archivedPublicThreads = archivedThreads.filter(
            (thread) => thread.type === ChannelType.PublicThread,
          );
          const privateThreads = baseGuildTextChannel.threads.cache.filter(
            (thread) => thread.type === ChannelType.PrivateThread,
          );
          const activePrivateThreads = activeThreads.filter(
            (thread) => thread.type === ChannelType.PrivateThread,
          );
          const archivedPrivateThreads = archivedThreads.filter(
            (thread) => thread.type === ChannelType.PrivateThread,
          );
          const announcementThreads = baseGuildTextChannel.threads.cache.filter(
            (thread) => thread.type === ChannelType.AnnouncementThread,
          );
          const activeAnnouncementThreads = activeThreads.filter(
            (thread) => thread.type === ChannelType.AnnouncementThread,
          );
          const archivedAnnouncementThreads = archivedThreads.filter(
            (thread) => thread.type === ChannelType.AnnouncementThread,
          );
          const threadList = `👁️ ${count(publicThreads.size)} ${t(
            'misc.public',
          )} ${
            activeThreads.size || archivedThreads.size
              ? `(${
                  activePublicThreads.size
                    ? `${count(activePublicThreads.size)} ${t('misc.active')}`
                    : ''
                }${activeThreads.size && archivedThreads.size ? ', ' : ''}${
                  archivedPublicThreads.size
                    ? `${count(archivedPublicThreads.size)} ${t(
                        'misc.archived',
                      )}`
                    : ''
                })`
              : ''
          } | 🔒 ${count(privateThreads.size)} ${t('misc.private')} ${
            activePrivateThreads.size || archivedPrivateThreads.size
              ? `(${
                  activePrivateThreads.size
                    ? `${count(activePrivateThreads.size)} ${t('misc.active')}`
                    : ''
                }${
                  activePrivateThreads.size && archivedPrivateThreads.size
                    ? ', '
                    : ''
                }${
                  archivedPrivateThreads.size
                    ? `${count(archivedPrivateThreads.size)} ${t(
                        'misc.archived',
                      )}`
                    : ''
                })`
              : ''
          } | 📣 ${announcementThreads.size} Announcement ${
            activeAnnouncementThreads.size || archivedAnnouncementThreads.size
              ? `(${
                  activeAnnouncementThreads.size
                    ? `${count(activeAnnouncementThreads.size)} ${t(
                        'misc.active',
                      )}`
                    : ''
                }${
                  activeAnnouncementThreads.size &&
                  archivedAnnouncementThreads.size
                    ? ', '
                    : ''
                }${
                  archivedAnnouncementThreads.size
                    ? `${count(archivedAnnouncementThreads.size)} ${t(
                        'misc.archived',
                      )}`
                    : ''
                })`
              : ''
          }${
            baseGuildTextChannel.defaultAutoArchiveDuration
              ? `\n${t('misc.inactivity')}: ${inlineCode(
                  applyThreadAutoArchiveDuration(
                    baseGuildTextChannel.defaultAutoArchiveDuration,
                  ),
                )}`
              : ''
          }`;

          embed
            .spliceFields(1, 0, {
              name: t('command.channel.subcommand.info.embed.field.category'),
              value: guildChannel.parent
                ? `${guildChannel.parent}`
                : italic('None'),
              inline: true,
            })
            .spliceFields(
              guildChannel.parent ? 3 : 2,
              0,
              {
                name: t('command.channel.subcommand.info.embed.field.position'),
                value: `${ordinal(guildChannel.position + 1)}${
                  guildChannel.type !== ChannelType.GuildCategory &&
                  guildChannel.parent
                    ? ` ${t('misc.in')} ${guildChannel.parent}`
                    : ''
                }`,
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.topic'),
                value: channelTopic,
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.message'),
                value: count(messageCount, 'message'),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.pinned'),
                value: count(pinnedMessageCount, 'pinned message'),
                inline: true,
              },
            )
            .spliceFields(
              7,
              0,
              {
                name: t('command.channel.subcommand.info.embed.field.nsfw'),
                value: isNSFW,
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.slowmode'),
                value: slowmode,
                inline: true,
              },
              {
                name: t(
                  'command.channel.subcommand.info.embed.field.extra.name',
                ),
                value: t(
                  'command.channel.subcommand.info.embed.field.extra.value',
                  {
                    type:
                      guild.rulesChannelId &&
                      guildChannel.id === guild.rulesChannelId
                        ? t('misc.rules')
                        : guild.publicUpdatesChannelId &&
                          guildChannel.id === guild.publicUpdatesChannelId
                        ? t('misc.publicUpdates')
                        : guild.systemChannelId &&
                          guildChannel.id === guild.systemChannelId
                        ? t('misc.system')
                        : t('misc.widget'),
                  },
                ),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.threads'),
                value: threadList,
              },
              {
                name: t(
                  'command.channel.subcommand.info.embed.field.permissions',
                ),
                value: `${
                  guildChannel.permissionsLocked && guildChannel.parent
                    ? `${t('misc.synced')} ${guildChannel.parent}`
                    : ''
                }\n${
                  permissionOverwrites.size
                    ? permissionOverwritesList
                    : italic(t('misc.none'))
                }`,
              },
            );

          return await interaction.editReply({ embeds: [embed] });
        };

        const threadBased = async () => {
          const messageCount = threadChannel.messages.cache.size;

          const pinnedMessageCount = await threadChannel.messages
            .fetchPinned()
            .then((pinned) => pinned.size);

          embed
            .spliceFields(
              1,
              0,
              {
                name: t(
                  'command.channel.subcommand.info.embed.field.createdBy',
                ),
                value: threadChannel.ownerId
                  ? userMention(threadChannel.ownerId)
                  : italic(t('misc.unknown')),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.channel'),
                value: threadChannel.parent
                  ? `${threadChannel.parent}`
                  : italic(t('misc.none')),
                inline: true,
              },
            )
            .spliceFields(
              threadChannel.parent ? 4 : 3,
              0,
              {
                name: t(
                  'command.channel.subcommand.info.embed.field.memberThread',
                ),
                value: count(memberCount, 'member'),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.message'),
                value: count(messageCount, 'message'),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.pinned'),
                value: count(pinnedMessageCount, 'pinned message'),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.status'),
                value: threadChannel.archived
                  ? `${
                      threadChannel.locked ? t('misc.locked') : t('misc.closed')
                    } ${
                      threadChannel.archivedAt
                        ? time(
                            threadChannel.archivedAt,
                            TimestampStyles.RelativeTime,
                          )
                        : italic(t('misc.unknown'))
                    }`
                  : t('misc.active2'),
                inline: true,
              },
              {
                name: t(
                  'command.channel.subcommand.info.embed.field.inactivity',
                ),
                value: threadChannel.autoArchiveDuration
                  ? inlineCode(
                      applyThreadAutoArchiveDuration(
                        threadChannel.autoArchiveDuration,
                      ),
                    )
                  : italic(t('misc.unknown')),
                inline: true,
              },
              {
                name: t('command.channel.subcommand.info.embed.field.slowmode'),
                value: slowmode,
                inline: true,
              },
            );

          return await interaction.editReply({ embeds: [embed] });
        };

        await {
          [ChannelType.GuildText]: textBased,
          [ChannelType.GuildAnnouncement]: textBased,
          [ChannelType.GuildVoice]: async () => {
            const messageCount = voiceChannel.messages.cache.size;

            embed
              .spliceFields(1, 0, {
                name: t('command.channel.subcommand.info.embed.field.category'),
                value: voiceChannel.parent
                  ? `${voiceChannel.parent}`
                  : italic(t('misc.none')),
                inline: true,
              })
              .spliceFields(
                voiceChannel.parent ? 3 : 2,
                0,
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.position',
                  ),
                  value: `${ordinal(voiceChannel.position + 1)}${
                    voiceChannel.type !== ChannelType.GuildCategory &&
                    voiceChannel.parent
                      ? ` ${t('misc.in')} ${voiceChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.memberVoice',
                  ),
                  value: memberCount,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.messageVoice',
                  ),
                  value: count(messageCount, 'message'),
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.bitrate',
                  ),
                  value: bitrate,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.userLimit',
                  ),
                  value: userLimitVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.videoQuality',
                  ),
                  value: voiceChannel.videoQualityMode
                    ? applyVideoQualityMode(voiceChannel.videoQualityMode)
                    : t('misc.auto2'),
                  inline: true,
                },
                {
                  name: t('command.channel.subcommand.info.embed.field.region'),
                  value: regionOverride,
                  inline: true,
                },
              )
              .spliceFields(
                8,
                0,
                {
                  name: t('command.channel.subcommand.info.embed.field.nsfw'),
                  value: isNSFW,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.slowmode',
                  ),
                  value: slowmode,
                  inline: true,
                },
              );

            if (guild.afkChannelId && voiceChannel.id === guild.afkChannelId) {
              embed.spliceFields(10, 0, {
                name: t(
                  'command.channel.subcommand.info.embed.field.extra.name',
                ),
                value: t('misc.afk'),
                inline: true,
              });
            }

            embed.spliceFields(
              guild.afkChannelId && voiceChannel.id === guild.afkChannelId
                ? 11
                : 10,
              0,
              {
                name: t(
                  'command.channel.subcommand.info.embed.field.permissions',
                ),
                value: `${
                  voiceChannel.permissionsLocked && voiceChannel.parent
                    ? `${t('misc.synced')} ${voiceChannel.parent}`
                    : ''
                }\n${
                  permissionOverwrites.size
                    ? permissionOverwritesList
                    : italic(t('misc.none'))
                }`,
              },
            );

            return await interaction.editReply({ embeds: [embed] });
          },
          [ChannelType.GuildCategory]: async () => {
            const childChannels = categoryChannel.children.cache;

            embed
              .spliceFields(
                3,
                0,
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.position',
                  ),
                  value: `${ordinal(categoryChannel.position + 1)}${
                    categoryChannel.type !== ChannelType.GuildCategory &&
                    categoryChannel.parent
                      ? ` ${t('misc.in')} ${categoryChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.channels',
                  ),
                  value: childChannels.size
                    ? childChannels.map((child) => `${child}`).join(', ')
                    : italic(t('misc.none')),
                },
              )
              .spliceFields(5, 0, {
                name: t(
                  'command.channel.subcommand.info.embed.field.permissions',
                ),
                value: `${
                  categoryChannel.permissionsLocked && categoryChannel.parent
                    ? `${t('misc.synced')} ${categoryChannel.parent}`
                    : ''
                }\n${
                  permissionOverwrites.size
                    ? permissionOverwritesList
                    : italic(t('misc.none'))
                }`,
              });

            return await interaction.editReply({ embeds: [embed] });
          },
          [ChannelType.PublicThread]: threadBased,
          [ChannelType.PrivateThread]: threadBased,
          [ChannelType.AnnouncementThread]: threadBased,
          [ChannelType.GuildStageVoice]: async () => {
            embed
              .spliceFields(1, 0, {
                name: t('command.channel.subcommand.info.embed.field.category'),
                value: baseGuildVoiceChannel.parent
                  ? `${baseGuildVoiceChannel.parent}`
                  : italic(t('misc.none')),
                inline: true,
              })
              .spliceFields(
                baseGuildVoiceChannel.parent ? 3 : 2,
                0,
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.position',
                  ),
                  value: `${ordinal(baseGuildVoiceChannel.position + 1)}${
                    baseGuildVoiceChannel.type !== ChannelType.GuildCategory &&
                    baseGuildVoiceChannel.parent
                      ? ` ${t('misc.in')} ${baseGuildVoiceChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.memberStage',
                  ),
                  value: memberCount,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.bitrate',
                  ),
                  value: bitrate,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.userLimit',
                  ),
                  value: userLimitVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: t('command.channel.subcommand.info.embed.field.region'),
                  value: regionOverride,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.permissions',
                  ),
                  value: `${
                    baseGuildVoiceChannel.permissionsLocked
                      ? `${t('misc.synced')} ${baseGuildVoiceChannel.parent}`
                      : ''
                  }\n${
                    permissionOverwrites.size
                      ? permissionOverwritesList
                      : italic(t('misc.none'))
                  }`,
                },
              );

            return await interaction.editReply({ embeds: [embed] });
          },
          [ChannelType.GuildForum]: async () => {
            const moderatorOnlyTags = forumChannel.availableTags.filter(
              (tag) => tag.moderated,
            );
            const allMembertags = forumChannel.availableTags.filter(
              (tag) => !tag.moderated,
            );

            const activeThreads = await forumChannel.threads
              .fetchActive()
              .then((fectedThreads) => fectedThreads.threads);

            const archivedThreads = await forumChannel.threads
              .fetchArchived()
              .then((fetchedThreads) => fetchedThreads.threads);

            const publicThreads = baseGuildTextChannel.threads.cache.filter(
              (thread) => thread.type === ChannelType.PublicThread,
            );
            const activePublicThreads = activeThreads.filter(
              (thread) => thread.type === ChannelType.PublicThread,
            );
            const archivedPublicThreads = archivedThreads.filter(
              (thread) => thread.type === ChannelType.PublicThread,
            );
            const privateThreads = baseGuildTextChannel.threads.cache.filter(
              (thread) => thread.type === ChannelType.PrivateThread,
            );
            const activePrivateThreads = activeThreads.filter(
              (thread) => thread.type === ChannelType.PrivateThread,
            );
            const archivedPrivateThreads = archivedThreads.filter(
              (thread) => thread.type === ChannelType.PrivateThread,
            );
            const announcementThreads =
              baseGuildTextChannel.threads.cache.filter(
                (thread) => thread.type === ChannelType.AnnouncementThread,
              );
            const activeAnnouncementThreads = activeThreads.filter(
              (thread) => thread.type === ChannelType.AnnouncementThread,
            );
            const archivedAnnouncementThreads = archivedThreads.filter(
              (thread) => thread.type === ChannelType.AnnouncementThread,
            );
            const threadList = `👁️ ${count(publicThreads.size)} ${t(
              'misc.public',
            )} ${
              activeThreads.size || archivedThreads.size
                ? `(${
                    activePublicThreads.size
                      ? `${count(activePublicThreads.size)} ${t('misc.active')}`
                      : ''
                  }${activeThreads.size && archivedThreads.size ? ', ' : ''}${
                    archivedPublicThreads.size
                      ? `${count(archivedPublicThreads.size)} ${t(
                          'misc.archived',
                        )}`
                      : ''
                  })`
                : ''
            } | 🔒 ${count(privateThreads.size)} ${t('misc.private')} ${
              activePrivateThreads.size || archivedPrivateThreads.size
                ? `(${
                    activePrivateThreads.size
                      ? `${count(activePrivateThreads.size)} ${t(
                          'misc.active',
                        )}`
                      : ''
                  }${
                    activePrivateThreads.size && archivedPrivateThreads.size
                      ? ', '
                      : ''
                  }${
                    archivedPrivateThreads.size
                      ? `${count(archivedPrivateThreads.size)} ${t(
                          'misc.archived',
                        )}`
                      : ''
                  })`
                : ''
            } | 📣 ${announcementThreads.size} ${t('misc.announcement')} ${
              activeAnnouncementThreads.size || archivedAnnouncementThreads.size
                ? `(${
                    activeAnnouncementThreads.size
                      ? `${count(activeAnnouncementThreads.size)} ${t(
                          'misc.active',
                        )}`
                      : ''
                  }${
                    activeAnnouncementThreads.size &&
                    archivedAnnouncementThreads.size
                      ? ', '
                      : ''
                  }${
                    archivedAnnouncementThreads.size
                      ? `${count(archivedAnnouncementThreads.size)} ${t(
                          'misc.archived',
                        )}`
                      : ''
                  })`
                : ''
            }${
              baseGuildTextChannel.defaultAutoArchiveDuration
                ? `\n${t('misc.inactivity')}: ${inlineCode(
                    applyThreadAutoArchiveDuration(
                      baseGuildTextChannel.defaultAutoArchiveDuration,
                    ),
                  )}`
                : ''
            }`;

            embed
              .spliceFields(1, 0, {
                name: t('command.channel.subcommand.info.embed.field.category'),
                value: forumChannel.parent
                  ? `${forumChannel.parent}`
                  : italic(t('misc.none')),
                inline: true,
              })
              .spliceFields(
                forumChannel.parent ? 3 : 2,
                0,
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.position',
                  ),
                  value: `${ordinal(forumChannel.position + 1)}${
                    forumChannel.type !== ChannelType.GuildCategory &&
                    forumChannel.parent
                      ? ` ${t('misc.in')} ${forumChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: t('command.channel.subcommand.info.embed.field.post'),
                  value: channelTopic,
                  inline: true,
                },
                {
                  name: t('command.channel.subcommand.info.embed.field.emoji'),
                  value: forumChannel.defaultReactionEmoji
                    ? forumChannel.defaultReactionEmoji.id
                      ? formatEmoji(forumChannel.defaultReactionEmoji.id)
                      : forumChannel.defaultReactionEmoji.name ??
                        italic(t('misc.none'))
                    : italic(t('misc.none')),
                  inline: true,
                },
              )
              .spliceFields(
                6,
                0,
                {
                  name: t('command.channel.subcommand.info.embed.field.nsfw'),
                  value: isNSFW,
                  inline: true,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.slowmode',
                  ),
                  value: slowmode,
                  inline: true,
                },
                {
                  name: t('command.channel.subcommand.info.embed.field.tags'),
                  value: forumChannel.availableTags.length
                    ? `${
                        moderatorOnlyTags.length
                          ? `${bold(
                              `• ${t('misc.modOnly')}`,
                            )}\n${moderatorOnlyTags
                              .map(
                                (tag) =>
                                  `${
                                    tag.emoji
                                      ? tag.emoji.id
                                        ? `${formatEmoji(tag.emoji.id)} `
                                        : `${tag.emoji.name} ` ?? ''
                                      : ''
                                  }${tag.name}`,
                              )
                              .join(', ')}\n`
                          : ''
                      }${
                        allMembertags.length
                          ? `${bold(`• ${t('misc.members')}`)}\n${allMembertags
                              .map(
                                (tag) =>
                                  `${
                                    tag.emoji
                                      ? tag.emoji.id
                                        ? `${formatEmoji(tag.emoji.id)} `
                                        : `${tag.emoji.name} ` ?? ''
                                      : ''
                                  }${tag.name}`,
                              )
                              .join(', ')}`
                          : ''
                      }`
                    : italic(t('misc.none')),
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.threads',
                  ),
                  value: `${threadList}\n${t('misc.slowmode')}: ${inlineCode(
                    `${
                      forumChannel.defaultThreadRateLimitPerUser &&
                      forumChannel.defaultThreadRateLimitPerUser > 0
                        ? `${forumChannel.defaultThreadRateLimitPerUser} ${t(
                            'misc.seconds',
                          )}`
                        : t('misc.off2')
                    }`,
                  )}`,
                },
                {
                  name: t(
                    'command.channel.subcommand.info.embed.field.permissions',
                  ),
                  value: `${
                    forumChannel.permissionsLocked && forumChannel.parent
                      ? `${t('misc.synced')} ${forumChannel.parent}`
                      : ''
                  }\n${
                    permissionOverwrites.size
                      ? permissionOverwritesList
                      : italic(t('misc.none'))
                  }`,
                },
              );

            return await interaction.editReply({ embeds: [embed] });
          },
        }[guildChannel.type]();
      },
      list: async () => {
        const channels = await guild.channels.fetch();

        if (!channels.size) {
          throw t('global.error.channels', { guild: bold(guild) });
        }

        const descriptions = [...channels.values()]
          .sort((a, b) => b.type - a.type)
          .map((ch, i) => `${bold(`${i + 1}.`)} ${ch}`);

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: t('command.channel.subcommand.list.pagination', {
              guild: `${guild.icon ? '#️⃣ ' : ''}${guild}`,
              total: count(channels.size),
            }),
            iconURL: guild.iconURL() ?? undefined,
          })
          .setDescriptions(descriptions)
          .render();
      },
    }[options.getSubcommand()]();
  },
};
