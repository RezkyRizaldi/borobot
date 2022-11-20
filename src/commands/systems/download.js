const axios = require('axios');
const {
  AttachmentBuilder,
  bold,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  hyperlink,
  EmbedBuilder,
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
  isValidURL,
  truncate,
  generateAttachmentFromBuffer,
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
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommand()) {
      case 'anime': {
        const title = options.getString('title', true);
        const from = options.getString('from', true);

        return interaction.deferReply().then(async () => {
          const attachment = new AttachmentBuilder(
            './src/assets/images/otakudesu-logo.png',
            {
              name: 'otakudesu-logo.png',
            },
          );

          const pagination = new Pagination(interaction, {
            limit: 1,
            attachments: [attachment],
          });

          pagination.setColor(guild?.members.me?.displayHexColor ?? null);
          pagination.setTimestamp(Date.now());
          pagination.setFooter({
            text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
            }),
          });

          pagination.buttons = {
            ...pagination.buttons,
            extra: new ButtonBuilder()
              .setCustomId('jump')
              .setEmoji('↕️')
              .setDisabled(false)
              .setStyle(ButtonStyle.Secondary),
          };

          switch (from) {
            case 'otakudesu': {
              /** @type {{ data: { result: { link_dl: import('../../constants/types').Otakudesu[] } } }} */
              const {
                data: {
                  result: { link_dl: downloads },
                },
              } = await axios.get(
                `${baseURL}/otakudesusearch?query=${title}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

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

              pagination.setAuthor({
                name: 'Otakudesu Search Results',
                iconURL: 'attachment://otakudesu-logo.png',
              });
              pagination.setDescriptions(responses);

              paginations.set(pagination.interaction.id, pagination);

              return pagination.render();
            }

            case 'kusonime': {
              const file = new AttachmentBuilder(
                './src/assets/images/kusonime-logo.png',
                {
                  name: 'kusonime-logo.png',
                },
              );

              /** @type {{ data: { result: import('../../constants/types').Kusonime } }} */
              const {
                data: {
                  result: { title: t, link_dl },
                },
              } = await axios.get(
                `${baseURL}/kusonimesearch?query=${title}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              const response = `${bold(t)}\n${Object.entries(link_dl)
                .map(
                  ([reso, provider]) =>
                    `${bold('•')} ${reso}: ${Object.entries(provider)
                      .map(([name, url]) => hyperlink(name, url))
                      .join(' | ')}`,
                )
                .join('\n')}`;

              embed.setAuthor({
                name: 'Kusonime Search Results',
                iconURL: 'attachment://kusonime-logo.png',
              });
              embed.setDescription(response);

              await interaction.editReply({ embeds: [embed], files: [file] });
            }
          }
        });
      }

      case 'facebook': {
        const url = options.getString('url', true);

        if (!isValidURL(url, 'facebook')) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid Facebook URL.',
              }),
          );
        }

        return interaction.deferReply().then(
          async () =>
            await axios
              .get(
                `${baseURL}/facebook?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              )
              .then(
                /**
                 *
                 * @param {{ data: { result: String } }}
                 */
                async ({ data: { result } }) => {
                  embed.setAuthor({
                    name: 'Facebook Post Downloader Result',
                    iconURL:
                      'https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png',
                  });
                  embed.setDescription(
                    `Here's your ${hyperlink('download URL', result)}.`,
                  );

                  await interaction.editReply({ embeds: [embed] });
                },
              ),
        );
      }

      case 'instagram': {
        const type = options.getString('type', true);
        const url = options.getString('query', true);

        if (!isValidURL(url, 'instagram')) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid Instagram URL.',
              }),
          );
        }

        return interaction.deferReply().then(async () => {
          switch (type) {
            case 'instagram':
              return axios
                .get(
                  `${baseURL}/instagram2?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').Instagram } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'Instagram Post Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
                    });
                    embed.setFields([
                      {
                        name: '👤 Post Owner',
                        value: `${result.account.full_name} (${hyperlink(
                          `@${result.account.username}`,
                          `https://insatgram.com/${result.account.username}`,
                        )})`,
                        inline: true,
                      },
                      {
                        name: '🗃️ Media',
                        value: result.media
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
                      {
                        name: '💭 Post Caption',
                        value: truncate(result.caption, 1024),
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );

            // TODO: WIP
            case 'igstory':
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: 'Sorry, this feature still in development.',
                  }),
              );
          }
        });
      }

      case 'spotify': {
        const url = options.getString('url', true);

        if (!isValidURL(url, 'spotify')) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid Spotify URL.',
              }),
          );
        }

        return interaction.deferReply().then(
          async () =>
            await axios
              .get(
                `${baseURL}/spotify?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              )
              .then(
                /**
                 *
                 * @param {{ data: { result: import('../../constants/types').Spotify } }}
                 */
                async ({ data: { result } }) => {
                  embed.setAuthor({
                    name: 'Spotify Music Downloader Result',
                    iconURL:
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/256px-Spotify_icon.svg.png',
                  });
                  embed.setThumbnail(result.thumbnail);
                  embed.setFields([
                    {
                      name: '🔤 Title',
                      value: hyperlink(
                        result.title,
                        result.external_urls.spotify,
                      ),
                      inline: true,
                    },
                    {
                      name: '🎤 Artists',
                      value: result.artists,
                      inline: true,
                    },
                    {
                      name: '⏳ Duration',
                      value: `${
                        result.duration >= 60
                          ? `${Math.floor(result.duration / 60)}m${
                              result.duration % 60 > 0
                                ? ` ${result.duration % 60}s`
                                : ''
                            }`
                          : `${result.duration}s`
                      }`,
                      inline: true,
                    },
                    {
                      name: '🔗 Download URL',
                      value: hyperlink('Download here', result.link),
                      inline: true,
                    },
                  ]);

                  await interaction.editReply({ embeds: [embed] });
                },
              ),
        );
      }

      case 'tiktok': {
        const type = options.getString('type', true);
        const url = options.getString('url', true);

        if (!isValidURL(url, 'tiktok')) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid TikTok URL.',
              }),
          );
        }

        return interaction.deferReply().then(async () => {
          switch (type) {
            case 'audio':
              return axios
                .get(
                  `${baseURL}/tiktokmusic?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                  {
                    responseType: 'arraybuffer',
                  },
                )
                .then(
                  /**
                   *
                   * @param {{ data: ArrayBuffer }}
                   */
                  async ({ data }) => {
                    const audio = generateAttachmentFromBuffer(
                      data,
                      'download',
                      'TikTok audio',
                    );

                    await interaction.editReply({ files: [audio] });
                  },
                );

            case 'video':
              return axios
                .get(
                  `${baseURL}/tiktokwm?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                  {
                    responseType: 'arraybuffer',
                  },
                )
                .then(
                  /**
                   *
                   * @param {{ data: ArrayBuffer }}
                   */
                  async ({ data }) => {
                    const video = generateAttachmentFromBuffer(
                      data,
                      'download',
                      'TikTok video',
                    );

                    await interaction.editReply({ files: [video] });
                  },
                );

            case 'videoNoWatermark':
              return axios
                .get(
                  `${baseURL}/tiktok?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').TikTok } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'TikTok Video Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/f/ff/TikTok.png',
                    });
                    embed.setThumbnail(result.author.avatar);
                    embed.setDescription(result.description || null);
                    embed.setFields([
                      {
                        name: '🔤 Title',
                        value: result.title,
                        inline: true,
                      },
                      {
                        name: '👤 Post Owner',
                        value: `${result.author.nickname} (${hyperlink(
                          `@${result.author.username}`,
                          `https://tiktok.com/@${result.author.username}`,
                        )})`,
                        inline: true,
                      },
                      {
                        name: '⏳ Duration',
                        value: `${
                          result.duration >= 60
                            ? `${Math.floor(result.duration / 60)}m${
                                result.duration % 60 > 0
                                  ? ` ${result.duration % 60}s`
                                  : ''
                              }`
                            : `${result.duration}s`
                        }`,
                        inline: true,
                      },
                      {
                        name: '🔗 Download URL',
                        value: hyperlink('Download here', result.link),
                        inline: true,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );
          }
        });
      }

      case 'twitter': {
        const type = options.getString('type', true);
        const url = options.getString('url', true);

        if (!isValidURL(url, 'twitter')) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid Twitter URL.',
              }),
          );
        }

        return interaction.deferReply().then(async () => {
          switch (type) {
            case 'image':
              return axios
                .get(
                  `${baseURL}/twitterimage?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').TwitterImage } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'Twitter Image Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/256px-Twitter-logo.svg.png',
                    });
                    embed.setDescription(result.title);
                    embed.setThumbnail(result.user.photo);
                    embed.setFields([
                      {
                        name: '👤 Post Owner',
                        value: `${result.user.name} (${hyperlink(
                          `@${result.user.username}`,
                          `https://twitter.com/${result.user.username}`,
                        )})`,
                        inline: true,
                      },
                      {
                        name: '🗓️ Published At',
                        value: moment(result.publish).format('DD/MM/YY'),
                        inline: true,
                      },
                      {
                        name: '🔗 Download URL',
                        value: hyperlink('Download here', result.link),
                        inline: true,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );

            case 'video':
              return axios
                .get(
                  `${baseURL}/twitter2?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').TwitterVideo } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'Twitter Video Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/256px-Twitter-logo.svg.png',
                    });
                    embed.setDescription(result.title);
                    embed.setThumbnail(result.user.photo);
                    embed.setFields([
                      {
                        name: '👤 Post Owner',
                        value: `${result.user.name} (${hyperlink(
                          `@${result.user.username}`,
                          `https://twitter.com/${result.user.username}`,
                        )})`,
                        inline: true,
                      },
                      {
                        name: '⏳ Duration',
                        value: `${
                          result.duration / 1000 >= 60
                            ? `${Math.floor(result.duration / 1000 / 60)}m${
                                (result.duration / 1000) % 60 > 0
                                  ? ` ${Math.floor(
                                      (result.duration / 1000) % 60,
                                    )}s`
                                  : ''
                              }`
                            : `${Math.floor(result.duration / 1000)}s`
                        }`,
                        inline: true,
                      },
                      {
                        name: '🗓️ Published At',
                        value: moment(result.publish).format('DD/MM/YY'),
                        inline: true,
                      },
                      {
                        name: '🔗 Download URL',
                        value: hyperlink('Download here', result.link[0].url),
                        inline: true,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );
          }
        });
      }

      case 'youtube': {
        const type = options.getString('type', true);
        const url = options.getString('url', true);

        if (!isValidURL(url, 'youtube')) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid YouTube URL.',
              }),
          );
        }

        return interaction.deferReply().then(async () => {
          switch (type) {
            case 'audio':
              return axios
                .get(
                  `${baseURL}/ytaudio2?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').YouTubeAudio } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'YouTube Audio Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
                    });
                    embed.setThumbnail(result.thumbnail);
                    embed.setFields([
                      {
                        name: '🔤 Title',
                        value: result.title,
                        inline: true,
                      },
                      {
                        name: '📁 File Size',
                        value: result.size,
                        inline: true,
                      },
                      {
                        name: '🔗 Download URL',
                        value: hyperlink('Download here', result.link),
                        inline: true,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );

            case 'shorts':
              return axios
                .get(
                  `${baseURL}/ytreels?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').YouTubeShorts } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'YouTube Shorts Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
                    });
                    embed.setThumbnail(result.thumbnail);
                    embed.setFields([
                      {
                        name: '🔤 Title',
                        value: result.title,
                        inline: true,
                      },
                      {
                        name: '📁 File Size',
                        value: result.size,
                        inline: true,
                      },
                      {
                        name: '🔗 Download URL',
                        value: hyperlink('Download here', result.link),
                        inline: true,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );

            case 'video':
              return axios
                .get(
                  `${baseURL}/ytvideo?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: { result: import('../../constants/types').YouTubeVideo } }}
                   */
                  async ({ data: { result } }) => {
                    embed.setAuthor({
                      name: 'YouTube Video Downloader Result',
                      iconURL:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
                    });
                    embed.setDescription(result.description || null);
                    embed.setThumbnail(result.thumbnail);
                    embed.setFields([
                      {
                        name: '🔤 Title',
                        value: result.title,
                        inline: true,
                      },
                      {
                        name: '👤 Uploader',
                        value: hyperlink(result.uploader, result.channel),
                        inline: true,
                      },
                      {
                        name: '📊 Video Stats',
                        value: `Duration: ${
                          result.duration
                        }\nViews: ${result.view.toLocaleString()}\nLikes: ${result.like.toLocaleString()}\nDislikes: ${result.dislike.toLocaleString()}`,
                        inline: true,
                      },
                      {
                        name: '📄 File',
                        value: `Size: ${result.link.size}\nResolution: ${result.link.resolution}\nType: ${result.link.type}`,
                        inline: true,
                      },
                      {
                        name: '🔗 Download URL',
                        value: hyperlink('Download here', result.link.link),
                        inline: true,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  },
                );
          }
        });
      }
    }
  },
};
