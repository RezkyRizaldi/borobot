const { SlashCommandBuilder } = require('discord.js');
const { Pagination } = require('pagination.djs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inrole')
    .setDescription('👥 Show member list with specific role.')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('🛠️ The member role to show.')
        .setRequired(true),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const membersWithRole = interaction.guild.members.cache
      .filter((member) => member.roles.cache.has(role.id))
      .map((member) => member.user.username);

    if (!membersWithRole.length) {
      return interaction.reply({
        content: `There is no member with role ${role}`,
        ephemeral: true,
      });
    }

    const descriptions = membersWithRole.map(
      (member, index) => `${index + 1}. ${member}`,
    );

    const pagination = new Pagination(interaction, {
      ephemeral: true,
    });

    pagination.setTitle(
      `👥 Member list with role ${role.name} (${membersWithRole.length})`,
    );
    pagination.setColor(interaction.guild.members.me.displayHexColor);
    pagination.setTimestamp(Date.now());
    pagination.setFooter({
      text: `${interaction.client.user.username} | Page {pageNumber} of {totalPages}`,
      iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
    });
    pagination.setDescriptions(descriptions);
    pagination.render();
  },
};
