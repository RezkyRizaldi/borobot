const {
  ChannelType,
  EmbedBuilder,
  hyperlink,
  italic,
  SlashCommandBuilder,
  time,
  TimestampStyles,
  userMention,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const pluralize = require('pluralize');

const {
  applyAFKTimeout,
  applyNSFWLevel,
  applyTier,
  applyVerificationLevel,
} = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('ℹ️ Get info about the server.'),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild } = interaction;

    const categoryChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory,
    ).size;
    const textChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildText,
    ).size;
    const voiceChannelCount = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice,
    ).size;
    const onlineMemberCount = await guild.members
      .fetch({ withPresences: true })
      .then((m) => m.filter((member) => !!member.presence).size);
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

    await interaction
      .deferReply()
      .then(async () => {
        const embed = new EmbedBuilder()
          .setTitle(`ℹ️ ${guild.name} Server Info`)
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setDescription(guild.description ?? italic('No description'))
          .setColor(interaction.guild.members.me.displayHexColor)
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setTimestamp(Date.now())
          .setFields([
            {
              name: '🆔 ID',
              value: guild.id,
              inline: true,
            },
            {
              name: '👑 Owner',
              value: userMention(guild.ownerId),
              inline: true,
            },
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
                guild.memberCount > 0 && ` (${guild.memberCount})`
              }`,
              value: `${pluralize(
                'Online',
                onlineMemberCount,
                true,
              )} | ${pluralize(
                'Booster',
                guild.premiumSubscriptionCount,
                true,
              )}`,
              inline: true,
            },
            {
              name: '😀 Emoji & Sticker',
              value: `${pluralize('Emoji', emojiCount, true)} | ${pluralize(
                'Sticker',
                stickerCount,
                true,
              )}`,
              inline: true,
            },
            {
              name: '🔐 Roles',
              value: pluralize('Role', roleCount, true),
            },
            {
              name: `💬 Channels${
                guild.channels.channelCountWithoutThreads > 0 &&
                ` (${guild.channels.channelCountWithoutThreads})`
              }`,
              value: `${categoryChannelCount} Category | ${textChannelCount} Text | ${voiceChannelCount} Voice\nRules Channel: ${
                guild.rulesChannel ?? italic('None')
              }\nSystem Channel: ${
                guild.systemChannel ?? italic('None')
              }\nPublic Updates Channel: ${
                guild.publicUpdatesChannel ?? italic('None')
              }\nAFK Channel: ${
                `${guild.afkChannel} (${applyAFKTimeout(guild.afkTimeout)})` ??
                italic('None')
              }\nWidget Channel: ${guild.widgetChannel ?? italic('None')}`,
            },
            {
              name: '🔮 Features',
              value: guild.features.length
                ? guild.features.join(', ')
                : italic('None'),
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
              }\nDefault URL:\n${inviteURLs}`,
              inline: true,
            },
            {
              name: '🔠 Misc',
              value: `Partnered: ${guild.partnered ? 'Yes' : 'No'}\nVerified: ${
                guild.verified ? 'Yes' : 'No'
              }`,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      })
      .catch(async (err) => {
        console.error(err);

        await interaction.editReply({ content: err.message });
      })
      .finally(
        async () =>
          await wait(15000).then(async () => await interaction.deleteReply()),
      );
  },
};
