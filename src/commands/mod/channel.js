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
const ordinal = require('ordinal');
const pluralize = require('pluralize');

const { channelCreateChoices, channelType } = require('../../constants');
const {
  applyThreadAutoArchiveDuration,
  applyVideoQualityMode,
  count,
  generateEmbed,
  generatePagination,
} = require('../../utils');

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
    /** @type {{ guild: ?import('discord.js').Guild, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { guild, member, options } = interaction;
    const reason = options.getString('reason') ?? 'No reason';
    const isMissingPermissions = !member.permissions.has(
      PermissionFlagsBits.ManageChannels,
    );

    await interaction.deferReply();

    if (!guild) throw "Guild doesn't exists.";

    if (!member) throw "Member doesn't exists.";

    if (options.getSubcommandGroup() !== null) {
      return {
        modify: () => {
          /** @type {import('discord.js').GuildChannel} */
          const guildChannel = options.getChannel('channel', true);

          if (isMissingPermissions || !guildChannel.manageable) {
            throw `You don't have appropiate permissions to modify ${guildChannel} channel.`;
          }

          return {
            category: async () => {
              /** @type {import('discord.js').CategoryChannel} */
              const parent = options.getChannel('category', true);

              if (guildChannel.type === parent.type) {
                throw `Can't modify ${guildChannel} channel's category since it is a category channel.`;
              }

              if (guildChannel.parent && guildChannel.parent === parent) {
                throw `${guildChannel} is already in ${guildChannel.parent} category channel.`;
              }

              await guildChannel.setParent(parent, { reason });

              await interaction.editReply({
                content: `Successfully ${bold(
                  'modified',
                )} ${guildChannel} channel's category to ${
                  guildChannel.parent
                }.`,
              });
            },
            name: async () => {
              const name = options.getString('name', true);

              if (name.toLowerCase() === guildChannel.name.toLowerCase()) {
                throw 'You have to specify a different name to modify.';
              }

              await guildChannel.setName(name, reason);

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${guildChannel}.`,
              });
            },
            nsfw: async () => {
              /** @type {import('discord.js').BaseGuildTextChannel} */
              const channel = options.getChannel('channel', true);
              const nsfw = options.getBoolean('nsfw', true);

              if (nsfw === channel.nsfw) {
                throw `${channel} nsfw is already being turned ${
                  channel.nsfw ? 'on' : 'off'
                }.`;
              }

              await channel.setNSFW(nsfw, reason);

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${channel}.`,
              });
            },
            position: async () => {
              /** @type {import('discord.js').GuildChannel} */
              const targetChannel = options.getChannel('position', true);

              if (guildChannel.type !== targetChannel.type) {
                throw `${guildChannel} isn't in the same type with ${targetChannel}.`;
              }

              if (
                guildChannel.parent &&
                targetChannel.parent &&
                guildChannel.parent !== targetChannel.parent
              ) {
                throw `${guildChannel} isn't in the same category with ${targetChannel}.`;
              }

              if (guildChannel.position === targetChannel.position) {
                throw 'You have to specify a different position to modify.';
              }

              await guildChannel.setPosition(targetChannel.position, {
                reason,
              });

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${guildChannel}.`,
              });
            },
            topic: async () => {
              /** @type {import('discord.js').BaseGuildTextChannel} */
              const channel = options.getChannel('channel', true);
              const topic = options.getString('topic', true);

              if (channel.topic && topic === channel.topic) {
                throw 'You have to specify a different topic to modify.';
              }

              await channel.setTopic(topic, reason);

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${channel}.`,
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
          throw "You don't have appropiate permissions to create a channel.";
        }

        const mutedRole = guild.roles.cache.find(
          (role) => role.name.toLowerCase() === 'muted',
        );

        if (!mutedRole) {
          throw `Can't find role with name ${inlineCode('muted')}.`;
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
            { type: OverwriteType.Role, reason: 'servermute command setup.' },
          );

          return await interaction.editReply({
            content: `${ch} created successfully.`,
          });
        }

        await ch.lockPermissions();

        return await interaction.editReply({
          content: `${ch} created successfully.`,
        });
      },
      delete: async () => {
        /** @type {import('discord.js').GuildChannel} */
        const guildChannel = options.getChannel('channel', true);

        if (isMissingPermissions || !guildChannel.deletable) {
          throw `You don't have appropiate permissions to delete ${guildChannel} channel.`;
        }

        await guildChannel.delete(reason);

        await interaction.editReply({
          content: 'Channel deleted successfully.',
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
        const channelTopic = baseGuildTextChannel.topic ?? italic('No topic');
        const isNSFW = baseGuildTextChannel.nsfw ? 'Yes' : 'No';
        const bitrate = `${baseGuildVoiceChannel.bitrate / 1000}kbps`;
        const memberCount = count({
          total: guildChannel.members.size,
          data: 'member',
        });
        const userLimitVoiceBasedChannel =
          baseGuildVoiceChannel.userLimit > 0
            ? pluralize('user', baseGuildVoiceChannel.userLimit, true)
            : 'Unlimited';
        const slowmode = inlineCode(
          `${
            baseGuildTextChannel.rateLimitPerUser &&
            baseGuildTextChannel.rateLimitPerUser > 0
              ? `${baseGuildTextChannel.rateLimitPerUser} seconds`
              : 'Off'
          }`,
        );
        const regionOverride = baseGuildVoiceChannel.rtcRegion ?? 'Automatic';
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
                ? `Allowed: ${allowedPermissions
                    .map((allowedPermission) =>
                      inlineCode(capitalCase(allowedPermission)),
                    )
                    .join(', ')}`
                : ''
            }${
              deniedPermissions.length
                ? `Denied: ${deniedPermissions
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
            name: `ℹ️ ${guildChannel.name}'s Channel Information`,
          })
          .setFields([
            {
              name: '📆 Created At',
              value: time(guildChannel.createdAt, TimestampStyles.RelativeTime),
              inline: true,
            },
            {
              name: '🔣 Type',
              value: channelType.find((t) => guildChannel.type === t.value)
                .name,
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
          const threadList = `👁️ ${publicThreads.size.toLocaleString()} Public ${
            activeThreads.size || archivedThreads.size
              ? `(${
                  activePublicThreads.size
                    ? `${activePublicThreads.size.toLocaleString()} active`
                    : ''
                }${activeThreads.size && archivedThreads.size ? ', ' : ''}${
                  archivedPublicThreads.size
                    ? `${archivedPublicThreads.size.toLocaleString()} archived`
                    : ''
                })`
              : ''
          } | 🔒 ${privateThreads.size.toLocaleString()} Private ${
            activePrivateThreads.size || archivedPrivateThreads.size
              ? `(${
                  activePrivateThreads.size
                    ? `${activePrivateThreads.size.toLocaleString()} active`
                    : ''
                }${
                  activePrivateThreads.size && archivedPrivateThreads.size
                    ? ', '
                    : ''
                }${
                  archivedPrivateThreads.size
                    ? `${archivedPrivateThreads.size.toLocaleString()} archived`
                    : ''
                })`
              : ''
          } | 📣 ${announcementThreads.size} Announcement ${
            activeAnnouncementThreads.size || archivedAnnouncementThreads.size
              ? `(${
                  activeAnnouncementThreads.size
                    ? `${activeAnnouncementThreads.size.toLocaleString()} active`
                    : ''
                }${
                  activeAnnouncementThreads.size &&
                  archivedAnnouncementThreads.size
                    ? ', '
                    : ''
                }${
                  archivedAnnouncementThreads.size
                    ? `${archivedAnnouncementThreads.size.toLocaleString()} archived`
                    : ''
                })`
              : ''
          }${
            baseGuildTextChannel.defaultAutoArchiveDuration
              ? `\nInactivity duration: ${inlineCode(
                  applyThreadAutoArchiveDuration(
                    baseGuildTextChannel.defaultAutoArchiveDuration,
                  ),
                )}`
              : ''
          }`;

          embed
            .spliceFields(1, 0, {
              name: '📁 Category',
              value: guildChannel.parent
                ? `${guildChannel.parent}`
                : italic('None'),
              inline: true,
            })
            .spliceFields(
              guildChannel.parent ? 3 : 2,
              0,
              {
                name: '🔢 Position',
                value: `${ordinal(guildChannel.position + 1)}${
                  guildChannel.type !== ChannelType.GuildCategory &&
                  guildChannel.parent
                    ? ` in ${guildChannel.parent}`
                    : ''
                }`,
                inline: true,
              },
              { name: '🗣️ Topic', value: channelTopic, inline: true },
              {
                name: '💬 Message Count',
                value: count({ total: messageCount, data: 'message' }),
                inline: true,
              },
              {
                name: '📌 Pinned Message Count',
                value: count({
                  total: pinnedMessageCount,
                  data: 'pinned message',
                }),
                inline: true,
              },
            )
            .spliceFields(
              7,
              0,
              { name: '⚠️ NSFW', value: isNSFW, inline: true },
              { name: '🐌 Slowmode', value: slowmode, inline: true },
              {
                name: '➕ Extra',
                value: `${
                  guild.rulesChannelId &&
                  guildChannel.id === guild.rulesChannelId
                    ? 'Rules'
                    : guild.publicUpdatesChannelId &&
                      guildChannel.id === guild.publicUpdatesChannelId
                    ? 'Public Updates'
                    : guild.systemChannelId &&
                      guildChannel.id === guild.systemChannelId
                    ? 'System'
                    : 'Widget'
                } Channel`,
                inline: true,
              },
              { name: '💭 Threads', value: threadList },
              {
                name: '🔐 Permissions',
                value: `${
                  guildChannel.permissionsLocked && guildChannel.parent
                    ? `Synced with ${guildChannel.parent}`
                    : ''
                }\n${
                  permissionOverwrites.size
                    ? permissionOverwritesList
                    : italic('None')
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
                name: '👤 Created By',
                value: threadChannel.ownerId
                  ? userMention(threadChannel.ownerId)
                  : italic('Unknown'),
                inline: true,
              },
              {
                name: '#️⃣ Channel',
                value: threadChannel.parent
                  ? `${threadChannel.parent}`
                  : italic('None'),
                inline: true,
              },
            )
            .spliceFields(
              threadChannel.parent ? 4 : 3,
              0,
              {
                name: '👥 Member Count in Thread',
                value: count({ total: memberCount, data: 'member' }),
                inline: true,
              },
              {
                name: '💬 Message Count',
                value: count({ total: messageCount, data: 'message' }),
                inline: true,
              },
              {
                name: '📌 Pinned Message Count',
                value: count({
                  total: pinnedMessageCount,
                  data: 'pinned message',
                }),
                inline: true,
              },
              {
                name: '📊 Status',
                value: threadChannel.archived
                  ? `${threadChannel.locked ? 'Locked at' : 'Closed at'} ${
                      threadChannel.archivedAt
                        ? time(
                            threadChannel.archivedAt,
                            TimestampStyles.RelativeTime,
                          )
                        : italic('Unknown')
                    }`
                  : 'Active',
                inline: true,
              },
              {
                name: '🕒 Inactivity Duration',
                value: threadChannel.autoArchiveDuration
                  ? inlineCode(
                      applyThreadAutoArchiveDuration(
                        threadChannel.autoArchiveDuration,
                      ),
                    )
                  : italic('Unknown'),
                inline: true,
              },
              { name: '🐌 Slowmode', value: slowmode, inline: true },
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
                name: '📁 Category',
                value: voiceChannel.parent
                  ? `${voiceChannel.parent}`
                  : italic('None'),
                inline: true,
              })
              .spliceFields(
                voiceChannel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(voiceChannel.position + 1)}${
                    voiceChannel.type !== ChannelType.GuildCategory &&
                    voiceChannel.parent
                      ? ` in ${voiceChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '👥 Member Count in Voice',
                  value: memberCount,
                  inline: true,
                },
                {
                  name: '💬 Message Count in Voice',
                  value: count({ total: messageCount, data: 'message' }),
                  inline: true,
                },
                { name: '⚡ Bitrate', value: bitrate, inline: true },
                {
                  name: '👥 User Limit',
                  value: userLimitVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: '🎥 Video Quality',
                  value: voiceChannel.videoQualityMode
                    ? applyVideoQualityMode(voiceChannel.videoQualityMode)
                    : 'Auto',
                  inline: true,
                },
                {
                  name: '🌐 Region Override',
                  value: regionOverride,
                  inline: true,
                },
              )
              .spliceFields(
                8,
                0,
                { name: '⚠️ NSFW', value: isNSFW, inline: true },
                { name: '🐌 Slowmode', value: slowmode, inline: true },
              );

            if (guild.afkChannelId && voiceChannel.id === guild.afkChannelId) {
              embed.spliceFields(10, 0, {
                name: '➕ Extra',
                value: 'AFK Channel',
                inline: true,
              });
            }

            embed.spliceFields(
              guild.afkChannelId && voiceChannel.id === guild.afkChannelId
                ? 11
                : 10,
              0,
              {
                name: '🔐 Permissions',
                value: `${
                  voiceChannel.permissionsLocked && voiceChannel.parent
                    ? `Synced with ${voiceChannel.parent}`
                    : ''
                }\n${
                  permissionOverwrites.size
                    ? permissionOverwritesList
                    : italic('None')
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
                  name: '🔢 Position',
                  value: `${ordinal(categoryChannel.position + 1)}${
                    categoryChannel.type !== ChannelType.GuildCategory &&
                    categoryChannel.parent
                      ? ` in ${categoryChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '#️⃣ Channels',
                  value: childChannels.size
                    ? childChannels.map((child) => `${child}`).join(', ')
                    : italic('None'),
                },
              )
              .spliceFields(5, 0, {
                name: '🔐 Permissions',
                value: `${
                  categoryChannel.permissionsLocked && categoryChannel.parent
                    ? `Synced with ${categoryChannel.parent}`
                    : ''
                }\n${
                  permissionOverwrites.size
                    ? permissionOverwritesList
                    : italic('None')
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
                name: '📁 Category',
                value: baseGuildVoiceChannel.parent
                  ? `${baseGuildVoiceChannel.parent}`
                  : italic('None'),
                inline: true,
              })
              .spliceFields(
                baseGuildVoiceChannel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(baseGuildVoiceChannel.position + 1)}${
                    baseGuildVoiceChannel.type !== ChannelType.GuildCategory &&
                    baseGuildVoiceChannel.parent
                      ? ` in ${baseGuildVoiceChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '👥 Member Count in Stage',
                  value: memberCount,
                  inline: true,
                },
                { name: '⚡ Bitrate', value: bitrate, inline: true },
                {
                  name: '👥 User Limit',
                  value: userLimitVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: '🌐 Region Override',
                  value: regionOverride,
                  inline: true,
                },
                {
                  name: '🔐 Permissions',
                  value: `${
                    baseGuildVoiceChannel.permissionsLocked
                      ? `Synced with ${baseGuildVoiceChannel.parent}`
                      : ''
                  }\n${
                    permissionOverwrites.size
                      ? permissionOverwritesList
                      : italic('None')
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
            const threadList = `👁️ ${publicThreads.size.toLocaleString()} Public ${
              activeThreads.size || archivedThreads.size
                ? `(${
                    activePublicThreads.size
                      ? `${activePublicThreads.size.toLocaleString()} active`
                      : ''
                  }${activeThreads.size && archivedThreads.size ? ', ' : ''}${
                    archivedPublicThreads.size
                      ? `${archivedPublicThreads.size.toLocaleString()} archived`
                      : ''
                  })`
                : ''
            } | 🔒 ${privateThreads.size.toLocaleString()} Private ${
              activePrivateThreads.size || archivedPrivateThreads.size
                ? `(${
                    activePrivateThreads.size
                      ? `${activePrivateThreads.size.toLocaleString()} active`
                      : ''
                  }${
                    activePrivateThreads.size && archivedPrivateThreads.size
                      ? ', '
                      : ''
                  }${
                    archivedPrivateThreads.size
                      ? `${archivedPrivateThreads.size.toLocaleString()} archived`
                      : ''
                  })`
                : ''
            } | 📣 ${announcementThreads.size} Announcement ${
              activeAnnouncementThreads.size || archivedAnnouncementThreads.size
                ? `(${
                    activeAnnouncementThreads.size
                      ? `${activeAnnouncementThreads.size.toLocaleString()} active`
                      : ''
                  }${
                    activeAnnouncementThreads.size &&
                    archivedAnnouncementThreads.size
                      ? ', '
                      : ''
                  }${
                    archivedAnnouncementThreads.size
                      ? `${archivedAnnouncementThreads.size.toLocaleString()} archived`
                      : ''
                  })`
                : ''
            }${
              baseGuildTextChannel.defaultAutoArchiveDuration
                ? `\nInactivity duration: ${inlineCode(
                    applyThreadAutoArchiveDuration(
                      baseGuildTextChannel.defaultAutoArchiveDuration,
                    ),
                  )}`
                : ''
            }`;

            embed
              .spliceFields(1, 0, {
                name: '📁 Category',
                value: forumChannel.parent
                  ? `${forumChannel.parent}`
                  : italic('None'),
                inline: true,
              })
              .spliceFields(
                forumChannel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(forumChannel.position + 1)}${
                    forumChannel.type !== ChannelType.GuildCategory &&
                    forumChannel.parent
                      ? ` in ${forumChannel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '📋 Post Guidelines',
                  value: channelTopic,
                  inline: true,
                },
                {
                  name: '😀 Default Reaction Emoji',
                  value: forumChannel.defaultReactionEmoji
                    ? forumChannel.defaultReactionEmoji.id
                      ? formatEmoji(forumChannel.defaultReactionEmoji.id)
                      : forumChannel.defaultReactionEmoji.name ?? italic('None')
                    : italic('None'),
                  inline: true,
                },
              )
              .spliceFields(
                6,
                0,
                { name: '⚠️ NSFW', value: isNSFW, inline: true },
                { name: '🐌 Slowmode', value: slowmode, inline: true },
                {
                  name: '🏷️ Tags',
                  value: forumChannel.availableTags.length
                    ? `${
                        moderatorOnlyTags.length
                          ? `${bold('• Moderator Only')}\n${moderatorOnlyTags
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
                          ? `${bold('• All Member')}\n${allMembertags
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
                    : italic('None'),
                },
                {
                  name: '💭 Threads',
                  value: `${threadList}\nSlowmode: ${inlineCode(
                    `${
                      forumChannel.defaultThreadRateLimitPerUser &&
                      forumChannel.defaultThreadRateLimitPerUser > 0
                        ? `${forumChannel.defaultThreadRateLimitPerUser} seconds`
                        : 'Off'
                    }`,
                  )}`,
                },
                {
                  name: '🔐 Permissions',
                  value: `${
                    forumChannel.permissionsLocked && forumChannel.parent
                      ? `Synced with ${forumChannel.parent}`
                      : ''
                  }\n${
                    permissionOverwrites.size
                      ? permissionOverwritesList
                      : italic('None')
                  }`,
                },
              );

            return await interaction.editReply({ embeds: [embed] });
          },
        }[guildChannel.type]();
      },
      list: async () => {
        const channels = await guild.channels.fetch();

        if (!channels.size) throw `${bold(guild)} doesn't have any channels.`;

        const descriptions = [...channels.values()]
          .sort((a, b) => b.type - a.type)
          .map((ch, i) => `${bold(`${i + 1}.`)} ${ch}`);

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: `${
              guild.icon ? '#️⃣ ' : ''
            }${guild} Channel Lists (${channels.size.toLocaleString()})`,
            iconURL: guild.iconURL() ?? undefined,
          })
          .setDescriptions(descriptions)
          .render();
      },
    }[options.getSubcommand()]();
  },
};
