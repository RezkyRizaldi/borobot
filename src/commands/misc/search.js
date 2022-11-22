const axios = require('axios');
const { capitalCase } = require('change-case');
const {
  AttachmentBuilder,
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  hyperlink,
  inlineCode,
  italic,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const Scraper = require('images-scraper').default;
const NewsAPI = require('newsapi');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');

const {
  animeCharacterSearchOrderChoices,
  animeSearchOrderChoices,
  animeSearchStatusChoices,
  animeSearchTypeChoices,
  mangaSearchOrderChoices,
  mangaSearchStatusChoices,
  mangaSearchTypeChoices,
  mdnLocaleChoices,
  newsCountries,
  searchSortingChoices,
} = require('../../constants');
const {
  count,
  isAlphabeticLetter,
  isNumericString,
  truncate,
} = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('🔍 Search command.')
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('anime')
        .setDescription('🖼️ Anime command.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('character')
            .setDescription('👤 Search anime characters from MyAnimeList.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription("🔤 The anime character's name search query."),
            )
            .addStringOption((option) =>
              option
                .setName('order')
                .setDescription("🔤 The anime character's order search query.")
                .addChoices(...animeCharacterSearchOrderChoices),
            )
            .addStringOption((option) =>
              option
                .setName('sort')
                .setDescription("🔣 The anime character's sort search query.")
                .addChoices(...searchSortingChoices),
            )
            .addStringOption((option) =>
              option
                .setName('initial')
                .setDescription(
                  "🔣 The anime character's initial search query.",
                )
                .setMaxLength(1),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('info')
            .setDescription(
              '🖥️ Search the information about an anime from MyAnimeList.',
            )
            .addStringOption((option) =>
              option
                .setName('title')
                .setDescription('🔤 The anime title search query.'),
            )
            .addStringOption((option) =>
              option
                .setName('type')
                .setDescription('🔤 The anime type search query.')
                .addChoices(...animeSearchTypeChoices),
            )
            .addIntegerOption((option) =>
              option
                .setName('score')
                .setDescription('🔤 The anime score search query.')
                .setMinValue(1)
                .setMaxValue(10),
            )
            .addStringOption((option) =>
              option
                .setName('status')
                .setDescription('🔤 The anime status search query.')
                .addChoices(...animeSearchStatusChoices),
            )
            .addStringOption((option) =>
              option
                .setName('order')
                .setDescription('🔤 The anime order search query.')
                .addChoices(...animeSearchOrderChoices),
            )
            .addStringOption((option) =>
              option
                .setName('sort')
                .setDescription('🔣 The anime sort search query.')
                .addChoices(...searchSortingChoices),
            )
            .addStringOption((option) =>
              option
                .setName('initial')
                .setDescription('🔣 The anime initial search query.')
                .setMaxLength(1),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('definition')
        .setDescription(
          '❓ Search the definition of a term from Urban Dictionary.',
        )
        .addStringOption((option) =>
          option
            .setName('term')
            .setDescription("🔠 The definition's term.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('image')
        .setDescription('🖼️ Search any images from Google.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The image search query.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('manga')
        .setDescription('📔 Search manga from MyAnimeList.')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('🔤 The manga title search query.'),
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🔤 The manga type search query.')
            .addChoices(...mangaSearchTypeChoices),
        )
        .addIntegerOption((option) =>
          option
            .setName('score')
            .setDescription('🔤 The manga score search query.')
            .setMinValue(1)
            .setMaxValue(10),
        )
        .addStringOption((option) =>
          option
            .setName('status')
            .setDescription('🔤 The manga status search query.')
            .addChoices(...mangaSearchStatusChoices),
        )
        .addStringOption((option) =>
          option
            .setName('order')
            .setDescription('🔤 The manga order search query.')
            .addChoices(...mangaSearchOrderChoices),
        )
        .addStringOption((option) =>
          option
            .setName('sort')
            .setDescription('🔣 The manga sort search query.')
            .addChoices(...searchSortingChoices),
        )
        .addStringOption((option) =>
          option
            .setName('initial')
            .setDescription('🔣 The manga initial search query.')
            .setMaxLength(1),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('mdn')
        .setDescription(
          '📖 Search the documentation of a term from MDN Web Docs.',
        )
        .addStringOption((option) =>
          option
            .setName('term')
            .setDescription("🔠 The documentation's term.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription("🔠 The documentation's preferred locale.")
            .addChoices(...mdnLocaleChoices),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('news')
        .setDescription('📰 News command.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('country')
            .setDescription(
              '🌏 Search top headline news from provided country.',
            )
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔤 The country name search query.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('🌐 View available news countries.'),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('nhentai')
        .setDescription('📔 Doujin command.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('tag')
            .setDescription('🏷️ Search doujin from NHentai by tag.')
            .addStringOption((option) =>
              option
                .setName('tag')
                .setDescription('🏷️ The doujin tag.')
                .setMinLength(5)
                .setMaxLength(6)
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('query')
            .setDescription('🔤 Search doujin from NHentai by query.')
            .addStringOption((option) =>
              option
                .setName('query')
                .setDescription('🔤 The doujin search query.')
                .setRequired(true),
            ),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, client: import('discord.js').Client<true>, guild: ?import('discord.js').Guild, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { channel, client, guild, options } = interaction;

    if (!guild) return;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    /** @type {{ channels: { cache: import('discord.js').Collection<String, import('discord.js').BaseGuildTextChannel> } */
    const {
      channels: { cache: baseGuildTextChannels },
    } = guild;

    const NSFWChannels = baseGuildTextChannels.filter((ch) => ch.nsfw);
    const NSFWResponse = NSFWChannels.size
      ? `\n${italic('eg.')} ${[...NSFWChannels.values()].join(', ')}`
      : '';

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    switch (options.getSubcommandGroup()) {
      case 'anime':
        switch (options.getSubcommand()) {
          case 'info': {
            const titleQuery = options.getString('title');
            const typeQuery = options.getString('type');
            const scoreQuery = options.getInteger('score');
            const statusQuery = options.getString('status');
            const order = options.getString('order');
            const sort = options.getString('sort');
            const letter = options.getString('initial');

            const query = new URLSearchParams();

            if (!channel.nsfw) {
              query.append('sfw', 'true');
            }

            if (titleQuery) {
              query.append('q', encodeURIComponent(titleQuery));
            }

            if (typeQuery) {
              query.append('type', typeQuery);
            }

            if (scoreQuery) {
              query.append(
                'score',
                Number(`${scoreQuery}`.replace(/,/g, '.')).toFixed(1),
              );
            }

            if (statusQuery) {
              query.append('status', statusQuery);
            }

            if (order) {
              query.append('order_by', order);
            }

            if (sort) {
              query.append('sort', sort);
            }

            if (letter) {
              if (!isAlphabeticLetter(letter)) {
                await interaction.deferReply({ ephemeral: true });

                return interaction.editReply({
                  content: 'You have to specify an alphabetic character.',
                });
              }

              query.append('letter', letter);
            }

            /** @type {{ data: { data: import('../../constants/types').AnimeInfo[] } }} */
            const {
              data: { data },
            } = await axios.get(`https://api.jikan.moe/v4/anime?${query}`);

            if (!data.length) {
              await interaction.deferReply({ ephemeral: true });

              return interaction.editReply({
                content: `No anime found with title ${inlineCode(
                  titleQuery,
                )} or maybe it's contains NSFW stuff. Try to use this command in a NSFW Channel.${NSFWResponse}`,
              });
            }

            await interaction.deferReply();

            const embeds = data.map(
              (
                {
                  aired,
                  demographics,
                  duration,
                  episodes,
                  explicit_genres,
                  favorites,
                  genres,
                  images: { jpg, webp },
                  members,
                  rank,
                  rating,
                  score,
                  scored_by,
                  season,
                  status,
                  studios,
                  synopsis,
                  themes,
                  title,
                  trailer,
                  type,
                  url,
                  year,
                },
                index,
                array,
              ) =>
                new EmbedBuilder()
                  .setColor(guild.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: 'Anime Search Results',
                    iconURL:
                      'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png',
                  })
                  .setThumbnail(jpg.image_url ?? webp.image_url)
                  .setFields([
                    {
                      name: '🔤 Title',
                      value: hyperlink(title, url),
                      inline: true,
                    },
                    {
                      name: '🔠 Type',
                      value: type ?? italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🎬 Episode',
                      value: `${
                        episodes
                          ? count({ total: episodes, data: 'episode' })
                          : '??? episodes'
                      } (${duration})`,
                      inline: true,
                    },
                    {
                      name: '📊 Stats',
                      value:
                        score ||
                        scored_by ||
                        members ||
                        rank ||
                        favorites ||
                        rating
                          ? `${score ? `⭐ ${score}` : ''}${
                              scored_by
                                ? ` (by ${count({
                                    total: scored_by,
                                    data: 'user',
                                  })})`
                                : ''
                            }${
                              members ? ` | 👥 ${members.toLocaleString()}` : ''
                            }${rank ? ` | #️⃣ #${rank}` : ''}${
                              favorites ? ` | ❤️ ${favorites}` : ''
                            }${rating ? ` | 🔞 ${rating}` : ''}`
                          : italic('None'),
                      inline: true,
                    },
                    { name: '⌛ Status', value: status, inline: true },
                    {
                      name: '📆 Aired',
                      value: aired.string ?? italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📆 Premiered',
                      value:
                        season || year
                          ? `${season ? capitalCase(season) : ''} ${year ?? ''}`
                          : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🏢 Studios',
                      value: studios.length
                        ? studios
                            .map((studio) => hyperlink(studio.name, studio.url))
                            .join(', ')
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔠 Genres',
                      value:
                        genres.length ||
                        explicit_genres.length ||
                        themes.length ||
                        demographics.length
                          ? [
                              ...genres,
                              ...explicit_genres,
                              ...themes,
                              ...demographics,
                            ]
                              .map((genre) => hyperlink(genre.name, genre.url))
                              .join(', ')
                          : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '💫 Synopsis',
                      value: synopsis
                        ? synopsis.includes('[Written by MAL Rewrite]')
                          ? truncate(
                              synopsis.replace('[Written by MAL Rewrite]', ''),
                              1024,
                            )
                          : truncate(synopsis, 1024)
                        : italic('No available'),
                    },
                    {
                      name: '🎞️ Trailer',
                      value: trailer.url ?? italic('No available'),
                    },
                  ]),
            );

            const pagination = new Pagination(interaction).setEmbeds(embeds);

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

          case 'character': {
            const name = options.getString('name');
            const order = options.getString('order');
            const sort = options.getString('sort');
            const letter = options.getString('initial');

            const query = new URLSearchParams();

            if (name) {
              query.append('q', encodeURIComponent(name));
            }

            if (order) {
              query.append('order_by', order);
            }

            if (sort) {
              query.append('sort', sort);
            }

            if (letter) {
              if (!isAlphabeticLetter(letter)) {
                await interaction.deferReply({ ephemeral: true });

                return interaction.editReply({
                  content: 'You have to specify an alphabetic character.',
                });
              }

              query.append('letter', letter);
            }

            /** @type {{ data: { data: import('../../constants/types').AnimeCharacter[] } }} */
            const {
              data: { data },
            } = await axios.get(`https://api.jikan.moe/v4/characters?${query}`);

            if (!data.length) {
              await interaction.deferReply({ ephemeral: true });

              return interaction.editReply({
                content: `No anime character found with name ${inlineCode(
                  name,
                )}`,
              });
            }

            await interaction.deferReply();

            const embeds = data.map(
              (
                {
                  about,
                  favorites,
                  images: { jpg, webp },
                  name_kanji,
                  nicknames,
                  url,
                },
                index,
                array,
              ) =>
                new EmbedBuilder()
                  .setColor(guild.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    truncate(about?.replace(/\n\n\n/g, '\n\n'), 4096),
                  )
                  .setAuthor({
                    name: 'Anime Character Search Results',
                    iconURL:
                      'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png',
                  })
                  .setThumbnail(jpg.image_url ?? webp.image_url)
                  .setFields([
                    {
                      name: '🔤 Name',
                      value: hyperlink(`${name} (${name_kanji})`, url),
                      inline: true,
                    },
                    {
                      name: '🔤 Nickname',
                      value: nicknames.length
                        ? nicknames.join(', ')
                        : italic('None'),
                      inline: true,
                    },
                    {
                      name: '❤️ Favorite',
                      value: count({ total: favorites, data: 'favorite' }),
                      inline: true,
                    },
                  ]),
            );

            const pagination = new Pagination(interaction).setEmbeds(embeds);

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
        }
        break;

      case 'news':
        switch (options.getSubcommand()) {
          case 'list': {
            await interaction.deferReply();

            const countries = Object.values(newsCountries);

            const responses = countries.map(
              (country, index) => `${bold(`${index + 1}.`)} ${country}`,
            );

            const pagination = new Pagination(interaction, { limit: 10 })
              .setColor(guild.members.me?.displayHexColor ?? null)
              .setTimestamp(Date.now())
              .setFooter({
                text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setAuthor({
                name: `🌐 News Country Lists (${countries.length.toLocaleString()})`,
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

          case 'country': {
            const name = options.getString('name', true);
            const newsapi = new NewsAPI(process.env.NEWSAPI_API_KEY);
            const country = Object.values(newsCountries).find(
              (c) => c.toLowerCase() === name.toLowerCase(),
            );

            if (!country) {
              await interaction.deferReply({ ephemeral: true });

              return interaction.editReply({
                content: `No country available with name ${inlineCode(name)}.`,
              });
            }

            /** @type {{ articles: import('../../constants/types').News[] }} */
            const { articles } = await newsapi.v2.topHeadlines({
              country: Object.keys(newsCountries).find(
                (key) =>
                  newsCountries[key].toLowerCase() === country.toLowerCase(),
              ),
            });

            if (!articles.length) {
              await interaction.deferReply({ ephemeral: true });

              return interaction.editReply({
                content: `No news found in ${inlineCode(country)}.`,
              });
            }

            await interaction.deferReply();

            const embeds = articles.map(
              (
                {
                  author,
                  content,
                  description,
                  publishedAt,
                  source,
                  title,
                  url,
                  urlToImage,
                },
                index,
                array,
              ) =>
                new EmbedBuilder()
                  .setColor(guild.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  })
                  .setDescription(
                    truncate(
                      content
                        ?.slice(0, content?.indexOf('[+'))
                        ?.replace(/<ul>/gi, '')
                        ?.replace(/<li>/gi, '')
                        ?.replace(/<\/li>/gi, ''),
                      4096,
                    ),
                  )
                  .setThumbnail(urlToImage)
                  .setAuthor({ name: `📰 ${country} News Lists` })
                  .setFields([
                    {
                      name: '🔤 Headline',
                      value: hyperlink(title, url),
                      inline: true,
                    },
                    {
                      name: '🔤 Subheadline',
                      value: description ?? italic('None'),
                      inline: true,
                    },
                    {
                      name: '📆 Published At',
                      value: time(
                        new Date(publishedAt),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: '✒️ Author',
                      value: author ?? italic('Unknown'),
                      inline: true,
                    },
                    { name: '🔢 Source', value: source.name, inline: true },
                  ]),
            );

            const pagination = new Pagination(interaction).setEmbeds(embeds);

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
        }
        break;

      case 'nhentai':
        {
          const baseURL = 'https://api.lolhuman.xyz/api';

          const attachment = new AttachmentBuilder(
            './src/assets/images/nhentai-logo.png',
            { name: 'nhentai-logo.png' },
          );

          if (!channel.nsfw) {
            await interaction.deferReply({ ephemeral: true });

            return interaction.editReply({
              content: `Please use this command in a NSFW Channel.${NSFWResponse}`,
            });
          }

          switch (options.getSubcommand()) {
            case 'tag': {
              const tag = options.getString('tag', true);

              if (!isNumericString(tag)) {
                await interaction.deferReply({ ephemeral: true });

                return interaction.editReply({
                  content: 'Please enter a number.',
                });
              }

              /** @type {{ data: { result: import('../../constants/types').NHentai } }} */
              const {
                data: {
                  result: { image, tags, title_native },
                },
              } = await axios
                .get(
                  `${baseURL}/nhentai/${tag}?apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(async () => {
                  await interaction.deferReply({ ephemeral: true });

                  throw `No doujin found with tag ${inlineCode(tag)}.`;
                });

              await interaction.deferReply();

              embed
                .setAuthor({
                  name: title_native,
                  iconURL: 'attachment://nhentai-logo.png',
                })
                .setFields([{ name: '🏷️ Tags', value: tags.join(', ') }]);

              const imagesEmbed = image.map((url) =>
                new EmbedBuilder()
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setAuthor({
                    name: title_native,
                    iconURL: 'attachment://nhentai-logo.png',
                  })
                  .setImage(url),
              );

              const embeds = [embed, ...imagesEmbed].map((emb, index, array) =>
                emb.setFooter({
                  text: `${client.user.username} | Page ${index + 1} of ${
                    array.length
                  }`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                }),
              );

              const pagination = new Pagination(interaction, {
                attachments: [attachment],
              }).setEmbeds(embeds);

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

            case 'query': {
              const query = options.getString('query', true);

              /** @type {{ data: { result: import('../../constants/types').NHentaiSearch[] } }} */
              const {
                data: { result },
              } = await axios
                .get(
                  `${baseURL}/nhentaisearch?query=${query}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(async () => {
                  await interaction.deferReply({ ephemeral: true });

                  throw `No doujin found with query ${inlineCode(query)}.`;
                });

              await interaction.deferReply();

              const embeds = result.map(
                ({ id, page, title_native }, index, array) =>
                  new EmbedBuilder()
                    .setColor(guild.members.me?.displayHexColor ?? null)
                    .setTimestamp(Date.now())
                    .setFooter({
                      text: `${client.user.username} | Page ${index + 1} of ${
                        array.length
                      }`,
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setAuthor({
                      name: 'Doujin Search Result',
                      iconURL: 'attachment://nhentai-logo.png',
                    })
                    .setFields([
                      {
                        name: '🔤 Title',
                        value: hyperlink(
                          title_native,
                          `https://nhentai.net/g/${id}`,
                        ),
                        inline: true,
                      },
                      {
                        name: '📄 Total Page',
                        value: count({ total: page, data: 'page' }),
                        inline: true,
                      },
                    ]),
              );

              const pagination = new Pagination(interaction, {
                attachments: [attachment],
              }).setEmbeds(embeds);

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
          }
        }
        break;
    }

    switch (options.getSubcommand()) {
      case 'manga': {
        const titleQuery = options.getString('title');
        const typeQuery = options.getString('type');
        const scoreQuery = options.getInteger('score');
        const statusQuery = options.getString('status');
        const order = options.getString('order');
        const sort = options.getString('sort');
        const letter = options.getString('initial');

        const query = new URLSearchParams();

        if (!channel.nsfw) {
          query.append('sfw', 'true');
        }

        if (titleQuery) {
          query.append('q', encodeURIComponent(titleQuery));
        }

        if (typeQuery) {
          query.append('type', typeQuery);
        }

        if (scoreQuery) {
          query.append(
            'score',
            Number(`${scoreQuery}`.replace(/,/g, '.')).toFixed(1),
          );
        }

        if (statusQuery) {
          query.append('status', statusQuery);
        }

        if (order) {
          query.append('order_by', order);
        }

        if (sort) {
          query.append('sort', sort);
        }

        if (letter) {
          if (!isAlphabeticLetter(letter)) {
            await interaction.deferReply({ ephemeral: true });

            return interaction.editReply({
              content: 'You have to specify an alphabetic character.',
            });
          }

          query.append('letter', letter);
        }

        /** @type {{ data: { data: import('../../constants/types').MangaInfo[] } }} */
        const {
          data: { data },
        } = await axios.get(`https://api.jikan.moe/v4/manga?${query}`);

        if (!data.length) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `No manga found with title ${inlineCode(
              titleQuery,
            )} or maybe it's contains NSFW stuff. Try to use this command in a NSFW Channel.${NSFWResponse}`,
          });
        }

        await interaction.deferReply();

        const embeds = data.map(
          (
            {
              authors,
              chapters,
              demographics,
              explicit_genres,
              favorites,
              genres,
              images: { jpg, webp },
              members,
              published,
              rank,
              rating,
              score,
              scored_by,
              serializations,
              status,
              synopsis,
              themes,
              title,
              type,
              url,
              volumes,
            },
            index,
            array,
          ) =>
            new EmbedBuilder()
              .setColor(guild.members.me?.displayHexColor ?? null)
              .setTimestamp(Date.now())
              .setFooter({
                text: `${client.user.username} | Page ${index + 1} of ${
                  array.length
                }`,
                iconURL: client.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .setThumbnail(jpg.image_url ?? webp.image_url)
              .setAuthor({
                name: 'Manga Search Results',
                iconURL:
                  'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png',
              })
              .setFields([
                {
                  name: '🔤 Title',
                  value: hyperlink(title, url),
                  inline: true,
                },
                {
                  name: '🔠 Type',
                  value: type ?? italic('Unknown'),
                  inline: true,
                },
                {
                  name: '📚 Volume & Chapter',
                  value: `${
                    volumes
                      ? count({ total: volumes, data: 'volume' })
                      : '??? volumes'
                  } ${
                    chapters ? count({ total: chapters, data: 'chapter' }) : ''
                  }`,
                  inline: true,
                },
                {
                  name: '📊 Stats',
                  value:
                    score || scored_by || members || rank || favorites || rating
                      ? `${score ? `⭐ ${score}` : ''}${
                          scored_by
                            ? ` (by ${count({
                                total: scored_by,
                                data: 'user',
                              })})`
                            : ''
                        }${members ? ` | 👥 ${members.toLocaleString()}` : ''}${
                          rank ? ` | #️⃣ #${rank}` : ''
                        }${favorites ? ` | ❤️ ${favorites}` : ''}${
                          rating ? ` | 🔞 ${rating}` : ''
                        }`
                      : italic('None'),
                  inline: true,
                },
                {
                  name: '⌛ Status',
                  value: status ?? italic('Unknown'),
                  inline: true,
                },
                {
                  name: '📆 Published',
                  value: published.string ?? italic('Unknown'),
                  inline: true,
                },
                {
                  name: '📝 Authors',
                  value: authors.length
                    ? authors
                        .map((author) => hyperlink(author.name, author.url))
                        .join(', ')
                    : italic('Unknown'),
                  inline: true,
                },
                {
                  name: '📰 Serializations',
                  value: serializations.length
                    ? serializations
                        .map((serialization) =>
                          hyperlink(serialization.name, serialization.url),
                        )
                        .join(', ')
                    : italic('Unknown'),
                  inline: true,
                },
                {
                  name: '🔠 Genres',
                  value:
                    genres.length ||
                    explicit_genres.length ||
                    themes.length ||
                    demographics.length
                      ? [
                          ...genres,
                          ...explicit_genres,
                          ...themes,
                          ...demographics,
                        ]
                          .map((genre) => hyperlink(genre.name, genre.url))
                          .join(', ')
                      : italic('Unknown'),
                  inline: true,
                },
                {
                  name: '💫 Synopsis',
                  value: synopsis
                    ? synopsis.includes('[Written by MAL Rewrite]')
                      ? truncate(
                          synopsis.replace('[Written by MAL Rewrite]', ''),
                          1024,
                        )
                      : truncate(synopsis, 1024)
                    : italic('No available'),
                },
              ]),
        );

        const pagination = new Pagination(interaction).setEmbeds(embeds);

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

      case 'image': {
        await interaction.deferReply();

        await wait(4000);

        const query = options.getString('query', true);

        const google = new Scraper({ puppeteer: { waitForInitialPage: true } });

        const images = await google.scrape(query, 5);

        const pagination = new Pagination(interaction, { limit: 1 })
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setTimestamp(Date.now())
          .setFooter({
            text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({
            name: 'Image Search Results',
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/480px-Google_%22G%22_Logo.svg.png',
          })
          .setImages(images.map((img) => img.url));

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

      case 'definition': {
        const term = options.getString('term', true);
        const query = new URLSearchParams({ term });

        /** @type {{ data: { list: import('../../constants/types').UrbanDictionary[] } }} */
        const {
          data: { list },
        } = await axios.get(
          `https://api.urbandictionary.com/v0/define?${query}`,
        );

        if (!list.length) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `No result found for ${inlineCode(term)}.`,
          });
        }

        await interaction.deferReply();

        const {
          author,
          definition,
          example,
          permalink,
          thumbs_down,
          thumbs_up,
          word,
          written_on,
        } = list[Math.floor(Math.random() * list.length)];

        const formattedCite = `\n${italic(
          `by ${author} — ${time(
            new Date(written_on),
            TimestampStyles.RelativeTime,
          )}`,
        )}`;

        embed
          .setAuthor({
            name: capitalCase(word),
            url: permalink,
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Urban_Dictionary_logo.svg/320px-Urban_Dictionary_logo.svg.png',
          })
          .setFields([
            {
              name: '🔤 Definition',
              value: `${truncate(
                definition,
                1024 - formattedCite.length - 3,
              )}${formattedCite}`,
            },
            { name: '🔤 Example', value: truncate(example, 1024) },
            {
              name: '⭐ Rating',
              value: `${thumbs_up.toLocaleString()} 👍 | ${thumbs_down.toLocaleString()} 👎`,
            },
          ]);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'mdn': {
        const term = options.getString('term', true);
        const language = options.getString('language');
        const query = new URLSearchParams({
          q: term,
          locale: language ?? 'en-US',
        });
        const baseURL = 'https://developer.mozilla.org';

        /** @type {{ data: { documents: import('../../constants/types').MDNDocument[], suggestions: import('../../constants/types').MDNSuggestion[] } }} */
        const {
          data: { documents, suggestions },
        } = await axios.get(`${baseURL}/api/v1/search?${query}`);

        if (!documents.length) {
          if (!suggestions.length) {
            await interaction.deferReply({ ephemeral: true });

            return interaction.editReply({
              content: `No result found for ${inlineCode(term)}.`,
            });
          }

          await interaction.deferReply();

          const newQuery = new URLSearchParams({
            q: suggestions[0].text,
            locale: language ?? 'en-US',
          });

          /** @type {{ data: { documents: import('../../constants/types').MDNDocument[] } }} */
          const {
            data: { documents: docs },
          } = await axios.get(`${baseURL}/api/v1/search?${newQuery}`);

          const fields = docs.map(({ mdn_url, summary, title }) => ({
            name: title,
            value: `${summary}\n${hyperlink(
              'View Documentation',
              `${baseURL}${mdn_url}`,
              'Click here to view the documentation.',
            )}`,
          }));

          embed
            .setAuthor({
              name: 'Documentation Search Results',
              iconURL:
                'https://pbs.twimg.com/profile_images/1511434207079407618/AwzUxnVf_400x400.png',
            })
            .setFields(fields);

          return interaction.editReply({ embeds: [embed] });
        }

        await interaction.deferReply();

        const fields = documents.map(({ mdn_url, summary, title }) => ({
          name: title,
          value: `${summary}\n${hyperlink(
            'View Documentation',
            `${baseURL}${mdn_url}`,
            'Click here to view the documentation.',
          )}`,
        }));

        embed
          .setAuthor({ name: '📖 Documentation Search Results' })
          .setFields(fields);

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
