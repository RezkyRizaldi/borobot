const { capitalCase } = require('change-case');
const {
  ChannelType,
  EmbedBuilder,
  hyperlink,
  inlineCode,
  italic,
  SlashCommandBuilder,
  time,
  TimestampStyles,
  userMention,
} = require('discord.js');
const moment = require('moment');
const pluralize = require('pluralize');

const {
  applyDefaultMessageNotifications,
  applyExplicitContentFilter,
  applyMFALevel,
  applyNSFWLevel,
  applyTier,
  applyVerificationLevel,
  count,
  getPreferredLocale,
} = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('ℹ️ Get information about the server.'),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    if (!guild) return;

    await interaction.deferReply();

    const categoryChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory,
    ).size;
    const textChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildText,
    ).size;
    const voiceChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice,
    ).size;
    const stageChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildStageVoice,
    ).size;
    const announcementChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildAnnouncement,
    ).size;
    const forumChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildForum,
    ).size;
    const onlineMemberCount = await guild.members
      .fetch({ withPresences: true })
      .then((m) => m.filter((member) => Boolean(member.presence)).size);
    const boosterCount = guild.premiumSubscriptionCount;
    const emojiCount = guild.emojis.cache.size;
    const roleCount = guild.roles.cache.size;
    const stickerCount = guild.stickers.cache.size;
    const inviteURLs = guild.invites.cache
      .map(
        (invite) =>
          `${hyperlink(
            'URL',
            invite.url,
            'Click here to get the guild invite URL',
          )} (Used ${pluralize('time', invite.uses, true)}, ${
            invite.expiresTimestamp
              ? `expired ${time(
                  new Date(invite.expiresTimestamp),
                  TimestampStyles.RelativeTime,
                )}`
              : 'Permanent'
          })`,
      )
      .join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({ name: `ℹ️ ${guild} Server Information` })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(guild.description ?? italic('No description'))
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setFields([
        { name: '🆔 ID', value: guild.id, inline: true },
        { name: '👑 Owner', value: userMention(guild.ownerId), inline: true },
        {
          name: '🚀 Boost Level',
          value: applyTier(guild.premiumTier),
          inline: true,
        },
        {
          name: '📆 Created At',
          value: time(guild.createdAt, TimestampStyles.RelativeTime),
          inline: true,
        },
        {
          name: `👥 Members${
            guild.memberCount > 0
              ? ` (${guild.memberCount.toLocaleString()}${
                  guild.maximumMembers
                    ? `/${guild.maximumMembers.toLocaleString()}`
                    : ''
                })`
              : ''
          }`,
          value: `${count({ total: onlineMemberCount, data: 'Online' })}${
            boosterCount
              ? ` | ${count({ total: boosterCount, data: 'Booster' })}`
              : ''
          }`,
          inline: true,
        },
        {
          name: '😀 Emoji & Sticker',
          value: `${count({ total: emojiCount, data: 'Emoji' })} | ${count({
            total: stickerCount,
            data: 'Sticker',
          })}`,
          inline: true,
        },
        {
          name: '🛠️ Roles',
          value: count({ total: roleCount, data: 'Role' }),
          inline: true,
        },
        {
          name: '🔒 MFA Level',
          value: applyMFALevel(guild.mfaLevel),
          inline: true,
        },
        {
          name: '☢️ Explicit Content Filter',
          value: applyExplicitContentFilter(guild.explicitContentFilter),
          inline: true,
        },
        {
          name: '⚠️ Verification Level',
          value: applyVerificationLevel(guild.verificationLevel),
          inline: true,
        },
        {
          name: '🔒 NSFW Level',
          value: applyNSFWLevel(guild.nsfwLevel),
          inline: true,
        },
        {
          name: '🖼️ Assets',
          value: `Icon: ${
            guild.icon
              ? hyperlink(
                  'Icon URL',
                  guild.iconURL({ dynamic: true }),
                  'Click here to view the guild icon',
                )
              : italic('None')
          }\nBanner: ${
            guild.banner
              ? hyperlink(
                  'Banner URL',
                  guild.bannerURL({ dynamic: true }),
                  'Click here to view the guild banner',
                )
              : italic('None')
          }\nSplash: ${
            guild.splash
              ? hyperlink(
                  'Splash URL',
                  guild.splashURL({ dynamic: true }),
                  'Click here to view the guild splash',
                )
              : italic('None')
          }\nDiscovery Splash: ${
            guild.discoverySplash
              ? hyperlink(
                  'Discovery Splash URL',
                  guild.discoverySplashURL({ dynamic: true }),
                  'Click here to view the guild discovery splash',
                )
              : italic('None')
          }`,
          inline: true,
        },
        {
          name: '🔗 Invite URL',
          value: `Vanity URL: ${
            guild.vanityURLCode
              ? `${hyperlink(
                  'URL',
                  guild.vanityURLCode,
                  'Click here to get the guild vanity URL',
                )} (Used ${pluralize('time', guild.vanityURLUses, true)})`
              : italic('None')
          }\nDefault URL: ${inviteURLs ? `\n${inviteURLs}` : italic('None')}`,
          inline: true,
        },
        {
          name: '🔔 Default Message Notifications',
          value: applyDefaultMessageNotifications(
            guild.defaultMessageNotifications,
          ),
          inline: true,
        },
        {
          name: '🔠 Misc',
          value: `Partnered: ${guild.partnered ? 'Yes' : 'No'}\nVerified: ${
            guild.verified ? 'Yes' : 'No'
          }\nPrimary Language: ${getPreferredLocale(guild.preferredLocale)}`,
          inline: true,
        },
        {
          name: `💬 Channels${
            guild.channels.channelCountWithoutThreads > 0
              ? ` (${guild.channels.channelCountWithoutThreads.toLocaleString()})`
              : ''
          }`,
          value: `📁 ${categoryChannelCount.toLocaleString()} Category | #️⃣ ${textChannelCount.toLocaleString()} Text | 🔊 ${voiceChannelCount.toLocaleString()} Voice | 🎤 ${stageChannelCount.toLocaleString()} Stage | 📣 ${announcementChannelCount.toLocaleString()} Announcement | 🗯️ ${forumChannelCount.toLocaleString()} Forum\nRules Channel: ${
            guild.rulesChannel ?? italic('None')
          }\nSystem Channel: ${
            guild.systemChannel ?? italic('None')
          }\nPublic Updates Channel: ${
            guild.publicUpdatesChannel ?? italic('None')
          }\nAFK Channel: ${
            guild.afkChannel
              ? `${guild.afkChannel} with ${inlineCode(
                  moment.duration(guild.afkTimeout, 's').humanize(),
                )} inactivity timeout`
              : italic('None')
          }\nWidget Channel: ${guild.widgetChannel ?? italic('None')}`,
        },
        {
          name: '🔮 Features',
          value: guild.features.length
            ? guild.features.map((feature) => capitalCase(feature)).join(', ')
            : italic('None'),
        },
      ]);

    return interaction.editReply({ embeds: [embed] });
  },
};
