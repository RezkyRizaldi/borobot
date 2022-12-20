const { capitalCase } = require('change-case');
const { ActivityType, bold, SlashCommandBuilder } = require('discord.js');

const { generateEmbed, generatePagination } = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inplay')
    .setDescription('👥 Show member currently playing the specified activity.')
    .addStringOption((option) =>
      option
        .setName('activity')
        .setDescription('🎮 The activity name currently being played.')
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

    const activity = options.getString('activity', true);

    const membersWithActivity = guild.members.cache
      .filter(
        (member) => !member.user.bot && member.presence?.activities.length,
      )
      .each((member) =>
        member.presence.activities.filter(
          (act) => act.type === ActivityType.Playing,
        ),
      )
      .filter((member) =>
        member.presence.activities.find(
          (act) => act.name.toLowerCase() === activity.toLowerCase(),
        ),
      );

    if (!membersWithActivity.size) {
      throw `There is no member currently playing ${activity}.`;
    }

    const descriptions = [...membersWithActivity.values()].map(
      (member, i) => `${bold(`${i + 1}.`)} ${member} (${member.user.username})`,
    );

    if (membersWithActivity.size > 10) {
      return await generatePagination({ interaction, limit: 10 })
        .setAuthor({
          name: `👥 Member Lists Currently Playing ${capitalCase(
            activity,
          )} (${membersWithActivity.size.toLocaleString()})`,
        })
        .setDescriptions(descriptions)
        .render();
    }

    const embed = generateEmbed({ interaction })
      .setAuthor({
        name: `👥 Member Lists Currently Playing ${capitalCase(
          activity,
        )} (${membersWithActivity.size.toLocaleString()})`,
      })
      .setDescription(descriptions.join('\n'));

    await interaction.editReply({ embeds: [embed] });
  },
};
