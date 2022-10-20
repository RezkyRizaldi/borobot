const { capitalCase } = require('change-case');
const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
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
  VideoQualityMode,
} = require('discord.js');
const ordinal = require('ordinal');
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');

const { channelCreateChoices, channelType } = require('../../constants');
const { applyThreadAutoArchiveDuration } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('#️⃣ Channel command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
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
    const { client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    const nsfw = options.getBoolean('nsfw');
    const name = options.getString('name');
    const type = options.getInteger('type');

    /** @type {import('discord.js').CategoryChannel} */
    const parent = options.getChannel('category');
    const topic = options.getString('topic');

    /** @type {import('discord.js').GuildChannel} */
    const targetChannel = options.getChannel('position');

    /** @type {import('discord.js').GuildChannel} */
    const channel = options.getChannel('channel');
    const reason = options.getString('reason') ?? 'No reason';

    switch (options.getSubcommandGroup()) {
      case 'modify':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          switch (options.getSubcommand()) {
            case 'category':
              if (channel.type === parent.type) {
                return interaction.editReply({
                  content: `Can't modify ${channel} channel's category since it is a category channel.`,
                });
              }

              if (channel.parent && channel.parent === parent) {
                return interaction.editReply({
                  content: `${channel} is already in ${channel.parent} category channel.`,
                });
              }

              return channel.setParent(parent, { reason }).then(
                async (ch) =>
                  await interaction.editReply({
                    content: `Successfully ${bold(
                      'modified',
                    )} ${ch} channel's category to ${ch.parent}.`,
                  }),
              );

            case 'name':
              if (name.toLowerCase() === channel.name.toLowerCase()) {
                return interaction.editReply({
                  content: 'You have to specify a different name to modify.',
                });
              }

              return channel.setName(name, reason).then(
                async (ch) =>
                  await interaction.editReply({
                    content: `Successfully ${bold('modified')} ${ch}.`,
                  }),
              );

            case 'nsfw':
              if (nsfw === channel.nsfw) {
                return interaction.editReply({
                  content: `${channel} nsfw is already being turned ${
                    channel.nsfw ? 'on' : 'off'
                  }.`,
                });
              }

              return channel.setNSFW(nsfw, reason).then(
                async (ch) =>
                  await interaction.editReply({
                    content: `Successfully ${bold('modified')} ${ch}.`,
                  }),
              );

            case 'position':
              if (channel.type !== targetChannel.type) {
                return interaction.editReply({
                  content: `${channel} isn't in the same type with ${targetChannel}`,
                });
              }

              if (channel.parent !== targetChannel.parent) {
                return interaction.editReply({
                  content: `${channel} isn't in the same category with ${targetChannel}`,
                });
              }

              if (channel.position === targetChannel.position) {
                return interaction.editReply({
                  content:
                    'You have to specify a different position to modify.',
                });
              }

              return channel
                .setPosition(targetChannel.position, { reason })
                .then(
                  async (ch) =>
                    await interaction.editReply({
                      content: `Successfully ${bold('modified')} ${ch}.`,
                    }),
                );

            case 'topic':
              if (topic === channel.topic) {
                return interaction.editReply({
                  content: 'You have to specify a different topic to modify.',
                });
              }

              return channel.setTopic(topic, reason).then(
                async (ch) =>
                  await interaction.editReply({
                    content: `Successfully ${bold('modified')} ${ch}.`,
                  }),
              );
          }
        });
    }

    switch (options.getSubcommand()) {
      case 'create': {
        const mutedRole = guild.roles.cache.find(
          (role) => role.name.toLowerCase() === 'muted',
        );

        return guild.channels
          .create({
            name,
            type,
            parent: type === ChannelType.GuildCategory ? null : parent,
            topic,
            reason,
          })
          .then(async (ch) => {
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
                {
                  type: OverwriteType.Role,
                  reason: 'servermute command setup.',
                },
              );

              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: `${ch} created successfully.`,
                  }),
              );
            }

            await ch.lockPermissions();

            await interaction.deferReply({ ephemeral: true }).then(
              async () =>
                await interaction.editReply({
                  content: `${ch} created successfully.`,
                }),
            );
          });
      }

      case 'delete':
        if (!channel.deletable) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: `You don't have appropiate permissions to delete the ${channel} channel.`,
              }),
          );
        }

        return channel.delete(reason).then(
          async () =>
            await interaction.deferReply({ ephemeral: true }).then(
              async () =>
                await interaction.editReply({
                  content: 'Channel deleted successfully.',
                }),
            ),
        );

      case 'info':
        return interaction.deferReply().then(async () => {
          const channelTopic = channel.topic ?? italic('No topic');

          const isNSFW = channel.nsfw ? 'Yes' : 'No';

          const bitrate = `${channel.bitrate / 1000}kbps`;

          const memberCountVoiceBasedChannel = pluralize(
            'member',
            channel.members.size,
            true,
          );
          const userLimitVoiceBasedChannel =
            channel.userLimit > 0
              ? pluralize('user', channel.userLimit, true)
              : 'Unlimited';

          const slowmode = inlineCode(
            `${
              channel.rateLimitPerUser > 0
                ? `${channel.rateLimitPerUser} seconds`
                : 'Off'
            }`,
          );

          const regionOverride = channel.rtcRegion ?? 'Automatic';

          const embed = new EmbedBuilder()
            .setColor(guild.members.me.displayHexColor)
            .setTimestamp(Date.now())
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setAuthor({
              name: `ℹ️ ${channel.name}'s Channel Information`,
            })
            .setFields([
              {
                name: '📆 Created At',
                value: time(channel.createdAt, TimestampStyles.RelativeTime),
                inline: true,
              },
              {
                name: '🔣 Type',
                value: channelType.find((t) => channel.type === t.value).name,
                inline: true,
              },
            ]);

          switch (channel.type) {
            case ChannelType.GuildText:
            case ChannelType.GuildAnnouncement: {
              const activeThreads = await channel.threads.fetchActive();
              const archivedThreads = await channel.threads.fetchArchived();

              embed.spliceFields(1, 0, {
                name: '📁 Category',
                value: channel.parent ? `${channel.parent}` : italic('None'),
                inline: true,
              });
              embed.spliceFields(
                channel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(channel.position + 1)}${
                    channel.type !== ChannelType.GuildCategory && channel.parent
                      ? ` in ${channel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '🗣️ Topic',
                  value: channelTopic,
                  inline: true,
                },
                {
                  name: '💬 Message Count',
                  value: pluralize(
                    'message',
                    channel.messages.cache.size,
                    true,
                  ),
                  inline: true,
                },
                {
                  name: '📌 Pinned Message Count',
                  value: pluralize(
                    'pinned message',
                    await channel.messages
                      .fetchPinned()
                      .then((pinned) => pinned.size),
                    true,
                  ),
                  inline: true,
                },
              );
              embed.spliceFields(
                7,
                0,
                {
                  name: '⚠️ NSFW',
                  value: isNSFW,
                  inline: true,
                },
                {
                  name: '🐌 Slowmode',
                  value: slowmode,
                  inline: true,
                },
                {
                  name: '➕ Extra',
                  value: `${
                    channel.id === guild.rulesChannelId
                      ? 'Rules'
                      : channel.id === guild.publicUpdatesChannelId
                      ? 'Public Updates'
                      : channel.id === guild.systemChannelId
                      ? 'System'
                      : 'Widget'
                  } Channel`,
                  inline: true,
                },
                {
                  name: '💭 Threads',
                  value: `👁️‍🗨️ ${
                    channel.threads.cache.filter(
                      (thread) => thread.type === ChannelType.PublicThread,
                    ).size
                  } Public ${
                    activeThreads.threads.size || archivedThreads.threads.size
                      ? `(${
                          activeThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.PublicThread,
                          ).size
                            ? `${
                                activeThreads.threads.filter(
                                  (thread) =>
                                    thread.type === ChannelType.PublicThread,
                                ).size
                              } active`
                            : ''
                        }${
                          activeThreads.threads.size &&
                          archivedThreads.threads.size
                            ? ', '
                            : ''
                        }${
                          archivedThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.PublicThread,
                          ).size
                            ? `${
                                archivedThreads.threads.filter(
                                  (thread) =>
                                    thread.type === ChannelType.PublicThread,
                                ).size
                              } archived`
                            : ''
                        })`
                      : ''
                  } | 🔒 ${
                    channel.threads.cache.filter(
                      (thread) => thread.type === ChannelType.PrivateThread,
                    ).size
                  } Private ${
                    activeThreads.threads.filter(
                      (thread) => thread.type === ChannelType.PrivateThread,
                    ).size ||
                    archivedThreads.threads.filter(
                      (thread) => thread.type === ChannelType.PrivateThread,
                    ).size
                      ? `(${
                          activeThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.PrivateThread,
                          ).size
                            ? `${
                                activeThreads.threads.filter(
                                  (thread) =>
                                    thread.type === ChannelType.PrivateThread,
                                ).size
                              } active`
                            : ''
                        }${
                          activeThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.PrivateThread,
                          ).size &&
                          archivedThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.PrivateThread,
                          ).size
                            ? ', '
                            : ''
                        }${
                          archivedThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.PrivateThread,
                          ).size
                            ? `${
                                archivedThreads.threads.filter(
                                  (thread) =>
                                    thread.type === ChannelType.PrivateThread,
                                ).size
                              } archived`
                            : ''
                        })`
                      : ''
                  } | 📣 ${
                    channel.threads.cache.filter(
                      (thread) =>
                        thread.type === ChannelType.AnnouncementThread,
                    ).size
                  } Announcement ${
                    activeThreads.threads.filter(
                      (thread) =>
                        thread.type === ChannelType.AnnouncementThread,
                    ).size ||
                    archivedThreads.threads.filter(
                      (thread) =>
                        thread.type === ChannelType.AnnouncementThread,
                    ).size
                      ? `(${
                          activeThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.AnnouncementThread,
                          ).size
                            ? `${
                                activeThreads.threads.filter(
                                  (thread) =>
                                    thread.type ===
                                    ChannelType.AnnouncementThread,
                                ).size
                              } active`
                            : ''
                        }${
                          activeThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.AnnouncementThread,
                          ).size &&
                          archivedThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.AnnouncementThread,
                          ).size
                            ? ', '
                            : ''
                        }${
                          archivedThreads.threads.filter(
                            (thread) =>
                              thread.type === ChannelType.AnnouncementThread,
                          ).size
                            ? `${
                                archivedThreads.threads.filter(
                                  (thread) =>
                                    thread.type ===
                                    ChannelType.AnnouncementThread,
                                ).size
                              } archived`
                            : ''
                        })`
                      : ''
                  }${
                    channel.defaultAutoArchiveDuration
                      ? `\nInactivity duration: ${inlineCode(
                          applyThreadAutoArchiveDuration(
                            channel.defaultAutoArchiveDuration,
                          ),
                        )}`
                      : ''
                  }`,
                },
                {
                  name: '🔐 Permissions',
                  value: `${
                    channel.permissionsLocked
                      ? `Synced with ${channel.parent}`
                      : ''
                  }\n${
                    channel.permissionOverwrites.cache.size
                      ? channel.permissionOverwrites.cache
                          .map(
                            (permission) =>
                              `${bold('•')} ${
                                permission.type === OverwriteType.Role
                                  ? permission.id === guild.roles.everyone.id
                                    ? guild.roles.everyone
                                    : roleMention(permission.id)
                                  : userMention(permission.id)
                              }\n${
                                permission.allow.toArray().length
                                  ? `Allowed: ${permission.allow
                                      .toArray()
                                      .map((allowedPermission) =>
                                        inlineCode(
                                          capitalCase(allowedPermission),
                                        ),
                                      )
                                      .join(', ')}\n`
                                  : ''
                              }${
                                permission.deny.toArray().length
                                  ? `Denied: ${permission.deny
                                      .toArray()
                                      .map((deniedPermission) =>
                                        inlineCode(
                                          capitalCase(deniedPermission),
                                        ),
                                      )
                                      .join(', ')}`
                                  : ''
                              }`,
                          )
                          .join('\n\n')
                      : italic('None')
                  }`,
                },
              );

              return interaction.editReply({ embeds: [embed] });
            }

            case ChannelType.GuildVoice: {
              embed.spliceFields(1, 0, {
                name: '📁 Category',
                value: channel.parent ? `${channel.parent}` : italic('None'),
                inline: true,
              });
              embed.spliceFields(
                channel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(channel.position + 1)}${
                    channel.type !== ChannelType.GuildCategory && channel.parent
                      ? ` in ${channel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '👥 Member Count in Voice',
                  value: memberCountVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: '💬 Message Count in Voice',
                  value: pluralize(
                    'message',
                    channel.messages.cache.size,
                    true,
                  ),
                  inline: true,
                },
                {
                  name: '⚡ Bitrate',
                  value: bitrate,
                  inline: true,
                },
                {
                  name: '👥 User Limit',
                  value: userLimitVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: '🎥 Video Quality',
                  value:
                    channel.videoQualityMode === VideoQualityMode.Auto
                      ? 'Auto'
                      : 'Full HD',
                  inline: true,
                },
                {
                  name: '🌐 Region Override',
                  value: regionOverride,
                  inline: true,
                },
              );
              embed.spliceFields(
                8,
                0,
                {
                  name: '⚠️ NSFW',
                  value: isNSFW,
                  inline: true,
                },
                {
                  name: '🐌 Slowmode',
                  value: slowmode,
                  inline: true,
                },
              );

              if (channel.id === guild.afkChannelId) {
                embed.spliceFields(10, 0, {
                  name: '➕ Extra',
                  value: 'AFK Channel',
                  inline: true,
                });
              }

              embed.spliceFields(
                channel.id === guild.afkChannelId ? 11 : 10,
                0,
                {
                  name: '🔐 Permissions',
                  value: `${
                    channel.permissionsLocked
                      ? `Synced with ${channel.parent}`
                      : ''
                  }\n${
                    channel.permissionOverwrites.cache.size
                      ? channel.permissionOverwrites.cache
                          .map(
                            (permission) =>
                              `${bold('•')} ${
                                permission.type === OverwriteType.Role
                                  ? permission.id === guild.roles.everyone.id
                                    ? guild.roles.everyone
                                    : roleMention(permission.id)
                                  : userMention(permission.id)
                              }\n${
                                permission.allow.toArray().length
                                  ? `Allowed: ${permission.allow
                                      .toArray()
                                      .map((allowedPermission) =>
                                        inlineCode(
                                          capitalCase(allowedPermission),
                                        ),
                                      )
                                      .join(', ')}\n`
                                  : ''
                              }${
                                permission.deny.toArray().length
                                  ? `Denied: ${permission.deny
                                      .toArray()
                                      .map((deniedPermission) =>
                                        inlineCode(
                                          capitalCase(deniedPermission),
                                        ),
                                      )
                                      .join(', ')}`
                                  : ''
                              }`,
                          )
                          .join('\n\n')
                      : italic('None')
                  }`,
                },
              );

              return interaction.editReply({ embeds: [embed] });
            }

            case ChannelType.GuildCategory: {
              embed.spliceFields(
                3,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(channel.position + 1)}${
                    channel.type !== ChannelType.GuildCategory && channel.parent
                      ? ` in ${channel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '#️⃣ Channels',
                  value: channel.children.cache.size
                    ? channel.children.cache
                        .map((child) => `${child}`)
                        .join(', ')
                    : italic('None'),
                },
              );
              embed.spliceFields(5, 0, {
                name: '🔐 Permissions',
                value: `${
                  channel.permissionsLocked
                    ? `Synced with ${channel.parent}`
                    : ''
                }\n${
                  channel.permissionOverwrites.cache.size
                    ? channel.permissionOverwrites.cache
                        .map(
                          (permission) =>
                            `${bold('•')} ${
                              permission.type === OverwriteType.Role
                                ? permission.id === guild.roles.everyone.id
                                  ? guild.roles.everyone
                                  : roleMention(permission.id)
                                : userMention(permission.id)
                            }\n${
                              permission.allow.toArray().length
                                ? `Allowed: ${permission.allow
                                    .toArray()
                                    .map((allowedPermission) =>
                                      inlineCode(
                                        capitalCase(allowedPermission),
                                      ),
                                    )
                                    .join(', ')}\n`
                                : ''
                            }${
                              permission.deny.toArray().length
                                ? `Denied: ${permission.deny
                                    .toArray()
                                    .map((deniedPermission) =>
                                      inlineCode(capitalCase(deniedPermission)),
                                    )
                                    .join(', ')}`
                                : ''
                            }`,
                        )
                        .join('\n\n')
                    : italic('None')
                }`,
              });

              return interaction.editReply({ embeds: [embed] });
            }

            case ChannelType.PublicThread:
            case ChannelType.PrivateThread:
            case ChannelType.AnnouncementThread: {
              embed.spliceFields(
                1,
                0,
                {
                  name: '👤 Created By',
                  value: channel.ownerId
                    ? userMention(channel.ownerId)
                    : italic('Unknown'),
                  inline: true,
                },
                {
                  name: '#️⃣ Channel',
                  value: channel.parent ? `${channel.parent}` : italic('None'),
                  inline: true,
                },
              );
              embed.spliceFields(
                channel.parent ? 4 : 3,
                0,
                {
                  name: '👥 Member Count in Thread',
                  value: pluralize('member', channel.members.cache.size, true),
                  inline: true,
                },
                {
                  name: '💬 Message Count',
                  value: pluralize(
                    'message',
                    channel.messages.cache.size,
                    true,
                  ),
                  inline: true,
                },
                {
                  name: '📌 Pinned Message Count',
                  value: pluralize(
                    'pinned message',
                    await channel.messages
                      .fetchPinned()
                      .then((pinned) => pinned.size),
                    true,
                  ),
                  inline: true,
                },
                {
                  name: '📊 Status',
                  value: channel.archived
                    ? channel.locked
                      ? `Locked at ${time(
                          channel.archivedAt,
                          TimestampStyles.RelativeTime,
                        )}`
                      : `Closed at ${time(
                          channel.archivedAt,
                          TimestampStyles.RelativeTime,
                        )}`
                    : 'Active',
                  inline: true,
                },
                {
                  name: '🕒 Inactivity Duration',
                  value: inlineCode(
                    applyThreadAutoArchiveDuration(channel.autoArchiveDuration),
                  ),
                  inline: true,
                },
                {
                  name: '🐌 Slowmode',
                  value: slowmode,
                  inline: true,
                },
              );

              return interaction.editReply({ embeds: [embed] });
            }

            case ChannelType.GuildStageVoice: {
              embed.spliceFields(1, 0, {
                name: '📁 Category',
                value: channel.parent ? `${channel.parent}` : italic('None'),
                inline: true,
              });
              embed.spliceFields(
                channel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(channel.position + 1)}${
                    channel.type !== ChannelType.GuildCategory && channel.parent
                      ? ` in ${channel.parent}`
                      : ''
                  }`,
                  inline: true,
                },
                {
                  name: '👥 Member Count in Stage',
                  value: memberCountVoiceBasedChannel,
                  inline: true,
                },
                {
                  name: '⚡ Bitrate',
                  value: bitrate,
                  inline: true,
                },
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
                    channel.permissionsLocked
                      ? `Synced with ${channel.parent}`
                      : ''
                  }\n${
                    channel.permissionOverwrites.cache.size
                      ? channel.permissionOverwrites.cache
                          .map(
                            (permission) =>
                              `${bold('•')} ${
                                permission.type === OverwriteType.Role
                                  ? permission.id === guild.roles.everyone.id
                                    ? guild.roles.everyone
                                    : roleMention(permission.id)
                                  : userMention(permission.id)
                              }\n${
                                permission.allow.toArray().length
                                  ? `Allowed: ${permission.allow
                                      .toArray()
                                      .map((allowedPermission) =>
                                        inlineCode(
                                          capitalCase(allowedPermission),
                                        ),
                                      )
                                      .join(', ')}\n`
                                  : ''
                              }${
                                permission.deny.toArray().length
                                  ? `Denied: ${permission.deny
                                      .toArray()
                                      .map((deniedPermission) =>
                                        inlineCode(
                                          capitalCase(deniedPermission),
                                        ),
                                      )
                                      .join(', ')}`
                                  : ''
                              }`,
                          )
                          .join('\n\n')
                      : italic('None')
                  }`,
                },
              );

              return interaction.editReply({ embeds: [embed] });
            }

            case ChannelType.GuildForum: {
              const moderatorOnlyTags = channel.availableTags.filter(
                (tag) => tag.moderated,
              );
              const allMembertags = channel.availableTags.filter(
                (tag) => !tag.moderated,
              );

              embed.spliceFields(1, 0, {
                name: '📁 Category',
                value: channel.parent ? `${channel.parent}` : italic('None'),
                inline: true,
              });
              embed.spliceFields(
                channel.parent ? 3 : 2,
                0,
                {
                  name: '🔢 Position',
                  value: `${ordinal(channel.position + 1)}${
                    channel.type !== ChannelType.GuildCategory && channel.parent
                      ? ` in ${channel.parent}`
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
                  value: channel.defaultReactionEmoji
                    ? channel.defaultReactionEmoji.id
                      ? formatEmoji(channel.defaultReactionEmoji.id)
                      : channel.defaultReactionEmoji.name
                    : italic('None'),
                  inline: true,
                },
              );
              embed.spliceFields(
                6,
                0,
                {
                  name: '⚠️ NSFW',
                  value: isNSFW,
                  inline: true,
                },
                {
                  name: '🐌 Slowmode',
                  value: slowmode,
                  inline: true,
                },
                {
                  name: '🏷️ Tags',
                  value: channel.availableTags.length
                    ? `${
                        moderatorOnlyTags.length
                          ? `${bold('• Moderator Only')}\n${moderatorOnlyTags
                              .map(
                                (tag) =>
                                  `${
                                    tag.emoji
                                      ? tag.emoji.id
                                        ? formatEmoji(tag.emoji.id)
                                        : tag.emoji.name
                                      : ''
                                  } ${tag.name}`,
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
                                        ? formatEmoji(tag.emoji.id)
                                        : tag.emoji.name
                                      : ''
                                  } ${tag.name}`,
                              )
                              .join(', ')}`
                          : ''
                      }`
                    : italic('None'),
                },
                {
                  name: '💭 Threads',
                  value: `👁️‍🗨️ ${
                    channel.threads.cache.filter(
                      (thread) => thread.type === ChannelType.PublicThread,
                    ).size
                  } Public | 🔒 ${
                    channel.threads.cache.filter(
                      (thread) => thread.type === ChannelType.PrivateThread,
                    ).size
                  } Private | 📣 ${
                    channel.threads.cache.filter(
                      (thread) =>
                        thread.type === ChannelType.AnnouncementThread,
                    ).size
                  } Announcement${
                    channel.defaultAutoArchiveDuration
                      ? `\nInactivity duration: ${inlineCode(
                          applyThreadAutoArchiveDuration(
                            channel.defaultAutoArchiveDuration,
                          ),
                        )}`
                      : ''
                  }\nSlowmode: ${inlineCode(
                    `${
                      channel.defaultThreadRateLimitPerUser > 0
                        ? `${channel.defaultThreadRateLimitPerUser} seconds`
                        : 'Off'
                    }`,
                  )}`,
                },
                {
                  name: '🔐 Permissions',
                  value: `${
                    channel.permissionsLocked
                      ? `Synced with ${channel.parent}`
                      : ''
                  }\n${
                    channel.permissionOverwrites.cache.size
                      ? channel.permissionOverwrites.cache
                          .map(
                            (permission) =>
                              `${bold('•')} ${
                                permission.type === OverwriteType.Role
                                  ? permission.id === guild.roles.everyone.id
                                    ? guild.roles.everyone
                                    : roleMention(permission.id)
                                  : userMention(permission.id)
                              }\n${
                                permission.allow.toArray().length
                                  ? `Allowed: ${permission.allow
                                      .toArray()
                                      .map((allowedPermission) =>
                                        inlineCode(
                                          capitalCase(allowedPermission),
                                        ),
                                      )
                                      .join(', ')}\n`
                                  : ''
                              }${
                                permission.deny.toArray().length
                                  ? `Denied: ${permission.deny
                                      .toArray()
                                      .map((deniedPermission) =>
                                        inlineCode(
                                          capitalCase(deniedPermission),
                                        ),
                                      )
                                      .join(', ')}`
                                  : ''
                              }`,
                          )
                          .join('\n\n')
                      : italic('None')
                  }`,
                },
              );

              return interaction.editReply({ embeds: [embed] });
            }
          }
        });

      case 'list':
        return interaction.deferReply().then(
          async () =>
            await guild.channels.fetch().then(async (channels) => {
              if (!channels.size) {
                return interaction.editReply({
                  content: `${bold(guild)} doesn't have any channels.`,
                });
              }

              const descriptions = [...channels.values()]
                .sort((a, b) => b.type - a.type)
                .map((ch, index) => `${bold(`${index + 1}.`)} ${ch}`);

              const pagination = new Pagination(interaction, {
                limit: 10,
              });

              pagination.setColor(guild.members.me.displayHexColor);
              pagination.setTimestamp(Date.now());
              pagination.setFooter({
                text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                iconURL: client.user.displayAvatarURL({
                  dynamic: true,
                }),
              });
              pagination.setAuthor({
                name: `#️⃣ ${guild} Channel Lists (${channels.size})`,
              });

              if (guild.icon) {
                pagination.setAuthor({
                  name: `${guild} Channel Lists (${channels.size})`,
                  iconURL: guild.iconURL({ dynamic: true }),
                });
              }

              pagination.buttons = {
                ...pagination.buttons,
                extra: new ButtonBuilder()
                  .setCustomId('jump')
                  .setEmoji('↕️')
                  .setDisabled(false)
                  .setStyle(ButtonStyle.Secondary),
              };

              paginations.set(pagination.interaction.id, pagination);

              pagination.setDescriptions(descriptions);

              await pagination.render();
            }),
        );
    }
  },
};
