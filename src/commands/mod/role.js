/* global BigInt */
const { capitalCase } = require('change-case');
const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  inlineCode,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const moment = require('moment');
const ordinal = require('ordinal');
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');

const {
  roleModifyPermissionTypeChoices,
  rolePermissionChoices,
} = require('../../constants');
const { applyHexColor, applyPermission } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('🛠️ Role command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('➕ Add a role to a member.')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('👤 The member to be added a new role.')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('‍🛠️ The role to add.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for adding the role.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('compare')
        .setDescription('⚖️ Compare two roles.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('🛠️ The first role to compare.')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('to_role')
            .setDescription('‍🛠️ The second role to compare.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('🆕 Create a new role.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription("🔤 The role's name.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option.setName('color').setDescription("🎨 The role's color."),
        )
        .addBooleanOption((option) =>
          option
            .setName('hoist')
            .setDescription(
              '🪢 Whether to display the role separately or not.',
            ),
        )
        .addBooleanOption((option) =>
          option
            .setName('mentionable')
            .setDescription(
              '🏷️ Whether to allow members to mention the role or not.',
            ),
        )
        .addRoleOption((option) =>
          option
            .setName('position')
            .setDescription(
              "🛠️ The role's position to be specified on top of this role.",
            ),
        )
        .addIntegerOption((option) =>
          option
            .setName('permission')
            .setDescription("🔐 The role's permissions.")
            .addChoices(...rolePermissionChoices),
        )
        .addIntegerOption((option) =>
          option
            .setName('permission2')
            .setDescription("🔐 The role's permissions.")
            .addChoices(...rolePermissionChoices),
        )
        .addIntegerOption((option) =>
          option
            .setName('permission3')
            .setDescription("🔐 The role's permissions.")
            .addChoices(...rolePermissionChoices),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for creating the role.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('🗑️ Delete a role.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('‍🛠️ The role to delete.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for deleting the role.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('ℹ️ Show the information about the role.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('🛠️ The role to show.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('📄 Show list of server roles.'),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('modify')
        .setDescription('✏️ Modify a role.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('color')
            .setDescription('🎨 Modify the role color.')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('🛠️ The role to modify.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('color')
                .setDescription("🎨 The role's new color.")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the role.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('hoist')
            .setDescription('🪢 Modify the role hoist state.')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('🛠️ The role to modify.')
                .setRequired(true),
            )
            .addBooleanOption((option) =>
              option
                .setName('hoist')
                .setDescription(
                  '🪢 Whether to display the role separately or not.',
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the role.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('mentionable')
            .setDescription('🏷️ Modify the role mentionable state.')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('🛠️ The role to modify.')
                .setRequired(true),
            )
            .addBooleanOption((option) =>
              option
                .setName('mentionable')
                .setDescription(
                  '🏷️ Whether to allow members to mention the role or not.',
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the role.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('name')
            .setDescription('🔤 Modify the role name.')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('🛠️ The role to modify.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription("🔤 The role's new name.")
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the role.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('permissions')
            .setDescription('🔐 Modify the role permissions.')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('🛠️ The role to modify.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('type')
                .setDescription('🔣 The modifying type.')
                .addChoices(...roleModifyPermissionTypeChoices)
                .setRequired(true),
            )
            .addIntegerOption((option) =>
              option
                .setName('permission')
                .setDescription("🔐 The role's permissions.")
                .addChoices(...rolePermissionChoices)
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the role.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('position')
            .setDescription('🔢 Modify the role position (hierarchy).')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('🛠️ The role to modify.')
                .setRequired(true),
            )
            .addRoleOption((option) =>
              option
                .setName('position')
                .setDescription(
                  "🛠️ The role's position to be specified on top of this role.",
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('reason')
                .setDescription('📃 The reason for modifying the role.'),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('➖ Remove a role from a member.')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('👤 The member whose role to be removed.')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('🛠️ The role to remove.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('📃 The reason for removing the role.'),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ client: import('discord.js').Client<true>, guild: ?import('discord.js').Guild, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { client, guild, member, options } = interaction;

    if (!guild) return;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    const reason = options.getString('reason') ?? 'No reason';

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommandGroup()) {
      case 'modify': {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (
            !interaction.member.permissions.has(
              PermissionFlagsBits.ManageRoles,
            ) ||
            !role.editable ||
            role.position > guild.members.me?.roles.highest.position
          ) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to modify the ${role} role.`,
            });
          }

          switch (options.getSubcommand()) {
            case 'name': {
              const name = options.getString('name', true);

              if (name.toLowerCase() === role.name.toLowerCase()) {
                return interaction.editReply({
                  content: 'You have to specify a different name to modify.',
                });
              }

              return role.setName(name, reason).then(
                async (r) =>
                  await interaction.editReply({
                    content: `Successfully ${bold('modified')} ${r}.`,
                  }),
              );
            }

            case 'color': {
              const color = options.getString('color', true);
              const convertedColor = applyHexColor(color);

              if (
                convertedColor.toLowerCase() === role.hexColor.toLowerCase()
              ) {
                return interaction.editReply({
                  content: 'You have to specify a different color to modify.',
                });
              }

              return role.setColor(convertedColor, reason).then(
                async (r) =>
                  await interaction.editReply({
                    content: `Successfully ${bold('modified')} ${r}.`,
                  }),
              );
            }

            case 'position': {
              /** @type {import('discord.js').Role} */
              const targetRolePosition = options.getRole('position', true);

              if (
                targetRolePosition.permissions.bitfield >
                role.permissions.bitfield
              ) {
                return interaction.editReply({
                  content: `You don't have appropiate permissions to modify ${targetRolePosition} role's position.`,
                });
              }

              if (role.position === targetRolePosition.position) {
                return interaction.editReply({
                  content:
                    'You have to specify a different position to modify.',
                });
              }

              return role
                .setPosition(targetRolePosition.position, { reason })
                .then(
                  async (r) =>
                    await interaction.editReply({
                      content: `Successfully ${bold('modified')} ${r}.`,
                    }),
                );
            }

            case 'hoist': {
              const hoist = options.getBoolean('hoist', true);

              if (hoist === role.hoist) {
                return interaction.editReply({
                  content: `${role}'s hoist state ${
                    role.hoist ? 'is already' : "isn't"
                  } being turned on.`,
                });
              }

              return role.setHoist(hoist, reason).then(
                async (r) =>
                  await interaction.editReply({
                    content: `Successfully turned ${
                      r.hoist ? 'on' : 'off'
                    } ${r}'s hoist state.`,
                  }),
              );
            }

            case 'mentionable': {
              const mentionable = options.getBoolean('mentionable', true);

              if (mentionable === role.mentionable) {
                return interaction.editReply({
                  content: `${role}'s mentionable state ${
                    role.mentionable ? 'is already' : "isn't"
                  } being turned on.`,
                });
              }

              return role.setMentionable(mentionable, reason).then(
                async (r) =>
                  await interaction.editReply({
                    content: `Successfully turned ${
                      r.mentionable ? 'on' : 'off'
                    } ${r}'s mentionable state.`,
                  }),
              );
            }

            case 'permissions': {
              const type = options.getString('type', true);
              const permission = BigInt(options.getInteger('permission', true));

              switch (type) {
                case 'grant': {
                  const missingPermissions =
                    role.permissions.missing(permission);

                  if (permission === BigInt(0)) {
                    return interaction.editReply({
                      content: 'You have to specify a permission to grant.',
                    });
                  }

                  if (role.permissions.has(permission)) {
                    return interaction.editReply({
                      content: `${inlineCode(
                        applyPermission(permission),
                      )} permission is already granted for ${role} role.`,
                    });
                  }

                  if (!missingPermissions.length) {
                    return interaction.editReply({
                      content: `${role} role already have all permissions.`,
                    });
                  }

                  return role
                    .setPermissions(role.permissions.add(permission), reason)
                    .then(
                      async (r) =>
                        await interaction.editReply({
                          content: `Successfully granted ${missingPermissions
                            .map((perm) => inlineCode(capitalCase(perm)))
                            .join(', ')} ${pluralize(
                            'permission',
                            missingPermissions.length,
                          )} for ${r} role.`,
                        }),
                    );
                }

                case 'deny': {
                  const hasPermissions = role.permissions
                    .toArray()
                    .filter(
                      (perm) => !role.permissions.toArray().includes(perm),
                    );

                  if (!role.permissions.has(permission)) {
                    return interaction.editReply({
                      content: `${inlineCode(
                        applyPermission(permission),
                      )} permission is already denied for ${role} role.`,
                    });
                  }

                  if (!hasPermissions.length) {
                    return interaction.editReply({
                      content: `${role} role doesn't have any permissions.`,
                    });
                  }

                  return role
                    .setPermissions(role.permissions.remove(permission), reason)
                    .then(
                      async (r) =>
                        await interaction.editReply({
                          content: `Successfully denied ${hasPermissions
                            .map((perm) => inlineCode(capitalCase(perm)))
                            .join(', ')} ${pluralize(
                            'permission',
                            hasPermissions.length,
                          )} for ${r} role.`,
                        }),
                    );
                }
              }
            }
          }
        });
      }
    }

    switch (options.getSubcommand()) {
      case 'compare': {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        /** @type {import('discord.js').Role} */
        const targetRole = options.getRole('to_role', true);

        if (role.id === targetRole.id) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'You have to specify another role to compare.',
              }),
          );
        }

        const positionComparison = role.position > targetRole.position;
        const higherPosition = positionComparison ? role : targetRole;
        const comparedPosition = positionComparison
          ? role.comparePositionTo(targetRole)
          : targetRole.comparePositionTo(role);

        const rolePermissionsBitField = Number(role.permissions.bitfield);
        const targetRolePermissionsBitField = Number(
          targetRole.permissions.bitfield,
        );
        const permissionsComparison =
          rolePermissionsBitField > targetRolePermissionsBitField;
        const highestPermissions = permissionsComparison
          ? role
          : rolePermissionsBitField === targetRolePermissionsBitField
          ? 'Equal'
          : targetRole;
        const permissionsValueComparison = Math.abs(
          rolePermissionsBitField - targetRolePermissionsBitField,
        );

        const roleMemberCount = role.members.size;
        const targetRoleMemberCount = targetRole.members.size;
        const memberCountComparison = roleMemberCount > targetRoleMemberCount;
        const highestMemberCount = memberCountComparison
          ? role
          : roleMemberCount === targetRoleMemberCount
          ? 'Equal'
          : targetRole;
        const memberCountValueComparison = Math.abs(
          roleMemberCount - targetRoleMemberCount,
        );

        const roleCreatedTimestamp = role.createdTimestamp;
        const targetRoleCreatedTimestamp = targetRole.createdTimestamp;
        const createdTimestampComparison =
          roleCreatedTimestamp < targetRoleCreatedTimestamp;
        const firstMade = createdTimestampComparison
          ? role
          : roleCreatedTimestamp === targetRoleCreatedTimestamp
          ? 'Same time'
          : targetRole;
        const createdAtValueComparison = Math.abs(
          moment(role.createdAt).diff(targetRole.createdAt),
        );

        return interaction.deferReply().then(async () => {
          embed.setAuthor({
            name: `⚖️ ${role.name} & ${targetRole.name} Role Comparison`,
          });
          embed.setFields([
            {
              name: '🔢 Higher Position',
              value: `${higherPosition} (+${comparedPosition})`,
              inline: true,
            },
            {
              name: '🔐 Highest Permissions',
              value: `${highestPermissions} ${
                permissionsValueComparison > 0
                  ? `(+${permissionsValueComparison})`
                  : ''
              }`,
              inline: true,
            },
            {
              name: '👤 Highest Member Count',
              value: `${highestMemberCount} ${
                memberCountValueComparison > 0
                  ? `(+${memberCountValueComparison.toLocaleString()})`
                  : ''
              }`,
              inline: true,
            },
            {
              name: '📆 First Made',
              value: `${firstMade} ${
                createdAtValueComparison > 0
                  ? `(+${moment.duration(createdAtValueComparison).humanize()})`
                  : ''
              }`,
              inline: true,
            },
          ]);

          await interaction.editReply({ embeds: [embed] });
        });
      }

      case 'info': {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        return interaction.deferReply().then(async () => {
          embed.setAuthor({
            name: `ℹ️ ${role.name}'s Role Information`,
          });
          embed.setFields([
            {
              name: '📆 Created At',
              value: time(role.createdAt, TimestampStyles.RelativeTime),
              inline: true,
            },
            {
              name: '🎨 Color',
              value: role.hexColor,
              inline: true,
            },
            {
              name: '🪢 Hoist',
              value: role.hoist ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: '🏷️ Mentionable',
              value: role.mentionable ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: '⚙️ Managed',
              value: role.managed ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: '👤 Member Count',
              value: `${role.members.size.toLocaleString()} ${pluralize(
                'member',
                role.members.size,
              )}`,
              inline: true,
            },
            {
              name: '🔢 Position',
              value: ordinal(role.position),
              inline: true,
            },
            {
              name: '🔐 Permissions',
              value: role.permissions
                .toArray()
                .map((permission) => inlineCode(capitalCase(permission)))
                .join(', '),
            },
          ]);

          if (role.unicodeEmoji) {
            embed.spliceFields(7, 0, {
              name: '😀 Emoji',
              value: role.unicodeEmoji,
              inline: true,
            });
          }

          await interaction.editReply({ embeds: [embed] });
        });
      }

      case 'create': {
        const name = options.getString('name', true);
        const color = options.getString('color');
        const hoist = options.getBoolean('hoist') ?? false;
        const mentionable = options.getBoolean('mentionable') ?? false;

        /** @type {?import('discord.js').Role} */
        const targetRolePosition = options.getRole('position');
        const permission = options.getInteger('permission');
        const permission2 = options.getInteger('permission2');
        const permission3 = options.getInteger('permission3');

        const convertedColor =
          color !== null ? applyHexColor(color) : Colors.Default;
        const permissionArray = [permission, permission2, permission3]
          .filter((perm) => !!perm)
          .map((perm) => BigInt(perm));

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (!member) {
            return interaction.editReply({
              content: "Member doesn't exist.",
            });
          }

          if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.editReply({
              content:
                "You don't have appropiate permissions to create a role.",
            });
          }

          await guild.roles
            .create({
              name,
              color: convertedColor,
              hoist,
              mentionable,
              reason,
              position: targetRolePosition
                ? targetRolePosition.position + 1
                : 1,
              permissions: permissionArray.length
                ? [...new Set(permissionArray)]
                : PermissionsBitField.Default,
            })
            .then(
              async (r) =>
                await interaction.editReply({
                  content: `${r} role created successfully.`,
                }),
            );
        });
      }

      case 'delete': {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (
            !member.permissions.has(PermissionFlagsBits.ManageRoles) ||
            role.managed ||
            role.position > guild.members.me?.roles.highest.position
          ) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to delete ${role} role.`,
            });
          }

          await guild.roles.delete(role, reason).then(
            async () =>
              await interaction.editReply({
                content: 'Role deleted successfully.',
              }),
          );
        });
      }

      case 'add': {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        /** @type {import('discord.js').GuildMember} */
        const target = options.getMember('member', true);

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (!member) {
            return interaction.editReply({
              content: "Member doesn't exist.",
            });
          }

          if (
            !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
            role.managed ||
            role.position > guild.members.me?.roles.highest.position ||
            !target.manageable
          ) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to add ${role} role to ${target}.`,
            });
          }

          if (target.roles.cache.has(role.id)) {
            return interaction.editReply({
              content: `${target} is already have ${role} role.`,
            });
          }

          await target.roles.add(role, reason).then(
            async (m) =>
              await interaction.editReply({
                content: `Successfully ${bold('added')} ${role} role to ${m}.`,
              }),
          );
        });
      }

      case 'remove': {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        /** @type {import('discord.js').GuildMember} */
        const target = options.getMember('member', true);

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (!member) {
            return interaction.editReply({
              content: "Member doesn't exist.",
            });
          }

          if (
            !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
            role.managed ||
            role.position > guild.members.me?.roles.highest.position ||
            !target.manageable
          ) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to remove ${role} role from ${target}.`,
            });
          }

          if (!target.roles.cache.has(role.id)) {
            return interaction.editReply({
              content: `${target} doesn't have ${role} role.`,
            });
          }

          await target.roles.remove(role, reason).then(
            async (m) =>
              await interaction.editReply({
                content: `Successfully ${bold(
                  'removed',
                )} ${role} role from ${m}.`,
              }),
          );
        });
      }

      case 'list':
        return interaction.deferReply().then(
          async () =>
            await guild.roles.fetch().then(async (rls) => {
              if (!rls.size) {
                return interaction.editReply({
                  content: `${bold(guild)} doesn't have any role.`,
                });
              }

              const descriptions = [...rls.values()]
                .filter((r) => r.id !== guild.roles.everyone.id)
                .sort((a, b) => b.position - a.position)
                .map((r, index) => `${bold(`${index + 1}.`)} ${r}`);

              if (rls.size > 10) {
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

                if (!guild.icon) {
                  pagination.setAuthor({
                    name: `🔐 ${guild} Role Lists (${rls.size.toLocaleString()})`,
                  });
                }

                pagination.setAuthor({
                  name: `${guild} Role Lists (${rls.size.toLocaleString()})`,
                  iconURL: guild.iconURL({ dynamic: true }),
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

              if (!guild.icon) {
                embed.setAuthor({
                  name: `🔐 ${guild} Role Lists (${rls.size.toLocaleString()})`,
                });
              }

              embed.setAuthor({
                name: `${guild} Role Lists (${rls.size.toLocaleString()})`,
                iconURL: guild.iconURL({ dynamic: true }),
              });
              embed.setDescription(descriptions.join('\n'));

              await interaction.editReply({ embeds: [embed] });
            }),
        );
    }
  },
};
