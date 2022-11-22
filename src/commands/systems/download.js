const axios = require('axios');
const {
  AttachmentBuilder,
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  hyperlink,
  inlineCode,
  SlashCommandBuilder,
} = require('discord.js');
const moment = require('moment');
const { Pagination } = require('pagination.djs');

const {
  animeDownloadSiteChoices,
  instagramDownloadTypeChoices,
  tiktokDownloadTypeChoices,
  twitterDownloadTypeChoices,
  youtubeDownloadTypeChoices,
} = require('../../constants');
const {
  generateAttachmentFromBuffer,
  isValidURL,
  truncate,
} = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('📩 Downloader command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('anime')
        .setDescription('📩 Download completed airing anime.')
        .addStringOption((option) =>
          option
            .setName('from')
            .setDescription('🌐 The anime site to download from.')
            .addChoices(...animeDownloadSiteChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('🔤 The anime title search query.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('facebook')
        .setDescription('🌐 Download content from Facebook.')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('🔗 The content url.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('instagram')
        .setDescription('🌐 Download content from Instagram.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🔠 The content type.')
            .addChoices(...instagramDownloadTypeChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription(
              '🔠 The content search query (username for stories, url for others).',
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('spotify')
        .setDescription('🌐 Download music from Spotify.')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('🔗 The content url.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tiktok')
        .setDescription('🌐 Download content from TikTok.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🔠 The content type.')
            .addChoices(...tiktokDownloadTypeChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('🔗 The content url.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('twitter')
        .setDescription('🌐 Download content from Twitter.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🔠 The content type.')
            .addChoices(...twitterDownloadTypeChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('🔗 The content url.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('youtube')
        .setDescription('🌐 Download content from YouTube.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🔠 The content type.')
            .addChoices(...youtubeDownloadTypeChoices)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('🔗 The content url.')
            .setRequired(true),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    const baseURL = 'https://api.lolhuman.xyz/api';

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    switch (options.getSubcommand()) {
      case 'anime':
        {
          const title = options.getString('title', true);
          const from = options.getString('from', true);

          const attachment = new AttachmentBuilder(
            './src/assets/images/otakudesu-logo.png',
            { name: 'otakudesu-logo.png' },
          );

          switch (from) {
            case 'otakudesu': {
              /** @type {{ data: { result: { link_dl: import('../../constants/types').Otakudesu[] } } }} */
              const {
                data: {
                  result: { link_dl: downloads },
                },
              } = await axios
                .get(
                  `${baseURL}/otakudesusearch?query=${title}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(async () => {
                  await interaction.deferReply({ ephemeral: true });

                  throw `No anime found with title ${inlineCode(title)}.`;
                });

              await interaction.deferReply();

              const responses = downloads.map(
                ({ title: t, link_dl }) =>
                  `${bold(t)}\n${link_dl
                    .map(
                      (item) =>
                        `${bold('•')} ${item.reso}: ${Object.entries(
                          item.link_dl,
                        )
                          .slice(0, 3)
                          .map(([name, url]) => hyperlink(name, url))
                          .join(' | ')}`,
                    )
                    .join('\n')}`,
              );

              const pagination = new Pagination(interaction, {
                limit: 1,
                attachments: [attachment],
              })
                .setColor(guild?.members.me?.displayHexColor ?? null)
                .setTimestamp(Date.now())
                .setFooter({
                  text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setAuthor({
                  name: 'Otakudesu Search Results',
                  iconURL: 'attachment://otakudesu-logo.png',
                })
                .setDescriptions(responses);

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

            case 'kusonime': {
              const file = new AttachmentBuilder(
                './src/assets/images/kusonime-logo.png',
                { name: 'kusonime-logo.png' },
              );

              /** @type {{ data: { result: import('../../constants/types').Kusonime } }} */
              const {
                data: {
                  result: { title: t, link_dl },
                },
              } = await axios
                .get(
                  `${baseURL}/kusonimesearch?query=${title}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(async () => {
                  await interaction.deferReply({ ephemeral: true });

                  throw `No anime found with title ${inlineCode(title)}.`;
                });

              await interaction.deferReply();

              const response = `${bold(t)}\n${Object.entries(link_dl)
                .map(
                  ([reso, provider]) =>
                    `${bold('•')} ${reso}: ${Object.entries(provider)
                      .map(([name, url]) => hyperlink(name, url))
                      .join(' | ')}`,
                )
                .join('\n')}`;

              embed
                .setAuthor({
                  name: 'Kusonime Search Results',
                  iconURL: 'attachment://kusonime-logo.png',
                })
                .setDescription(response);

              return interaction.editReply({ embeds: [embed], files: [file] });
            }
          }
        }
        break;

      case 'facebook': {
        const url = options.getString('url', true);

        if (!isValidURL(url, 'facebook')) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: 'Please provide a valid Facebook URL.',
          });
        }

        await interaction.deferReply();

        /** @type {{ data: { result: String } }} */
        const {
          data: { result },
        } = await axios.get(
          `${baseURL}/facebook?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({
            name: 'Facebook Post Downloader Result',
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png',
          })
          .setDescription(`Here's your ${hyperlink('download URL', result)}.`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'instagram':
        {
          const type = options.getString('type', true);
          const query = options.getString('query', true);

          switch (type) {
            case 'instagram': {
              if (!isValidURL(query, 'instagram')) {
                await interaction.deferReply({ ephemeral: true });

                return interaction.editReply({
                  content: 'Please provide a valid Instagram URL.',
                });
              }

              await interaction.deferReply();

              /** @type {{ data: { result: import('../../constants/types').Instagram } }} */
              const {
                data: {
                  result: {
                    account: { full_name, username },
                    caption,
                    media,
                  },
                },
              } = await axios.get(
                `${baseURL}/instagram2?url=${query}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              embed
                .setAuthor({
                  name: 'Instagram Post Downloader Result',
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
                })
                .setFields([
                  {
                    name: '👤 Post Owner',
                    value: `${full_name} (${hyperlink(
                      `@${username}`,
                      `https://insatgram.com/${username}`,
                    )})`,
                    inline: true,
                  },
                  {
                    name: '🗃️ Media',
                    value: media
                      .map(
                        (item) =>
                          `${bold('•')} ${hyperlink(
                            item.includes('.mp4') ? 'Video' : 'Image',
                            item,
                          )}`,
                      )
                      .join('\n'),
                    inline: true,
                  },
                  { name: '💭 Post Caption', value: truncate(caption, 1024) },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'igstory': {
              const username = query.toLowerCase();

              /** @type {{ data: { result: String[] } }} */
              const {
                data: { result },
              } = await axios
                .get(
                  `${baseURL}/igstory/${username}?apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(async () => {
                  await interaction.deferReply({ ephemeral: true });

                  throw `No user found with username ${inlineCode(
                    username,
                  )} or its doesn't have any stories right now.`;
                });

              await interaction.deferReply();

              const URLs = result.map(
                (url, index) =>
                  `${bold('•')} ${hyperlink(`Story ${index + 1}`, url)}`,
              );

              if (result.length > 5) {
                const pagination = new Pagination(interaction)
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setAuthor({
                    name: 'Instagram Story Downloader Result',
                    iconURL:
                      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
                  })
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescriptions(URLs);

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

              embed
                .setAuthor({
                  name: 'Instagram Post Downloader Result',
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
                })
                .setDescription(URLs.join('\n'));

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;

      case 'spotify': {
        const url = options.getString('url', true);

        if (!isValidURL(url, 'spotify')) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: 'Please provide a valid Spotify URL.',
          });
        }

        await interaction.deferReply();

        /** @type {{ data: { result: import('../../constants/types').Spotify } }} */
        const {
          data: {
            result: {
              artists,
              duration,
              external_urls,
              link,
              thumbnail,
              title,
            },
          },
        } = await axios.get(
          `${baseURL}/spotify?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({
            name: 'Spotify Music Downloader Result',
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/256px-Spotify_icon.svg.png',
          })
          .setThumbnail(thumbnail)
          .setFields([
            {
              name: '🔤 Title',
              value: hyperlink(title, external_urls.spotify),
              inline: true,
            },
            { name: '🎤 Artists', value: artists, inline: true },
            {
              name: '⏳ Duration',
              value: `${
                duration >= 60
                  ? `${Math.floor(duration / 60)}m${
                      duration % 60 > 0 ? ` ${duration % 60}s` : ''
                    }`
                  : `${duration}s`
              }`,
              inline: true,
            },
            {
              name: '🔗 Download URL',
              value: hyperlink('Download here', link),
              inline: true,
            },
          ]);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'tiktok':
        {
          const type = options.getString('type', true);
          const url = options.getString('url', true);

          if (!isValidURL(url, 'tiktok')) {
            await interaction.deferReply({ ephemeral: true });

            return interaction.editReply({
              content: 'Please provide a valid TikTok URL.',
            });
          }

          await interaction.deferReply();

          switch (type) {
            case 'audio': {
              /** @type {{ data: ArrayBuffer }} */
              const { data } = await axios.get(
                `${baseURL}/tiktokmusic?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                { responseType: 'arraybuffer' },
              );

              const { attachment } = await generateAttachmentFromBuffer(
                data,
                'download',
                'TikTok audio',
              );

              return interaction.editReply({ files: [attachment] });
            }

            case 'video': {
              /** @type {{ data: ArrayBuffer }} */
              const { data } = await axios.get(
                `${baseURL}/tiktokwm?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                { responseType: 'arraybuffer' },
              );

              const { attachment } = await generateAttachmentFromBuffer(
                data,
                'download',
                'TikTok video',
              );

              return interaction.editReply({ files: [attachment] });
            }

            case 'videoNoWatermark': {
              /** @type {{ data: { result: import('../../constants/types').TikTok } }} */
              const {
                data: {
                  result: {
                    author: { avatar, nickname, username },
                    description,
                    duration,
                    link,
                    title,
                  },
                },
              } = await axios.get(
                `${baseURL}/tiktok?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              embed
                .setAuthor({
                  name: 'TikTok Video Downloader Result',
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/f/ff/TikTok.png',
                })
                .setThumbnail(avatar)
                .setDescription(description || null)
                .setFields([
                  { name: '🔤 Title', value: title, inline: true },
                  {
                    name: '👤 Post Owner',
                    value: `${nickname} (${hyperlink(
                      `@${username}`,
                      `https://tiktok.com/@${username}`,
                    )})`,
                    inline: true,
                  },
                  {
                    name: '⏳ Duration',
                    value: `${
                      duration >= 60
                        ? `${Math.floor(duration / 60)}m${
                            duration % 60 > 0 ? ` ${duration % 60}s` : ''
                          }`
                        : `${duration}s`
                    }`,
                    inline: true,
                  },
                  {
                    name: '🔗 Download URL',
                    value: hyperlink('Download here', link),
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;

      case 'twitter':
        {
          const type = options.getString('type', true);
          const url = options.getString('url', true);

          if (!isValidURL(url, 'twitter')) {
            await interaction.deferReply({ ephemeral: true });

            return interaction.editReply({
              content: 'Please provide a valid Twitter URL.',
            });
          }

          await interaction.deferReply();

          switch (type) {
            case 'image': {
              /** @type {{ data: { result: import('../../constants/types').TwitterImage } }} */
              const {
                data: {
                  result: {
                    link,
                    publish,
                    title,
                    user: { name, photo, username },
                  },
                },
              } = await axios.get(
                `${baseURL}/twitterimage?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              embed
                .setAuthor({
                  name: 'Twitter Image Downloader Result',
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/256px-Twitter-logo.svg.png',
                })
                .setDescription(title)
                .setThumbnail(photo)
                .setFields([
                  {
                    name: '👤 Post Owner',
                    value: `${name} (${hyperlink(
                      `@${username}`,
                      `https://twitter.com/${username}`,
                    )})`,
                    inline: true,
                  },
                  {
                    name: '🗓️ Published At',
                    value: moment(publish).format('DD/MM/YY'),
                    inline: true,
                  },
                  {
                    name: '🔗 Download URL',
                    value: hyperlink('Download here', link),
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'video': {
              /** @type {{ data: { result: import('../../constants/types').TwitterVideo } }} */
              const {
                data: {
                  result: {
                    duration,
                    link,
                    publish,
                    title,
                    user: { name, photo, username },
                  },
                },
              } = await axios.get(
                `${baseURL}/twitter2?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              embed
                .setAuthor({
                  name: 'Twitter Video Downloader Result',
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/256px-Twitter-logo.svg.png',
                })
                .setDescription(title)
                .setThumbnail(photo)
                .setFields([
                  {
                    name: '👤 Post Owner',
                    value: `${name} (${hyperlink(
                      `@${username}`,
                      `https://twitter.com/${username}`,
                    )})`,
                    inline: true,
                  },
                  {
                    name: '⏳ Duration',
                    value: `${
                      duration / 1000 >= 60
                        ? `${Math.floor(duration / 1000 / 60)}m${
                            (duration / 1000) % 60 > 0
                              ? ` ${Math.floor((duration / 1000) % 60)}s`
                              : ''
                          }`
                        : `${Math.floor(duration / 1000)}s`
                    }`,
                    inline: true,
                  },
                  {
                    name: '🗓️ Published At',
                    value: moment(publish).format('DD/MM/YY'),
                    inline: true,
                  },
                  {
                    name: '🔗 Download URL',
                    value: hyperlink('Download here', link[0].url),
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;

      case 'youtube': {
        const type = options.getString('type', true);
        const url = options.getString('url', true);

        if (!isValidURL(url, 'youtube')) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: 'Please provide a valid YouTube URL.',
          });
        }

        await interaction.deferReply();

        switch (type) {
          case 'audio': {
            /** @type {{ data: { result: import('../../constants/types').YouTubeAudio } }} */
            const {
              data: {
                result: { link, size, thumbnail, title },
              },
            } = await axios.get(
              `${baseURL}/ytaudio2?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
            );

            embed
              .setAuthor({
                name: 'YouTube Audio Downloader Result',
                iconURL:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
              })
              .setThumbnail(thumbnail)
              .setFields([
                { name: '🔤 Title', value: title, inline: true },
                { name: '📁 File Size', value: size, inline: true },
                {
                  name: '🔗 Download URL',
                  value: hyperlink('Download here', link),
                  inline: true,
                },
              ]);

            return interaction.editReply({ embeds: [embed] });
          }

          case 'shorts': {
            /** @type {{ data: { result: import('../../constants/types').YouTubeShorts } }} */
            const {
              data: {
                result: { link, size, thumbnail, title },
              },
            } = await axios.get(
              `${baseURL}/ytreels?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
            );

            embed
              .setAuthor({
                name: 'YouTube Shorts Downloader Result',
                iconURL:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
              })
              .setThumbnail(thumbnail)
              .setFields([
                { name: '🔤 Title', value: title, inline: true },
                { name: '📁 File Size', value: size, inline: true },
                {
                  name: '🔗 Download URL',
                  value: hyperlink('Download here', link),
                  inline: true,
                },
              ]);

            return interaction.editReply({ embeds: [embed] });
          }

          case 'video': {
            /** @type {{ data: { result: import('../../constants/types').YouTubeVideo } }} */
            const {
              data: {
                result: {
                  channel,
                  description,
                  dislike,
                  duration,
                  like,
                  link,
                  thumbnail,
                  title,
                  uploader,
                  view,
                },
              },
            } = await axios.get(
              `${baseURL}/ytvideo?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
            );

            embed
              .setAuthor({
                name: 'YouTube Video Downloader Result',
                iconURL:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
              })
              .setDescription(description || null)
              .setThumbnail(thumbnail)
              .setFields([
                { name: '🔤 Title', value: title, inline: true },
                {
                  name: '👤 Uploader',
                  value: hyperlink(uploader, channel),
                  inline: true,
                },
                {
                  name: '📊 Video Stats',
                  value: `Duration: ${duration}\nViews: ${view.toLocaleString()}\nLikes: ${like.toLocaleString()}\nDislikes: ${dislike.toLocaleString()}`,
                  inline: true,
                },
                {
                  name: '📄 File',
                  value: `Size: ${link.size}\nResolution: ${link.resolution}\nType: ${link.type}`,
                  inline: true,
                },
                {
                  name: '🔗 Download URL',
                  value: hyperlink('Download here', link.link),
                  inline: true,
                },
              ]);

            return interaction.editReply({ embeds: [embed] });
          }
        }
      }
    }
  },
};
