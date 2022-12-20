const axios = require('axios').default;
const { capitalCase, snakeCase } = require('change-case');
const {
  AttachmentBuilder,
  bold,
  hyperlink,
  inlineCode,
  italic,
  Locale,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const NewsAPI = require('newsapi');

const {
  animeCharacterSearchOrderChoices,
  animeSearchOrderChoices,
  animeSearchStatusChoices,
  animeSearchTypeChoices,
  mangaSearchOrderChoices,
  mangaSearchStatusChoices,
  mangaSearchTypeChoices,
  newsCountries,
  searchSortingChoices,
} = require('@/constants');
const {
  count,
  generateAttachmentFromBuffer,
  generateEmbed,
  generatePagination,
  isAlphabeticLetter,
  isNumericString,
  truncate,
} = require('@/utils');

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
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('dictionary')
        .setDescription('📖 Dictionary command.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('kbbi')
            .setDescription(
              '❓ Search the definition of a term from Kamus Besar Bahasa Indonesia (KBBI).',
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
            .setName('mdn')
            .setDescription(
              '❓ Search the documentation of a term from MDN Web Docs.',
            )
            .addStringOption((option) =>
              option
                .setName('term')
                .setDescription("🔠 The documentation's term.")
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('urban')
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
            .setName('wiki')
            .setDescription(
              '❓ Search the definition of a term from Wikipedia.',
            )
            .addStringOption((option) =>
              option
                .setName('term')
                .setDescription("🔠 The definition's term.")
                .setRequired(true),
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('doujindesu')
        .setDescription('📔 Doujin command.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('latest')
            .setDescription('🆕 Search latest doujin from Doujindesu.'),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('query')
            .setDescription('🔤 Search doujin from Doujindesu by query.')
            .addStringOption((option) =>
              option
                .setName('query')
                .setDescription('🔤 The doujin search query.')
                .setRequired(true),
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('image')
        .setDescription('🖼️ Image command.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('danbooru')
            .setDescription('🖼️ Search any images from Danbooru.')
            .addStringOption((option) =>
              option
                .setName('query')
                .setDescription('🔠 The image search query.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('google')
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
            .setName('konachan')
            .setDescription('🖼️ Search any images from Konachan.')
            .addStringOption((option) =>
              option
                .setName('query')
                .setDescription('🔠 The image search query.')
                .setRequired(true),
            ),
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

    /** @type {{ channels: { cache: import('discord.js').Collection<String, import('discord.js').BaseGuildTextChannel> } */
    const {
      channels: { cache: baseGuildTextChannels },
    } = guild;

    const NSFWChannels = baseGuildTextChannels.filter((ch) => ch.nsfw);
    const NSFWResponse = NSFWChannels.size
      ? `\n${italic('eg.')} ${[...NSFWChannels.values()].join(', ')}`
      : '';

    const embed = generateEmbed({ interaction });

    await interaction.deferReply();

    if (options.getSubcommandGroup() !== null) {
      return {
        anime: () => {
          const order = options.getString('order');
          const sort = options.getString('sort');
          const letter = options.getString('initial');
          const query = new URLSearchParams();

          if (!channel.nsfw) query.append('sfw', 'true');

          if (order) query.append('order_by', order);

          if (sort) query.append('sort', sort);

          if (letter) {
            if (!isAlphabeticLetter(letter)) {
              throw 'You have to specify an alphabetic character.';
            }

            query.append('letter', letter);
          }

          return {
            info: async () => {
              const titleQuery = options.getString('title');
              const typeQuery = options.getString('type');
              const scoreQuery = options.getInteger('score');
              const statusQuery = options.getString('status');

              if (titleQuery) query.append('q', encodeURIComponent(titleQuery));

              if (typeQuery) query.append('type', typeQuery);

              if (scoreQuery) {
                query.append(
                  'score',
                  Number(`${scoreQuery}`.replace(/,/g, '.')).toFixed(1),
                );
              }

              if (statusQuery) query.append('status', statusQuery);

              /** @type {{ data: { data: import('@/constants/types').AnimeInfo[] } }} */
              const {
                data: { data },
              } = await axios.get(`https://api.jikan.moe/v4/anime?${query}`);

              if (!data.length) {
                throw `No anime found with title ${inlineCode(
                  titleQuery,
                )} or maybe it's contains NSFW stuff. Try to use this command in a NSFW Channel.${NSFWResponse}`;
              }

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
                  i,
                  arr,
                ) =>
                  generateEmbed({ interaction, loop: true, i, arr })
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
                                members
                                  ? ` | 👥 ${members.toLocaleString()}`
                                  : ''
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
                            ? `${season ? capitalCase(season) : ''} ${
                                year ?? ''
                              }`
                            : italic('Unknown'),
                        inline: true,
                      },
                      {
                        name: '🏢 Studios',
                        value: studios.length
                          ? studios
                              .map((studio) =>
                                hyperlink(studio.name, studio.url),
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
                                .map((genre) =>
                                  hyperlink(genre.name, genre.url),
                                )
                                .join(', ')
                            : italic('Unknown'),
                        inline: true,
                      },
                      {
                        name: '💫 Synopsis',
                        value: synopsis
                          ? synopsis.includes('[Written by MAL Rewrite]')
                            ? truncate(
                                synopsis.replace(
                                  '[Written by MAL Rewrite]',
                                  '',
                                ),
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

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
            character: async () => {
              const name = options.getString('name');

              if (name) query.append('q', encodeURIComponent(name));

              /** @type {{ data: { data: import('@/constants/types').AnimeCharacter[] } }} */
              const {
                data: { data },
              } = await axios.get(
                `https://api.jikan.moe/v4/characters?${query}`,
              );

              if (!data.length) {
                throw `No anime character found with name ${inlineCode(name)}`;
              }

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
                  i,
                  arr,
                ) =>
                  generateEmbed({ interaction, loop: true, i, arr })
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

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
          }[options.getSubcommand()]();
        },
        dictionary: () => {
          const term = options.getString('term', true);

          return {
            kbbi: async () => {
              /** @type {{ data: { result: import('@/constants/types').KBBI[] } }} */
              const {
                data: { result },
              } = await axios
                .get(
                  `https://api.lolhuman.xyz/api/kbbi?query=${encodeURIComponent(
                    term,
                  )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(() => {
                  throw `No definition found with term ${inlineCode(term)}.`;
                });

              if (result.length > 1) {
                const embeds = result.map(
                  (
                    {
                      bentuk_tidak_baku,
                      kata_dasar,
                      makna,
                      nama,
                      pelafalan,
                      varian,
                    },
                    i,
                    arr,
                  ) => {
                    const meanings = makna.map(
                      ({ contoh, info, kelas, submakna }, index, array) => ({
                        name: `❓ Meaning${
                          array.length > 1 ? `${index + 1}` : ''
                        }`,
                        value: `${bold('• Part of Speech')}\n${kelas
                          .map(({ nama: partOfSpeech }) => partOfSpeech)
                          .join(', ')}\n\n${bold('• Submeaning')}\n${submakna
                          .map((item) => `- ${item}`)
                          .join('\n')}${
                          info ? `\n\n${bold('• Info')}\n${info}` : ''
                        }\n\n${bold('• Example')}\n${contoh
                          .map((item) => {
                            return item.includes('~')
                              ? `- ${item.replace(
                                  '~',
                                  bold(nama.split('.').join('')),
                                )}`
                              : item.includes('--')
                              ? `- ${item.replace(
                                  '--',
                                  bold(nama.split('.').join('')),
                                )}`
                              : item;
                          })
                          .join('\n')}`,
                      }),
                    );

                    return generateEmbed({ interaction, loop: true, i, arr })
                      .setAuthor({ name: '📖 KBBI Search Result' })
                      .setFields([
                        {
                          name: '🗣️ Spelling',
                          value: nama,
                          inline: true,
                        },
                        {
                          name: '🔤 Root',
                          value: kata_dasar.length
                            ? kata_dasar.join(', ')
                            : italic('None'),
                          inline: true,
                        },
                        {
                          name: '🗣️ Pronunciation',
                          value: pelafalan || italic('Unknown'),
                          inline: true,
                        },
                        {
                          name: '🔤 Nonstandard form',
                          value: bentuk_tidak_baku.length
                            ? bentuk_tidak_baku.join(', ')
                            : italic('None'),
                          inline: true,
                        },
                        {
                          name: '🔤 Variant',
                          value: varian.length
                            ? varian.join(', ')
                            : italic('None'),
                          inline: true,
                        },
                        ...meanings,
                      ]);
                  },
                );

                return await generatePagination({ interaction })
                  .setEmbeds(embeds)
                  .render();
              }

              const meanings = result[0].makna.map(
                ({ contoh, info, kelas, submakna }, index, arr) => ({
                  name: `❓ Meaning${arr.length > 1 ? `${index + 1}` : ''}`,
                  value: `${bold('• Part of Speech')}\n${kelas
                    .map(({ nama }) => nama)
                    .join(', ')}\n\n${bold('• Submeaning')}\n${submakna
                    .map((item) => `- ${item}`)
                    .join('\n')}${
                    info ? `\n\n${bold('• Info')}\n${info}` : ''
                  }\n\n${bold('• Example')}\n${contoh
                    .map((item) => {
                      return item.includes('~')
                        ? `- ${item.replace(
                            '~',
                            bold(result[0].nama.split('.').join('')),
                          )}`
                        : item.includes('--')
                        ? `- ${item.replace(
                            '--',
                            bold(result[0].nama.split('.').join('')),
                          )}`
                        : result[0].nama;
                    })
                    .join('\n')}`,
                }),
              );

              embed.setAuthor({ name: '📖 KBBI Search Result' }).setFields([
                {
                  name: '🗣️ Spelling',
                  value: result[0].nama,
                  inline: true,
                },
                {
                  name: '🔤 Root',
                  value: result[0].kata_dasar.length
                    ? result[0].kata_dasar.join(', ')
                    : italic('None'),
                  inline: true,
                },
                {
                  name: '🗣️ Pronunciation',
                  value: result[0].pelafalan || italic('Unknown'),
                  inline: true,
                },
                {
                  name: '🔤 Nonstandard form',
                  value: result[0].bentuk_tidak_baku.length
                    ? result[0].bentuk_tidak_baku.join(', ')
                    : italic('None'),
                  inline: true,
                },
                {
                  name: '🔤 Variant',
                  value: result[0].varian.length
                    ? result[0].varian.join(', ')
                    : italic('None'),
                  inline: true,
                },
                ...meanings,
              ]);

              await interaction.editReply({ embeds: [embed] });
            },
            urban: async () => {
              const query = new URLSearchParams({ term });

              /** @type {{ data: { list: import('@/constants/types').UrbanDictionary[] } }} */
              const {
                data: { list },
              } = await axios.get(
                `https://api.urbandictionary.com/v0/define?${query}`,
              );

              if (!list.length) {
                throw `No result found for ${inlineCode(term)}.`;
              }

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

              await interaction.editReply({ embeds: [embed] });
            },
            mdn: async () => {
              const query = new URLSearchParams({
                q: term,
                locale:
                  guild.preferredLocale !== Locale.SpanishES
                    ? guild.preferredLocale
                    : 'es',
              });
              const baseURL = 'https://developer.mozilla.org';

              /** @type {{ data: { documents: import('@/constants/types').MDNDocument[], suggestions: import('@/constants/types').MDNSuggestion[] } }} */
              const {
                data: { documents, suggestions },
              } = await axios.get(`${baseURL}/api/v1/search?${query}`);

              if (!documents.length) {
                if (!suggestions.length) {
                  throw `No result found for ${inlineCode(term)}.`;
                }

                const newQuery = new URLSearchParams({
                  q: suggestions[0].text,
                  locale:
                    guild.preferredLocale !== Locale.SpanishES
                      ? guild.preferredLocale
                      : 'es',
                });

                /** @type {{ data: { documents: import('@/constants/types').MDNDocument[] } }} */
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

                return await interaction.editReply({ embeds: [embed] });
              }

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

              await interaction.editReply({ embeds: [embed] });
            },
            wiki: async () => {
              /** @type {{ data: { result: String } }} */
              const {
                data: { result },
              } = await axios
                .get(
                  `https://api.lolhuman.xyz/api/wiki?query=${encodeURIComponent(
                    term,
                  )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(() => {
                  throw `No definition found with term ${inlineCode(term)}.`;
                });

              embed
                .setAuthor({
                  name: capitalCase(term),
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/6/61/Wikipedia-logo-transparent.png',
                })
                .setDescription(truncate(result, 4096));

              await interaction.editReply({ embeds: [embed] });
            },
          }[options.getSubcommand()]();
        },
        doujindesu: () => {
          const baseURL = 'https://api.lolhuman.xyz/api';
          const attachment = new AttachmentBuilder(
            './src/assets/images/doujindesu.png',
            { name: 'doujindesu.png' },
          );

          if (!channel.nsfw) {
            throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
          }

          return {
            latest: async () => {
              /** @type {{ data: { result: import('@/constants/types').DoujindesuLatest[] } }} */
              const {
                data: { result },
              } = await axios.get(
                `${baseURL}/doujindesulatest?apikey=${process.env.LOLHUMAN_API_KEY}`,
                { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
              );

              const embeds = result.map(
                ({ episode, link, thumbnail, title, type }, i, arr) =>
                  generateEmbed({ interaction, loop: true, i, arr })
                    .setAuthor({
                      name: 'Doujin Search Result',
                      iconURL: 'attachment://doujindesu.png',
                    })
                    .setThumbnail(thumbnail)
                    .setFields([
                      {
                        name: '🔤 Title',
                        value: hyperlink(title, link),
                        inline: true,
                      },
                      { name: '📄 Chapter', value: episode, inline: true },
                      { name: '🔣 Type', value: type, inline: true },
                    ]),
              );

              await generatePagination({
                interaction,
                attachments: [attachment],
              })
                .setEmbeds(embeds)
                .render();
            },
            query: async () => {
              const query = options.getString('query', true);

              /** @type {{ data: { result: import('@/constants/types').Doujindesu[] } }} */
              const {
                data: { result },
              } = await axios
                .get(
                  `${baseURL}/doujindesusearch?query=${encodeURIComponent(
                    query,
                  )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(() => {
                  throw `No doujin found with query ${inlineCode(query)}.`;
                });

              const embeds = result.map(
                ({ link, thumbnail, title, type }, i, arr) =>
                  generateEmbed({ interaction, loop: true, i, arr })
                    .setAuthor({
                      name: 'Doujin Search Result',
                      iconURL: 'attachment://doujindesu.png',
                    })
                    .setThumbnail(thumbnail)
                    .setFields([
                      {
                        name: '🔤 Title',
                        value: hyperlink(title, link),
                        inline: true,
                      },
                      { name: '🔣 Type', value: type, inline: true },
                    ]),
              );

              await generatePagination({
                interaction,
                attachments: [attachment],
              })
                .setEmbeds(embeds)
                .render();
            },
          }[options.getSubcommand()]();
        },
        image: () => {
          const query = options.getString('query', true);

          return {
            danbooru: async () => {
              if (!channel) throw "Channel doesn't exist.";

              if (!channel.nsfw) {
                throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
              }

              /** @type {{ data: ArrayBuffer }} */
              const { data: buffer } = await axios
                .get(
                  `https://api.lolhuman.xyz/api/danbooru?query=${snakeCase(
                    query,
                  )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                  { responseType: 'arraybuffer' },
                )
                .catch(() => {
                  throw `No image found with query ${inlineCode(query)}.`;
                });

              const img = await generateAttachmentFromBuffer({
                buffer,
                fileName: snakeCase(query),
                fileDesc: 'Danbooru Image',
              });

              embed
                .setAuthor({
                  name: 'Danbooru Search Result',
                  iconURL: 'https://avatars.githubusercontent.com/u/57931572',
                })
                .setImage(`attachment://${img.name}`);

              await interaction.editReply({ embeds: [embed], files: [img] });
            },
            google: async () => {
              /** @type {{ data: { result: String[] } }} */
              const {
                data: { result },
              } = await axios.get(
                `https://api.lolhuman.xyz/api/gimage2?query=${encodeURIComponent(
                  query,
                )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              await generatePagination({ interaction, limit: 1 })
                .setAuthor({
                  name: 'Google Search Result',
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/480px-Google_%22G%22_Logo.svg.png',
                })
                .setImages(result)
                .render();
            },
            konachan: async () => {
              if (!channel) throw "Channel doesn't exist.";

              if (!channel.nsfw) {
                throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
              }

              /** @type {{ data: ArrayBuffer }} */
              const { data: buffer } = await axios
                .get(
                  `https://api.lolhuman.xyz/api/konachan?query=${snakeCase(
                    query,
                  )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                  { responseType: 'arraybuffer' },
                )
                .catch(() => {
                  throw `No image found with query ${inlineCode(query)}.`;
                });

              const img = await generateAttachmentFromBuffer({
                buffer,
                fileName: snakeCase(query),
                fileDesc: 'Konachan Image',
              });

              embed
                .setAuthor({ name: '🌐 Konachan Search Result' })
                .setImage(`attachment://${img.name}`);

              await interaction.editReply({ embeds: [embed], files: [img] });
            },
          }[options.getSubcommand()]();
        },
        news: () => {
          return {
            list: async () => {
              const countries = Object.values(newsCountries);
              const responses = countries.map(
                (country, i) => `${bold(`${i + 1}.`)} ${country}`,
              );

              await generatePagination({ interaction, limit: 10 })
                .setAuthor({
                  name: `🌐 News Country Lists (${countries.length.toLocaleString()})`,
                })
                .setDescriptions(responses)
                .render();
            },
            country: async () => {
              const name = options.getString('name', true);
              const newsapi = new NewsAPI(process.env.NEWSAPI_API_KEY);
              const country = Object.values(newsCountries).find(
                (c) => c.toLowerCase() === name.toLowerCase(),
              );

              if (!country) {
                throw `No country available with name ${inlineCode(name)}.`;
              }

              /** @type {{ articles: import('@/constants/types').News[] }} */
              const { articles } = await newsapi.v2.topHeadlines({
                country: Object.keys(newsCountries).find(
                  (key) =>
                    newsCountries[key].toLowerCase() === country.toLowerCase(),
                ),
              });

              if (!articles.length) {
                throw `No news found in ${inlineCode(country)}.`;
              }

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
                  i,
                  arr,
                ) =>
                  generateEmbed({ interaction, loop: true, i, arr })
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

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
          }[options.getSubcommand()]();
        },
        nhentai: () => {
          const baseURL = 'https://api.lolhuman.xyz/api';

          const attachment = new AttachmentBuilder(
            './src/assets/images/nhentai-logo.png',
            { name: 'nhentai-logo.png' },
          );

          if (!channel.nsfw) {
            throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
          }

          return {
            tag: async () => {
              const tag = options.getString('tag', true);

              if (!isNumericString(tag)) throw 'Please enter a number.';

              /** @type {{ data: { result: import('@/constants/types').NHentai } }} */
              const {
                data: {
                  result: { image, tags, title_native },
                },
              } = await axios
                .get(
                  `${baseURL}/nhentai/${tag}?apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(() => {
                  throw `No doujin found with tag ${inlineCode(tag)}.`;
                });

              embed
                .setAuthor({
                  name: title_native,
                  iconURL: 'attachment://nhentai-logo.png',
                })
                .setFields([{ name: '🏷️ Tags', value: tags.join(', ') }]);

              const imagesEmbed = image.map((url, i, arr) =>
                generateEmbed({ interaction, loop: true, i, arr })
                  .setAuthor({
                    name: title_native,
                    iconURL: 'attachment://nhentai-logo.png',
                  })
                  .setImage(url),
              );

              const embeds = [embed, ...imagesEmbed].map((emb, i, arr) =>
                emb.setFooter({
                  text: `${client.user.username} | Page ${i + 1} of ${
                    arr.length
                  }`,
                  iconURL: client.user.displayAvatarURL(),
                }),
              );

              await generatePagination({
                interaction,
                attachments: [attachment],
              })
                .setEmbeds(embeds)
                .render();
            },
            query: async () => {
              const query = options.getString('query', true);

              /** @type {{ data: { result: import('@/constants/types').NHentaiSearch[] } }} */
              const {
                data: { result },
              } = await axios
                .get(
                  `${baseURL}/nhentaisearch?query=${query}&apikey=${process.env.LOLHUMAN_API_KEY}`,
                )
                .catch(() => {
                  throw `No doujin found with query ${inlineCode(query)}.`;
                });

              const embeds = result.map(({ id, page, title_native }, i, arr) =>
                generateEmbed({ interaction, loop: true, i, arr })
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

              await generatePagination({
                interaction,
                attachments: [attachment],
              })
                .setEmbeds(embeds)
                .render();
            },
          }[options.getSubcommand()]();
        },
      }[options.getSubcommandGroup()]();
    }

    return {
      manga: async () => {
        const titleQuery = options.getString('title');
        const typeQuery = options.getString('type');
        const scoreQuery = options.getInteger('score');
        const statusQuery = options.getString('status');
        const order = options.getString('order');
        const sort = options.getString('sort');
        const letter = options.getString('initial');
        const query = new URLSearchParams();

        if (!channel.nsfw) query.append('sfw', 'true');

        if (titleQuery) query.append('q', encodeURIComponent(titleQuery));

        if (typeQuery) query.append('type', typeQuery);

        if (scoreQuery) {
          query.append(
            'score',
            Number(`${scoreQuery}`.replace(/,/g, '.')).toFixed(1),
          );
        }

        if (statusQuery) query.append('status', statusQuery);

        if (order) query.append('order_by', order);

        if (sort) query.append('sort', sort);

        if (letter) {
          if (!isAlphabeticLetter(letter)) {
            throw 'You have to specify an alphabetic character.';
          }

          query.append('letter', letter);
        }

        /** @type {{ data: { data: import('@/constants/types').MangaInfo[] } }} */
        const {
          data: { data },
        } = await axios.get(`https://api.jikan.moe/v4/manga?${query}`);

        if (!data.length) {
          throw `No manga found with title ${inlineCode(
            titleQuery,
          )} or maybe it's contains NSFW stuff. Try to use this command in a NSFW Channel.${NSFWResponse}`;
        }

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
            i,
            arr,
          ) =>
            generateEmbed({ interaction, loop: true, i, arr })
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

        await generatePagination({ interaction }).setEmbeds(embeds).render();
      },
    }[options.getSubcommand()]();
  },
};
