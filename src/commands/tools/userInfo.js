const { capitalCase } = require('change-case');
const {
  ActivityType,
  ApplicationCommandType,
  bold,
  ContextMenuCommandBuilder,
  italic,
  time,
  TimestampStyles,
} = require('discord.js');

const { applyActivity, applyPresence, generateEmbed } = require('@/utils');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('User Info')
    .setType(ApplicationCommandType.User),
  type: 'Context Menu',

  /**
   *
   * @param {import('discord.js').ContextMenuCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, targetId } = interaction;

    if (!guild) return;

    await interaction.deferReply();

    const member = await guild.members.fetch(targetId);
    const userRoles = member.roles.icon
      ? `${member.roles.icon} `
      : member.roles.cache
          .filter((role) => role.id !== guild.roles.everyone.id)
          .sort((a, b) => b.position - a.position)
          .map((role) => `${role}`)
          .join(', ') || italic('None');
    const userClientStatus = member.presence?.clientStatus
      ? Object.keys(member.presence.clientStatus)
          .map((status) => capitalCase(status))
          .join(', ')
      : italic('None');
    const userActivity =
      member.presence?.activities
        .map(
          (activity) =>
            `${bold('•')} ${applyActivity(activity.type)} ${bold(
              activity.name,
            )}${
              activity.type === ActivityType.Listening
                ? activity.details
                  ? ` playing ${bold(activity.details)}`
                  : ''
                : activity.details
                ? ` ${activity.details}`
                : ''
            }${
              activity.type === ActivityType.Listening
                ? activity.state
                  ? ` by ${bold(activity.state)}`
                  : ` at ${bold(activity.state)}`
                : activity.state
                ? ` ${activity.state}`
                : ''
            }${
              activity.type === ActivityType.Listening && activity.assets
                ? ` on ${bold(activity.assets.largeText)}`
                : ''
            }${
              activity.type === ActivityType.Streaming && activity.url
                ? ` on ${activity.url}`
                : ''
            }${
              activity.timestamps
                ? ` at ${time(
                    activity.timestamps.start,
                    TimestampStyles.RelativeTime,
                  )}`
                : ''
            }`,
        )
        .join('\n') || italic('None');

    const embed = generateEmbed({ interaction, type: 'member' })
      .setAuthor({
        name: `ℹ️ ${member.user.username}'s ${
          member.user.bot ? 'Bot' : 'User'
        } Information`,
      })
      .setThumbnail(member.displayAvatarURL())
      .setFields([
        { name: '🆔 ID', value: member.user.id, inline: true },
        { name: '🏷️ Tag', value: member.user.tag, inline: true },
        {
          name: '👥 Nickname',
          value: member.nickname ?? member.displayName,
          inline: true,
        },
        {
          name: '📆 Member Since',
          value: time(member.joinedAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '🎊 Account Created',
          value: time(member.user.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: '⭕ Presence Status',
          value: applyPresence(member.presence?.status) ?? '⚫ Offline',
          inline: true,
        },
        {
          name: `🛠️ Roles${
            member.roles.cache.size
              ? ` (${(member.roles.cache.size - 1).toLocaleString()})`
              : ''
          }`,
          value: userRoles,
        },
        {
          name: '🔐 Permissions',
          value: member.permissions
            .toArray()
            .map((permission) => capitalCase(permission))
            .join(', '),
        },
        { name: '🎭 Activity', value: userActivity },
      ]);

    if (!member.user.bot) {
      embed.spliceFields(
        6,
        0,
        {
          name: '🚀 Nitro Status',
          value: member.premiumSince
            ? `Boosting since ${time(
                new Date(member.premiumSinceTimestamp),
                TimestampStyles.RelativeTime,
              )}`
            : 'Not Boosting',
          inline: true,
        },
        { name: '📶 Online Device', value: userClientStatus, inline: true },
      );
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
