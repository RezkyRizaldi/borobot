/* global BigInt */
const { capitalCase } = require('change-case');
const {
  bold,
  Colors,
  inlineCode,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const moment = require('moment');
const ordinal = require('ordinal');
const pluralize = require('pluralize');

const {
  roleModifyPermissionTypeChoices,
  rolePermissionChoices,
} = require('@/constants');
const {
  applyHexColor,
  applyPermission,
  count,
  generateEmbed,
  generatePagination,
} = require('@/utils');

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
    /** @type {{ guild: ?import('discord.js').Guild, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { guild, member, options } = interaction;

    if (!guild) return;

    await interaction.deferReply();

    const reason = options.getString('reason') ?? 'No reason';

    const embed = generateEmbed({ interaction });

    if (options.getSubcommandGroup() !== null) {
      return {
        modify: () => {
          /** @type {import('discord.js').Role} */
          const role = options.getRole('role', true);

          if (
            !interaction.member.permissions.has(
              PermissionFlagsBits.ManageRoles,
            ) ||
            !role.editable ||
            role.position > guild.members.me?.roles.highest.position
          ) {
            throw `You don't have appropiate permissions to modify the ${role} role.`;
          }

          return {
            name: async () => {
              const name = options.getString('name', true);

              if (name.toLowerCase() === role.name.toLowerCase()) {
                throw 'You have to specify a different name to modify.';
              }

              await role.setName(name, reason);

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${role}.`,
              });
            },
            color: async () => {
              const color = options.getString('color', true);
              const convertedColor = applyHexColor(color);

              if (
                convertedColor.toLowerCase() === role.hexColor.toLowerCase()
              ) {
                throw 'You have to specify a different color to modify.';
              }

              await role.setColor(convertedColor, reason);

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${role}.`,
              });
            },
            position: async () => {
              /** @type {import('discord.js').Role} */
              const targetRolePosition = options.getRole('position', true);

              if (
                targetRolePosition.permissions.bitfield >
                role.permissions.bitfield
              ) {
                throw `You don't have appropiate permissions to modify ${targetRolePosition} role's position.`;
              }

              if (role.position === targetRolePosition.position) {
                throw 'You have to specify a different position to modify.';
              }

              await role.setPosition(targetRolePosition.position, { reason });

              await interaction.editReply({
                content: `Successfully ${bold('modified')} ${role}.`,
              });
            },
            hoist: async () => {
              const hoist = options.getBoolean('hoist', true);

              if (hoist === role.hoist) {
                throw `${role}'s hoist state ${
                  role.hoist ? 'is already' : "isn't"
                } being turned on.`;
              }

              await role.setHoist(hoist, reason);

              await interaction.editReply({
                content: `Successfully turned ${
                  role.hoist ? 'on' : 'off'
                } ${role}'s hoist state.`,
              });
            },
            mentionable: async () => {
              const mentionable = options.getBoolean('mentionable', true);

              if (mentionable === role.mentionable) {
                throw `${role}'s mentionable state ${
                  role.mentionable ? 'is already' : "isn't"
                } being turned on.`;
              }

              await role.setMentionable(mentionable, reason);

              await interaction.editReply({
                content: `Successfully turned ${
                  role.mentionable ? 'on' : 'off'
                } ${role}'s mentionable state.`,
              });
            },
            permissions: () => {
              const type = options.getString('type', true);
              const permission = BigInt(options.getInteger('permission', true));

              return {
                grant: async () => {
                  const missingPermissions =
                    role.permissions.missing(permission);

                  if (permission === BigInt(0)) {
                    throw 'You have to specify a permission to grant.';
                  }

                  if (role.permissions.has(permission)) {
                    throw `${inlineCode(
                      applyPermission(permission),
                    )} permission is already granted for ${role} role.`;
                  }

                  if (!missingPermissions.length) {
                    throw `${role} role already have all permissions.`;
                  }

                  await role.setPermissions(
                    role.permissions.add(permission),
                    reason,
                  );

                  await interaction.editReply({
                    content: `Successfully granted ${missingPermissions
                      .map((perm) => inlineCode(capitalCase(perm)))
                      .join(', ')} ${pluralize(
                      'permission',
                      missingPermissions.length,
                    )} for ${role} role.`,
                  });
                },
                deny: async () => {
                  const hasPermissions = role.permissions
                    .toArray()
                    .filter(
                      (perm) => !role.permissions.toArray().includes(perm),
                    );

                  if (!role.permissions.has(permission)) {
                    throw `${inlineCode(
                      applyPermission(permission),
                    )} permission is already denied for ${role} role.`;
                  }

                  if (!hasPermissions.length) {
                    throw `${role} role doesn't have any permissions.`;
                  }

                  await role.setPermissions(
                    role.permissions.remove(permission),
                    reason,
                  );

                  await interaction.editReply({
                    content: `Successfully denied ${hasPermissions
                      .map((perm) => inlineCode(capitalCase(perm)))
                      .join(', ')} ${pluralize(
                      'permission',
                      hasPermissions.length,
                    )} for ${role} role.`,
                  });
                },
              }[type]();
            },
          }[options.getSubcommand()]();
        },
      }[options.getSubcommandGroup()]();
    }

    return {
      compare: async () => {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        /** @type {import('discord.js').Role} */
        const targetRole = options.getRole('to_role', true);

        if (role.id === targetRole.id) {
          throw 'You have to specify another role to compare.';
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

        embed
          .setAuthor({
            name: `⚖️ ${role.name} & ${targetRole.name} Role Comparison`,
          })
          .setFields([
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
      },
      info: async () => {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        embed
          .setAuthor({ name: `ℹ️ ${role.name}'s Role Information` })
          .setFields([
            {
              name: '📆 Created At',
              value: time(role.createdAt, TimestampStyles.RelativeTime),
              inline: true,
            },
            { name: '🎨 Color', value: role.hexColor, inline: true },
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
              value: count({ total: role.members.size, data: 'member' }),
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
      },
      create: async () => {
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
          .filter((perm) => perm !== null)
          .map((perm) => BigInt(perm));

        if (!member) throw "Member doesn't exist.";

        if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
          throw "You don't have appropiate permissions to create a role.";
        }

        const role = await guild.roles.create({
          name,
          color: convertedColor,
          hoist,
          mentionable,
          reason,
          position: targetRolePosition ? targetRolePosition.position + 1 : 1,
          permissions: permissionArray.length
            ? [...new Set(permissionArray)]
            : PermissionsBitField.Default,
        });

        await interaction.editReply({
          content: `${role} role created successfully.`,
        });
      },
      delete: async () => {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        if (
          !member.permissions.has(PermissionFlagsBits.ManageRoles) ||
          role.managed ||
          role.position > guild.members.me?.roles.highest.position
        ) {
          throw `You don't have appropiate permissions to delete ${role} role.`;
        }

        await guild.roles.delete(role, reason);

        await interaction.editReply({ content: 'Role deleted successfully.' });
      },
      add: async () => {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        /** @type {import('discord.js').GuildMember} */
        const target = options.getMember('member', true);

        if (!member) throw "Member doesn't exist.";

        if (
          !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
          role.managed ||
          role.position > guild.members.me?.roles.highest.position ||
          !target.manageable
        ) {
          throw `You don't have appropiate permissions to add ${role} role to ${target}.`;
        }

        if (target.roles.cache.has(role.id)) {
          throw `${target} is already have ${role} role.`;
        }

        await target.roles.add(role, reason);

        await interaction.editReply({
          content: `Successfully ${bold('added')} ${role} role to ${member}.`,
        });
      },
      remove: async () => {
        /** @type {import('discord.js').Role} */
        const role = options.getRole('role', true);

        /** @type {import('discord.js').GuildMember} */
        const target = options.getMember('member', true);

        if (!member) throw "Member doesn't exist.";

        if (
          !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
          role.managed ||
          role.position > guild.members.me?.roles.highest.position ||
          !target.manageable
        ) {
          throw `You don't have appropiate permissions to remove ${role} role from ${target}.`;
        }

        if (!target.roles.cache.has(role.id)) {
          throw `${target} doesn't have ${role} role.`;
        }

        await target.roles.remove(role, reason);

        await interaction.editReply({
          content: `Successfully ${bold(
            'removed',
          )} ${role} role from ${member}.`,
        });
      },
      list: async () => {
        const roles = await guild.roles.fetch();

        if (!roles.size) throw `${bold(guild)} doesn't have any role.`;

        const descriptions = [...roles.values()]
          .filter((r) => r.id !== guild.roles.everyone.id)
          .sort((a, b) => b.position - a.position)
          .map((r, i) => `${bold(`${i + 1}.`)} ${r}`);

        if (roles.size > 10) {
          return await generatePagination({ interaction, limit: 10 })
            .setAuthor({
              name: `${
                guild.icon ? '🔐 ' : ''
              }${guild} Role Lists (${roles.size.toLocaleString()})`,
              iconURL: guild.iconURL() ?? undefined,
            })
            .setDescriptions(descriptions)
            .render();
        }

        embed
          .setAuthor({
            name: `${
              guild.icon ? '🔐 ' : ''
            }${guild} Role Lists (${roles.size.toLocaleString()})`,
            iconURL: guild.iconURL() ?? undefined,
          })
          .setDescription(descriptions.join('\n'));

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
