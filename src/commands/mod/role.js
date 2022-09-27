const {
  bold,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { Pagination } = require('pagination.djs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('🛠️ Set the roles for a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('modify')
        .setDescription('➕ Modify a role.')
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
                .setDescription('📃 The reason for adding the role.'),
            ),
        ),
    )
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
        .setName('remove')
        .setDescription('➖ Remove a role from member.')
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('📄 Show list of server roles.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');

    /** @type {import('discord.js').Role} */
    const role = options.getRole('role');
    const reason = options.getString('reason') ?? 'No reason';

    switch (options.getSubcommandGroup()) {
      case 'modify':
        if (!role.editable) {
          return interaction.editReply({
            content: `You don't have appropiate permissions to modify the ${role} role.`,
          });
        }

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          switch (options.getSubcommand()) {
            case 'name': {
              const name = options.getString('name');

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
          }
        });
    }

    switch (options.getSubcommand()) {
      case 'add':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (!member.manageable) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to add ${role} role to ${member}.`,
            });
          }

          if (member.roles.cache.has(role.id)) {
            return interaction.editReply({
              content: `${member} is already have ${role} role.`,
            });
          }

          await member.roles.add(role, reason).then(
            async (m) =>
              await interaction.editReply({
                content: `Successfully ${bold('added')} ${role} role to ${m}.`,
              }),
          );
        });

      case 'remove':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          if (!member.manageable) {
            return interaction.editReply({
              content: `You don't have appropiate permissions to remove ${role} role from ${member}.`,
            });
          }

          if (!member.roles.cache.has(role.id)) {
            return interaction.editReply({
              content: `${member} doesn't have ${role} role.`,
            });
          }

          await member.roles.remove(role, reason).then(
            async (m) =>
              await interaction.editReply({
                content: `Successfully ${bold(
                  'removed',
                )} ${role} role from ${m}.`,
              }),
          );
        });

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

                pagination.setColor(guild.members.me.displayHexColor);
                pagination.setTimestamp(Date.now());
                pagination.setFooter({
                  text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                  iconURL: client.user.displayAvatarURL({
                    dynamic: true,
                  }),
                });
                pagination.setAuthor({
                  name: `🔐 ${guild} Role Lists (${rls.size})`,
                });
                pagination.setDescriptions(descriptions);

                return pagination.render();
              }

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
                  name: `🔐 ${guild} Role Lists (${rls.size})`,
                })
                .setDescription(descriptions.join('\n'));

              await interaction.editReply({ embeds: [embed] });
            }),
        );
    }
  },
};
