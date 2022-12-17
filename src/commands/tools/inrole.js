const { bold, SlashCommandBuilder } = require('discord.js');

const { generateEmbed, generatePagination } = require('../../utils');

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
    const { guild, options } = interaction;

    if (!guild) return;

    await interaction.deferReply();

    /** @type {import('discord.js').Role} */
    const role = options.getRole('role', true);

    const membersWithRole = guild.members.cache.filter((member) =>
      member.roles.cache.has(role.id),
    );

    if (!membersWithRole.size) {
      throw `There is no member with role ${role}`;
    }

    const descriptions = [...membersWithRole.values()].map(
      (member, ii) =>
        `${bold(`${ii + 1}.`)} ${member} (${member.user.username})`,
    );

    if (membersWithRole.size > 10) {
      return await generatePagination()
        .setAuthor({
          name: `👥 Member Lists with Role ${
            role.name
          } (${membersWithRole.size.toLocaleString()})`,
        })
        .setDescriptions(descriptions)
        .render();
    }

    const embed = generateEmbed({ interaction })
      .setAuthor({
        name: `👥 Member Lists with Role ${
          role.name
        } (${membersWithRole.size.toLocaleString()})`,
      })
      .setDescription(descriptions.join('\n'));

    await interaction.editReply({ embeds: [embed] });
  },
};
