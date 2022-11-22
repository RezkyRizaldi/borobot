const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
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
    const { client, guild, options } = interaction;

    if (!guild) return;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    /** @type {import('discord.js').Role} */
    const role = options.getRole('role', true);

    const membersWithRole = guild.members.cache.filter((member) =>
      member.roles.cache.has(role.id),
    );

    if (!membersWithRole.size) {
      await interaction.deferReply({ ephemeral: true });

      return interaction.editReply({
        content: `There is no member with role ${role}`,
      });
    }

    await interaction.deferReply();

    const descriptions = [...membersWithRole.values()].map(
      (member, index) =>
        `${bold(`${index + 1}.`)} ${member} (${member.user.username})`,
    );

    if (membersWithRole.size > 10) {
      const pagination = new Pagination(interaction, { limit: 10 })
        .setColor(guild.members.me?.displayHexColor ?? null)
        .setTimestamp(Date.now())
        .setFooter({
          text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setAuthor({
          name: `👥 Member Lists with Role ${
            role.name
          } (${membersWithRole.size.toLocaleString()})`,
        })
        .setDescriptions(descriptions);

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

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: `👥 Member Lists with Role ${
          role.name
        } (${membersWithRole.size.toLocaleString()})`,
      })
      .setDescription(descriptions.join('\n'));

    return interaction.editReply({ embeds: [embed] });
  },
};
