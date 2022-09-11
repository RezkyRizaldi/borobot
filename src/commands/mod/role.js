const {
  bold,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('🛠️ Set the roles for a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
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
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    /** @type {import('discord.js').GuildMember} */
    const member = options.getMember('member');
    const role = options.getRole('role');
    const reason = options.getString('reason') || 'No reason';

    switch (options.getSubcommand()) {
      case 'add':
        if (!role.editable) {
          return interaction.reply({
            content: `You don't have appropiate permissions to add ${role} role to this member.`,
            ephemeral: true,
          });
        }

        if (member.roles.cache.has(role.id)) {
          return interaction.reply({
            content: `This member already have ${role} role.`,
            ephemeral: true,
          });
        }

        return member.roles
          .add(role, reason)
          .then(
            async (m) =>
              await interaction.reply({
                content: `Successfully ${bold('added')} ${role} role to ${m}.`,
                ephemeral: true,
              }),
          )
          .catch((err) => console.error(err));

      case 'remove':
        if (!role.editable) {
          return interaction.reply({
            content: `You don't have appropiate permissions to remove ${role} role from this member.`,
            ephemeral: true,
          });
        }

        if (!member.roles.cache.has(role.id)) {
          return interaction.reply({
            content: `This member doesn't have ${role} role.`,
            ephemeral: true,
          });
        }

        return member.roles
          .remove(role, reason)
          .then(
            async (m) =>
              await interaction.reply({
                content: `Successfully ${bold(
                  'removed',
                )} ${role} role from ${m}.`,
                ephemeral: true,
              }),
          )
          .catch((err) => console.error(err));
    }
  },
};
