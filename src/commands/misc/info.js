const axios = require('axios');
const {
  capitalCase,
  paramCase,
  pascalCase,
  snakeCase,
} = require('change-case');
const {
  bold,
  hyperlink,
  inlineCode,
  italic,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const {
  ChannelType,
  ExtraData,
  HolodexApiClient,
  SortOrder,
  VideoSearchType,
  VideoStatus,
} = require('holodex.js');
const { changeLanguage, t } = require('i18next');
const moment = require('moment');
const minecraftData = require('minecraft-data');
const wait = require('node:timers/promises').setTimeout;
const { stringify } = require('roman-numerals-convert');
const weather = require('weather-js');

const {
  availableLocales,
  extraMcData,
  githubRepoSortingTypeChoices,
  searchSortingChoices,
  vtuberAffiliation,
  vtuberStreamSortingChoices,
  vtuberVideoSortingChoices,
} = require('@/constants');
const {
  applyKeywordColor,
  count,
  generateEmbed,
  generatePagination,
  getFormattedMinecraftName,
  getWikiaURL,
  getFormattedParam,
  transformCase,
  truncate,
} = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('ℹ️ Information command.')
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('covid')
        .setDescription('🦠 Get information about covid-19.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('country')
            .setDescription(
              '🌏 Get covid-19 information from provided country.',
            )
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔤 The country name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('latest')
            .setDescription('📆 Get covid-19 latest information.'),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('🌐 View available covid-19 countries.'),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('genshin')
        .setDescription('🎮 Get information about Genshin Impact.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('artifact')
            .setDescription('🛡️ Get Genshin Impact artifact information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription(
                  '🔠 The Genshin Impact artifact name search query.',
                ),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('character')
            .setDescription('👤 Search Genshin Impact character information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription(
                  '🔠 The Genshin Impact character name search query.',
                ),
            )
            .addBooleanOption((option) =>
              option
                .setName('detailed')
                .setDescription(
                  '📋 Whether to display the information in detail or not.',
                ),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('weapon')
            .setDescription('🗡️ Search Genshin Impact weapon information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription(
                  '🔠 The Genshin Impact weapon name search query.',
                ),
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('github')
        .setDescription('👤 Get information about GitHub account.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('repositories')
            .setDescription('🗄️ Get GitHub user repositories information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The GitHub repository name search query.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('language')
                .setDescription(
                  '🔣 The GitHub repository programming language used by.',
                ),
            )
            .addStringOption((option) =>
              option
                .setName('sort')
                .setDescription('🔣 The Search query sorting type.')
                .addChoices(...githubRepoSortingTypeChoices),
            )
            .addStringOption((option) =>
              option
                .setName('order')
                .setDescription('🔣 The Search query ordering type.')
                .addChoices(...searchSortingChoices),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('user')
            .setDescription('👤 Get GitHub user account information.')
            .addStringOption((option) =>
              option
                .setName('username')
                .setDescription("🔠 The GitHub user's username.")
                .setRequired(true),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('instagram')
        .setDescription('👤 Get information about an Instagram account.')
        .addStringOption((option) =>
          option
            .setName('username')
            .setDescription('🔤 The Instagram username account.')
            .setRequired(true),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('minecraft')
        .setDescription('🟫 Get information about Minecraft.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('biome')
            .setDescription('🌄 Get Minecraft biome information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft biome name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('block')
            .setDescription('🟫 Get Minecraft block information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft block name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('effect')
            .setDescription('💫 Get Minecraft effect information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft effect name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('enchantment')
            .setDescription('🪧 Get Minecraft enchantment information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription(
                  '🔠 The Minecraft enchantment name search query.',
                ),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('entity')
            .setDescription('🔣 Get Minecraft entity information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔣 The Minecraft entity name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('food')
            .setDescription('🍎 Get Minecraft food information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft food name search query.'),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('npm')
        .setDescription('📦 Get information about a NPM package.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('🔤 The NPM package name.')
            .setRequired(true),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('vtuber')
        .setDescription('🧑‍💻 Get information about Virtual YouTuber.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('affiliation')
            .setDescription(
              "🏢 Get the Virtual YouTuber's YouTube channel information by affiliation.",
            )
            .addStringOption((option) =>
              option
                .setName('affiliation')
                .setDescription('🔤 The Virtual Youtuber affiliation name.'),
            )
            .addStringOption((option) =>
              option
                .setName('sort')
                .setDescription('🔣 The information sorting option.')
                .addChoices(...vtuberVideoSortingChoices),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('channel')
            .setDescription(
              "👤 Get the Virtual YouTuber's YouTube channel information by channel ID.",
            )
            .addStringOption((option) =>
              option
                .setName('id')
                .setDescription("🆔 The Virtual Youtuber's YouTube channel ID.")
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('clipper')
            .setDescription(
              "✂️ Get the Virtual YouTuber Clipper's YouTube channel information.",
            )
            .addStringOption((option) =>
              option
                .setName('id')
                .setDescription(
                  "🆔 The Virtual Youtuber's YouTube channel ID.",
                ),
            )
            .addStringOption((option) =>
              option
                .setName('sort')
                .setDescription('🔣 The information sorting option.')
                .addChoices(...vtuberVideoSortingChoices),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('live')
            .setDescription(
              "🎥 Get the Virtual YouTuber's YouTube stream information.",
            )
            .addStringOption((option) =>
              option
                .setName('affiliation')
                .setDescription(
                  "🔤 Get the Virtual Youtuber's information by affiliation name.",
                ),
            )
            .addStringOption((option) =>
              option
                .setName('id')
                .setDescription(
                  "🆔 Get the Virtual Youtuber's information by YouTube channel ID.",
                ),
            )
            .addStringOption((option) =>
              option
                .setName('sort')
                .setDescription('🔣 The information sorting option.')
                .addChoices(...vtuberStreamSortingChoices),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('video')
            .setDescription(
              "🎬 Get the Virtual YouTuber's YouTube video information by channel ID.",
            )
            .addStringOption((option) =>
              option
                .setName('id')
                .setDescription("🆔 The Virtual Youtuber's YouTube channel ID.")
                .setRequired(true),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('weather')
        .setDescription(
          '🌦️ Get information about the weather from provided location.',
        )
        .addStringOption((option) =>
          option
            .setName('location')
            .setDescription('📍 The location search query.')
            .setRequired(true),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, locale, options } = interaction;
    const code = locale.split('-').shift();

    await interaction.deferReply();

    await changeLanguage(locale);

    const embed = generateEmbed({ interaction });

    if (options.getSubcommandGroup() !== null) {
      return {
        covid: () => {
          const baseURL = 'https://covid19.mathdro.id/api';

          return {
            country: async () => {
              const name = options.getString('name');

              if (!name) {
                /** @type {{ data: import('@/constants/types').CovidConfirmed[] }} */
                const { data } = await axios.get(`${baseURL}/confirmed`);

                const embeds = data.map(
                  (
                    {
                      cases28Days,
                      confirmed,
                      countryRegion,
                      deaths,
                      deaths28Days,
                      incidentRate,
                      lastUpdate,
                      provinceState,
                    },
                    i,
                    arr,
                  ) =>
                    generateEmbed({ interaction, loop: true, i, arr })
                      .setThumbnail(
                        `${baseURL}/countries/${encodeURIComponent(
                          countryRegion,
                        )}/og`,
                      )
                      .setAuthor({
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.author.many',
                        ),
                      })
                      .setFields([
                        {
                          name: t(
                            'command.info.subcommandGroup.covid.country.embed.field.country',
                          ),
                          value: countryRegion,
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.covid.country.embed.field.state',
                          ),
                          value:
                            !provinceState || provinceState === 'Unknown'
                              ? italic(t('misc.unknown'))
                              : provinceState,
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.covid.country.embed.field.lastUpdated',
                          ),
                          value: time(
                            new Date(lastUpdate),
                            TimestampStyles.RelativeTime,
                          ),
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.covid.country.embed.field.confirmed',
                          ),
                          value: `${count(confirmed, 'case')}${
                            cases28Days
                              ? ` (${count(cases28Days, 'case')}/month)`
                              : ''
                          }`,
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.covid.country.embed.field.deaths',
                          ),
                          value: `${count(deaths, 'death')}${
                            deaths28Days
                              ? ` (${count(deaths28Days, 'death')}/month)`
                              : ''
                          }`,
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.covid.country.embed.field.incidentRate',
                          ),
                          value: incidentRate
                            ? `${count(Math.floor(incidentRate), 'case')}/day`
                            : italic(t('misc.unknown')),
                          inline: true,
                        },
                      ]),
                );

                return await generatePagination({ interaction })
                  .setEmbeds(embeds)
                  .render();
              }

              /** @type {{ data: { countries: import('@/constants/types').CovidCountry[] } }} */
              const {
                data: { countries },
              } = await axios.get(`${baseURL}/countries`);

              const country = countries.find(
                (item) => item.name.toLowerCase() === name.toLowerCase(),
              )?.name;

              if (!country) {
                throw t('global.error.country', { country: inlineCode(name) });
              }

              /** @type {{ data: import('@/constants/types').CovidConfirmed[] }} */
              const { data } = await axios.get(
                `${baseURL}/countries/${country}/confirmed`,
              );

              if (data.length === 1) {
                await wait(4000);

                embed
                  .setThumbnail(
                    `${baseURL}/countries/${data[0].countryRegion}/og`,
                  )
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.covid.country.embed.author.single',
                      { country: data[0].countryRegion },
                    ),
                  })
                  .setFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.field.state',
                      ),
                      value:
                        !data[0].provinceState ||
                        data[0].provinceState === 'Unknown'
                          ? italic(t('misc.unknown'))
                          : data[0].provinceState,
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.field.lastUpdated',
                      ),
                      value: time(
                        new Date(data[0].lastUpdate),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.field.confirmed',
                      ),
                      value: `${count(data[0].confirmed, 'case')}${
                        data[0].cases28Days
                          ? ` (${count(data[0].cases28Days, 'case')}/month)`
                          : ''
                      }`,
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.field.active',
                      ),
                      value: data[0].active
                        ? `${count(data[0].active, 'case')}`
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.field.deaths',
                      ),
                      value: `${count(data[0].deaths, 'death')}${
                        data[0].deaths28Days
                          ? ` (${count(data[0].deaths28Days, 'death')}/month)`
                          : ''
                      }`,
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.field.incidentRate',
                      ),
                      value: data[0].incidentRate
                        ? `${count(
                            Math.floor(data[0].incidentRate),
                            'case',
                          )}/day`
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                  ]);

                return await interaction.editReply({ embeds: [embed] });
              }

              await wait(4000);

              const embeds = data.map(
                (
                  {
                    active,
                    cases28Days,
                    confirmed,
                    countryRegion,
                    deaths,
                    deaths28Days,
                    incidentRate,
                    lastUpdate,
                    provinceState,
                  },
                  i,
                  arr,
                ) =>
                  generateEmbed({ interaction, loop: true, i, arr })
                    .setThumbnail(`${baseURL}/countries/${countryRegion}/og`)
                    .setAuthor({
                      name: t(
                        'command.info.subcommandGroup.covid.country.embed.author.single',
                        { country: countryRegion },
                      ),
                    })
                    .setFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.field.state',
                        ),
                        value:
                          !provinceState || provinceState === 'Unknown'
                            ? italic(t('misc.unknown'))
                            : provinceState,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.field.lastUpdated',
                        ),
                        value: time(
                          new Date(lastUpdate),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.field.confirmed',
                        ),
                        value: `${count(confirmed, 'case')}${
                          cases28Days
                            ? ` (${count(cases28Days, 'case')}/month)`
                            : ''
                        }`,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.field.active',
                        ),
                        value: active
                          ? `${count(active, 'case')}`
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.field.deaths',
                        ),
                        value: `${count(deaths, 'death')}${
                          deaths28Days
                            ? ` (${count(deaths28Days, 'death')}/month)`
                            : ''
                        }`,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.country.embed.field.incidentRate',
                        ),
                        value: incidentRate
                          ? `${count(Math.floor(incidentRate), 'case')}/day`
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                    ]),
              );

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
            latest: async () => {
              /** @type {{ data: import('@/constants/types').CovidLatest[] }} */
              const { data } = await axios.get(
                `${baseURL}/daily/${moment(Date.now())
                  .subtract(2, 'd')
                  .format('M-DD-YYYY')}`,
              );

              const embeds = data.map(
                (
                  {
                    caseFatalityRatio,
                    confirmed,
                    countryRegion,
                    deaths,
                    lastUpdate,
                    provinceState,
                  },
                  i,
                  arr,
                ) =>
                  generateEmbed({ interaction, loop: true, i, arr })
                    .setThumbnail(`${baseURL}/og`)
                    .setAuthor({
                      name: t(
                        'command.info.subcommandGroup.covid.latest.embed.author',
                      ),
                    })
                    .setFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.latest.embed.field.country',
                        ),
                        value: countryRegion,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.latest.embed.field.state',
                        ),
                        value:
                          !provinceState || provinceState === 'Unknown'
                            ? italic(t('misc.unknown'))
                            : provinceState,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.latest.embed.field.lastUpdated',
                        ),
                        value: time(
                          new Date(lastUpdate),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.latest.embed.field.confirmed',
                        ),
                        value: count(confirmed, 'case'),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.latest.embed.field.deaths',
                        ),
                        value: count(deaths, 'death'),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.covid.latest.embed.field.fatality',
                        ),
                        value: Number(caseFatalityRatio).toFixed(2),
                        inline: true,
                      },
                    ]),
              );

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
            list: async () => {
              /** @type {{ data: { countries: import('@/constants/types').CovidCountry[] } }} */
              const {
                data: { countries },
              } = await axios.get(`${baseURL}/countries`);

              const responses = countries.map(
                ({ name }, i) => `${bold(`${i + 1}.`)} ${name}`,
              );

              await generatePagination({ interaction, limit: 10 })
                .setAuthor({
                  name: t(
                    'command.info.subcommandGroup.covid.list.pagination',
                    { total: count(countries) },
                  ),
                })
                .setDescriptions(responses)
                .render();
            },
          }[options.getSubcommand()]();
        },
        genshin: () => {
          const baseURL = 'https://api.genshin.dev';
          const nameQuery = options.getString('name');
          const lang = !availableLocales.includes(code) ? 'en' : code;

          return {
            artifact: async () => {
              if (!nameQuery) {
                /** @type {{ data: String[] }} */
                const { data } = await axios.get(`${baseURL}/artifacts`, {
                  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
                });

                const responses = data.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${capitalCase(item)}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.author',
                      { total: count(data) },
                    ),
                    iconURL: getWikiaURL({
                      fileName: 'Genshin_Impact',
                      path: 'gensin-impact',
                    }),
                  })
                  .setDescriptions(responses)
                  .render();
              }

              /** @type {{ data: import('@/constants/types').GenshinArtifact }} */
              const {
                data: {
                  '1-piece_bonus': piece1,
                  '2-piece_bonus': piece2,
                  '3-piece_bonus': piece3,
                  '4-piece_bonus': piece4,
                  '5-piece_bonus': piece5,
                  max_rarity,
                  name,
                },
              } = await axios
                .get(
                  `${baseURL}/artifacts/${paramCase(nameQuery)}?lang=${lang}`,
                  { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
                )
                .catch((err) => {
                  if (err.response?.status === 404) {
                    throw t('global.error.artifact', {
                      artifact: inlineCode(nameQuery),
                    });
                  }

                  throw err;
                });

              embed
                .setThumbnail(
                  getWikiaURL({
                    fileName: 'Icon_Inventory_Artifacts',
                    path: 'gensin-impact',
                  }),
                )
                .setAuthor({ name: `🛡️ ${name}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.field.rarity',
                    ),
                    value:
                      max_rarity > 1
                        ? `1-${max_rarity} ⭐`
                        : `${max_rarity} ⭐`,
                  },
                ]);

              if (piece1) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.field.piece1',
                    ),
                    value: piece1,
                  },
                ]);
              }

              if (piece2) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.field.piece2',
                    ),
                    value: piece2,
                  },
                ]);
              }

              if (piece3) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.field.piece3',
                    ),
                    value: piece3,
                  },
                ]);
              }

              if (piece4) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.field.piece4',
                    ),
                    value: piece4,
                  },
                ]);
              }

              if (piece5) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.artifact.embed.field.piece5',
                    ),
                    value: piece5,
                  },
                ]);
              }

              await interaction.editReply({ embeds: [embed] });
            },
            character: async () => {
              const detailed = options.getBoolean('detailed') ?? false;

              if (!nameQuery) {
                /** @type {{ data: String[] }} */
                const { data } = await axios.get(`${baseURL}/characters`, {
                  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
                });

                const responses = data.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${capitalCase(item)}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.author',
                      { total: count(data) },
                    ),
                    iconURL: getWikiaURL({
                      fileName: 'Genshin_Impact',
                      path: 'gensin-impact',
                    }),
                  })
                  .setDescriptions(responses)
                  .render();
              }

              /** @type {{ data: import('@/constants/types').GenshinCharacter }} */
              const {
                data: {
                  affiliation,
                  constellation,
                  constellations,
                  description,
                  name,
                  nation,
                  passiveTalents,
                  rarity,
                  skillTalents,
                  title,
                  vision,
                  weapon,
                  birthday,
                  outfits,
                  specialDish,
                },
              } = await axios
                .get(
                  `${baseURL}/characters/${getFormattedParam(
                    nameQuery,
                  )}?lang=${lang}`,
                  { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
                )
                .catch((err) => {
                  if (err.response?.status === 404) {
                    throw t('global.error.character', {
                      character: inlineCode(nameQuery),
                    });
                  }

                  throw err;
                });

              const formattedName = name !== 'Ayato' ? name : 'Kamisato Ayata';

              embed
                .setDescription(description || null)
                .setThumbnail(
                  getWikiaURL({
                    fileName: `Character_${formattedName}_Thumb`,
                    path: 'gensin-impact',
                  }),
                )
                .setAuthor({ name: `👤 ${formattedName}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.title',
                    ),
                    value: title || italic(t('misc.none')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.vision',
                    ),
                    value: vision,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.weapon',
                    ),
                    value: weapon,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.nation',
                    ),
                    value:
                      nation !== t('misc.unknown')
                        ? nation
                        : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.affiliation',
                    ),
                    value:
                      affiliation !== 'Not affilated to any Nation'
                        ? affiliation
                        : italic('None'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.rarity',
                    ),
                    value: '⭐'.repeat(rarity),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.constellation',
                    ),
                    value: constellation,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.birthday',
                    ),
                    value: birthday
                      ? moment(birthday).locale(lang).format('MMMM Do')
                      : italic('Unknown'),
                    inline: true,
                  },
                ]);

              if (specialDish) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.character.embed.field.dish',
                    ),
                    value: specialDish,
                    inline: true,
                  },
                ]);
              }

              if (!detailed) {
                return await interaction.editReply({ embeds: [embed] });
              }

              const activeTalentEmbed = generateEmbed({ interaction })
                .setDescription(
                  `${bold(
                    t(
                      'command.info.subcommandGroup.genshin.character.embed.field.skillTalents',
                    ),
                  )}\n${skillTalents
                    .map(
                      ({
                        description: skillDesc,
                        name: skillName,
                        unlock,
                        upgrades,
                      }) =>
                        `${
                          skillName
                            ? `${bold(`• ${skillName}`)} (${unlock})`
                            : `${bold(`• ${unlock}`)}`
                        }${
                          skillDesc
                            ? `\n${skillDesc
                                .replace(/\n\n/g, '\n')
                                .replace(/\n$/, '')}`
                            : ''
                        }${
                          upgrades
                            ? `\n${bold(
                                t(
                                  'command.info.subcommandGroup.genshin.character.embed.field.attributes',
                                ),
                              )}\n${upgrades
                                .map(
                                  ({ name: upName, value }) =>
                                    `${upName}: ${value}`,
                                )
                                .join('\n')}`
                            : ''
                        }`,
                    )
                    .join('\n\n')}`,
                )
                .setThumbnail(
                  getWikiaURL({
                    fileName: `Character_${formattedName}_Thumb`,
                    path: 'gensin-impact',
                  }),
                )
                .setAuthor({ name: `👤 ${formattedName}` });

              const passiveTalentEmbed = generateEmbed({ interaction })
                .setDescription(
                  `${bold(
                    t(
                      'command.info.subcommandGroup.genshin.character.embed.field.passiveTalents',
                    ),
                  )}\n${passiveTalents
                    .map(
                      ({ description: skillDesc, name: skillName, unlock }) =>
                        `${bold(
                          `• ${skillName}`,
                        )} (${unlock})\n${skillDesc.replace(/\n\n/g, '\n')}`,
                    )
                    .join('\n\n')}`,
                )
                .setThumbnail(
                  getWikiaURL({
                    fileName: `Character_${formattedName}_Thumb`,
                    path: 'gensin-impact',
                  }),
                )
                .setAuthor({ name: `👤 ${formattedName}` });

              const constellationEmbed = generateEmbed({ interaction })
                .setDescription(
                  `${bold(
                    t(
                      'command.info.subcommandGroup.genshin.character.embed.field.constellations',
                    ),
                  )}\n${constellations
                    .map(
                      ({ description: skillDesc, name: skillName, unlock }) =>
                        `${bold(
                          `• ${skillName}`,
                        )} (${unlock})\n${skillDesc.replace(/\n\n/g, '\n')}`,
                    )
                    .join('\n\n')}`,
                )
                .setThumbnail(
                  getWikiaURL({
                    fileName: `Character_${formattedName}_Thumb`,
                    path: 'gensin-impact',
                  }),
                )
                .setAuthor({ name: `👤 ${formattedName}` });

              let embeds = [
                embed,
                activeTalentEmbed,
                passiveTalentEmbed,
                constellationEmbed,
              ];

              if (outfits) {
                const outfitEmbed = outfits.map(
                  ({
                    description: outfitDesc,
                    name: outfitName,
                    price,
                    rarity: outfitRarity,
                    type,
                  }) =>
                    generateEmbed({ interaction })
                      .setDescription(
                        `${bold(
                          t(
                            'command.info.subcommandGroup.genshin.character.embed.field.outfits',
                          ),
                        )}\n${outfitDesc}`,
                      )
                      .setThumbnail(
                        getWikiaURL({
                          fileName: `Character_${formattedName}_Thumb`,
                          path: 'gensin-impact',
                        }),
                      )
                      .setImage(
                        getWikiaURL({
                          fileName: `Outfit_${outfitName}_Thumb`,
                          path: 'gensin-impact',
                        }),
                      )
                      .setAuthor({ name: `👤 ${formattedName}` })
                      .setFields([
                        {
                          name: t(
                            'command.info.subcommandGroup.genshin.character.embed.field.type',
                          ),
                          value: type,
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.genshin.character.embed.field.rarity',
                          ),
                          value: '⭐'.repeat(outfitRarity),
                          inline: true,
                        },
                        {
                          name: t(
                            'command.info.subcommandGroup.genshin.character.embed.field.price',
                          ),
                          value: `${price} 💎`,
                          inline: true,
                        },
                      ]),
                );

                embeds.push(...outfitEmbed);
              }

              embeds = embeds.map((emb, i, arr) =>
                emb.setFooter({
                  text: t('global.embed.footer', {
                    botUsername: client.user.username,
                    pageNumber: i + 1,
                    totalPages: arr.length,
                  }),
                  iconURL: client.user.displayAvatarURL(),
                }),
              );

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
            weapon: async () => {
              if (!nameQuery) {
                /** @type {{ data: String[] }} */
                const { data } = await axios.get(`${baseURL}/weapons`, {
                  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
                });

                const responses = data.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${capitalCase(item)}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.author',
                      { total: count(data) },
                    ),
                    iconURL: getWikiaURL({
                      fileName: 'Genshin_Impact',
                      path: 'gensin-impact',
                    }),
                  })
                  .setDescriptions(responses)
                  .render();
              }

              /** @type {{ data: import('@/constants/types').GenshinWeapon }} */
              const {
                data: {
                  baseAttack,
                  name,
                  location,
                  passiveName,
                  rarity,
                  subStat,
                  type,
                  passiveDesc,
                },
              } = await axios
                .get(
                  `${baseURL}/weapons/${paramCase(nameQuery)}?lang=${lang}`,
                  { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
                )
                .catch((err) => {
                  if (err.response?.status === 404) {
                    throw t('global.error.weapon', {
                      weapon: inlineCode(nameQuery),
                    });
                  }

                  throw err;
                });

              embed
                .setThumbnail(
                  getWikiaURL({
                    fileName: `Weapon_${name}`,
                    path: 'gensin-impact',
                  }),
                )
                .setAuthor({ name: `🗡️ ${name}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.field.type',
                    ),
                    value: type,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.field.rarity',
                    ),
                    value: '⭐'.repeat(rarity),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.field.baseAtk',
                    ),
                    value: `${baseAttack}`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.field.substat',
                    ),
                    value:
                      subStat !== '-' ? subStat : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.field.obtaining',
                    ),
                    value: location,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.genshin.weapon.embed.field.passive',
                    ),
                    value:
                      passiveName !== '-'
                        ? `${bold(passiveName)}${
                            passiveDesc || passiveDesc !== '-'
                              ? ` - ${passiveDesc}`
                              : ''
                          }`
                        : italic(t('misc.none')),
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
          }[options.getSubcommand()]();
        },
        github: () => {
          return {
            user: async () => {
              const username = options.getString('username', true);

              /** @type {{ data: import('@/constants/types').GithubUser }} */
              const {
                data: {
                  avatar_url,
                  bio,
                  blog,
                  company,
                  created_at,
                  followers,
                  following,
                  html_url,
                  location,
                  login,
                  name,
                  public_gists,
                  public_repos,
                  twitter_username,
                  type,
                },
              } = await axios
                .get(`https://api.github.com/users/${username}`)
                .catch((err) => {
                  if (err.response?.status === 404) {
                    throw t('global.error.githubUser', {
                      username: inlineCode(username),
                    });
                  }

                  throw err;
                });

              embed
                .setAuthor({
                  name: t(
                    'command.info.subcommandGroup.github.user.embed.author',
                    { login },
                  ),
                  url: html_url,
                  iconURL:
                    'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                })
                .setDescription(bio)
                .setThumbnail(avatar_url)
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.name',
                    ),
                    value: name ?? italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.created',
                    ),
                    value: time(
                      new Date(created_at),
                      TimestampStyles.RelativeTime,
                    ),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.stats',
                    ),
                    value: `${count(followers, 'follower')} | ${count(
                      following,
                      'following',
                    )} | ${count(public_repos, 'public repository')} | ${count(
                      public_gists,
                      'public gist',
                    )}`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.type',
                    ),
                    value: type,
                    inline: true,
                  },
                ]);

              if (company) {
                embed.spliceFields(2, 0, {
                  name: t(
                    'command.info.subcommandGroup.github.user.embed.field.company',
                  ),
                  value: company,
                  inline: true,
                });
              }

              if (blog) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.website',
                    ),
                    value: blog,
                    inline: true,
                  },
                ]);
              }

              if (twitter_username) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.twitter',
                    ),
                    value: hyperlink(
                      `@${twitter_username}`,
                      `https://twitter.com/${twitter_username}`,
                    ),
                    inline: true,
                  },
                ]);
              }

              if (location) {
                embed.addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.github.user.embed.field.address',
                    ),
                    value: location,
                  },
                ]);
              }

              await interaction.editReply({ embeds: [embed] });
            },
            repositories: async () => {
              const name = options.getString('name', true);
              const language = options.getString('language');
              const sort = options.getString('sort');
              const order = options.getString('order');
              const query = new URLSearchParams({
                q: `${name}${language ? `+language:${language}` : ''}`,
              });

              if (sort) query.append('sort', sort);

              if (order) query.append('order', order);

              /** @type {{ data: { items: import('@/constants/types').GithubRepository[] } }} */
              const {
                data: { items },
              } = await axios.get(
                `https://api.github.com/search/repositories?${query}`,
              );

              if (!items.length) {
                throw t('global.error.githubRepo', { repo: inlineCode(name) });
              }

              const embeds = items.map(
                (
                  {
                    created_at,
                    description,
                    forks_count,
                    homepage,
                    html_url,
                    license,
                    open_issues_count,
                    owner,
                    pushed_at,
                    stargazers_count,
                    topics,
                    watchers_count,
                  },
                  i,
                  arr,
                ) => {
                  const newEmbed = generateEmbed({
                    interaction,
                    loop: true,
                    i,
                    arr,
                  })
                    .setDescription(description)
                    .setThumbnail(owner.avatar_url)
                    .setAuthor({
                      name: t(
                        'command.info.subcommandGroup.github.repository.embed.author',
                      ),
                      iconURL:
                        'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                    })
                    .setFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.name',
                        ),
                        value: hyperlink(
                          name,
                          html_url,
                          'Click here to view the repository.',
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.owner',
                        ),
                        value: `${hyperlink(
                          `@${owner.login}`,
                          owner.html_url,
                          'Click here to view the account.',
                        )} (${owner.type})`,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.created',
                        ),
                        value: time(
                          new Date(created_at),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.updated',
                        ),
                        value: time(
                          new Date(pushed_at),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.language',
                        ),
                        value: language ?? italic(t('misc.unknown')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.license',
                        ),
                        value: license?.name ?? italic(t('misc.none')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.stats',
                        ),
                        value: `⭐ ${count(
                          stargazers_count,
                          'star',
                        )} | 👁️ ${count(
                          watchers_count,
                          'watcher',
                        )} | 🕎 ${count(forks_count, 'fork')} | 🪲 ${count(
                          open_issues_count,
                          'issue',
                        )}`,
                      },
                    ]);

                  if (homepage) {
                    newEmbed.spliceFields(6, 0, {
                      name: t(
                        'command.info.subcommandGroup.github.repository.embed.field.docs',
                      ),
                      value: homepage,
                      inline: true,
                    });
                  }

                  if (topics.length) {
                    newEmbed.addFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.github.repository.embed.field.topics',
                        ),
                        value: topics.join(', '),
                      },
                    ]);
                  }

                  return newEmbed;
                },
              );

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
          }[options.getSubcommand()]();
        },
        minecraft: () => {
          const name = options.getString('name');
          const mcData = minecraftData('1.19');
          const minecraftLogo =
            'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png';
          const minecraftEdition = `${t('misc.minecraft', {
            type: mcData.version.type === 'pc' ? 'Java' : 'Bedrock',
          })}${
            mcData.version.minecraftVersion
              ? ` v${mcData.version.minecraftVersion}`
              : ''
          }`;

          return {
            biome: async () => {
              if (!name) {
                const responses = mcData.biomesArray.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${item.displayName}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.pagination',
                      {
                        edition: minecraftEdition,
                        total: count(mcData.biomesArray),
                      },
                    ),
                    iconURL: minecraftLogo,
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const biome = {
                ...mcData.biomesByName[snakeCase(name)],
                ...extraMcData.biome[snakeCase(name)],
              };

              if (!Object.keys(biome).length) {
                throw t('global.error.minecraftBiome', {
                  biome: inlineCode(name),
                });
              }

              embed
                .setDescription(biome.description)
                .setThumbnail(
                  getWikiaURL({
                    fileName: `${biome?.altName ?? biome.displayName}${
                      biome.version ? ` ${biome.version}` : ''
                    }`,
                    path: 'minecraft_gamepedia',
                  }),
                )
                .setAuthor({ name: `🌄 ${biome.displayName}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.embed.temperature',
                    ),
                    value: `${biome.temperature}°`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.embed.dimension',
                    ),
                    value: capitalCase(biome.dimension),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.embed.rainfall',
                    ),
                    value: `${biome.rainfall}`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.embed.structures',
                    ),
                    value: biome.structures
                      ? biome.structures
                          .map((structure) => capitalCase(structure))
                          .join(', ')
                      : italic(t('misc.none')),
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.embed.blocks',
                    ),
                    value: biome.blocks
                      ? biome.blocks
                          .map((block) => capitalCase(block))
                          .join(', ')
                      : italic(t('misc.none')),
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.biome.embed.colors',
                    ),
                    value: biome.colors
                      ? Object.entries(biome.colors)
                          .map(
                            ([key, value]) =>
                              `${capitalCase(key)}: ${applyKeywordColor(
                                value,
                              )}`,
                          )
                          .join('\n')
                      : italic(t('misc.unknown')),
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
            block: async () => {
              if (!name) {
                const filteredMcData = mcData.blocksArray.filter(
                  (item, i, arr) =>
                    arr.findIndex(
                      (duplicate) => duplicate.displayName === item.displayName,
                    ) === i,
                );

                const responses = filteredMcData.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${item.displayName}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.pagination',
                      {
                        edition: minecraftEdition,
                        total: count(filteredMcData),
                      },
                    ),
                    iconURL: minecraftLogo,
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const block = {
                ...mcData.blocksByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.block[
                  getFormattedMinecraftName(snakeCase(name))
                ],
              };

              if (!Object.keys(block).length) {
                throw t('global.error.minecraftBlock', {
                  block: inlineCode(name),
                });
              }

              embed
                .setDescription(block?.description ?? null)
                .setThumbnail(
                  getWikiaURL({
                    fileName: `${block?.altName ?? block.displayName}${
                      block.positions?.length
                        ? block.positions.map((pos) => ` (${pos})`).join('')
                        : ''
                    }${block.version ? ` ${block.version}` : ''}`,
                    path: 'minecraft_gamepedia',
                    animated: block?.animated ?? false,
                  }),
                )
                .setAuthor({ name: `🟫 ${block.displayName}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.tool',
                    ),
                    value:
                      block.material && block.material !== 'default'
                        ? capitalCase(
                            block.material.slice(
                              block.material.indexOf('/'),
                              block.material.length,
                            ),
                          )
                        : italic(t('misc.none')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.hardness',
                    ),
                    value: block.hardness
                      ? `${block.hardness}`
                      : italic(t('misc.none')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.resistance',
                    ),
                    value: block.resistance
                      ? `${block.resistance}`
                      : italic(t('misc.none')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.stackable',
                    ),
                    value:
                      block.stackSize > 0
                        ? `${t('misc.yes')} (${count(block.stackSize)})`
                        : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.transparent',
                    ),
                    value: block.transparent ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.luminant',
                    ),
                    value: block.luminant ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.flammable',
                    ),
                    value: block.flammable ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.block.embed.renewable',
                    ),
                    value: block.renewable ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
            effect: async () => {
              if (!name) {
                const responses = mcData.effectsArray.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${item.displayName}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.minecraft.effect.pagination',
                      {
                        edition: minecraftEdition,
                        total: count(mcData.effectsArray),
                      },
                    ),
                    iconURL: minecraftLogo,
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const effect = {
                ...mcData.effectsByName[pascalCase(name)],
                ...extraMcData.effect[pascalCase(name)],
              };

              if (!Object.keys(effect).length) {
                throw t('global.error.minecraftEffect', {
                  effect: inlineCode(name),
                });
              }

              embed
                .setDescription(effect.description)
                .setThumbnail(
                  getWikiaURL({
                    fileName: `${effect?.altName ?? effect.displayName}${
                      effect.positions?.length
                        ? effect.positions.map((pos) => ` (${pos})`).join('')
                        : ''
                    }${effect.version ? ` ${effect.version}` : ''}`,
                    path: 'minecraft_gamepedia',
                  }),
                )
                .setAuthor({ name: `💫 ${effect.displayName}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.effect.embed.particle',
                    ),
                    value: effect.particle
                      ? applyKeywordColor(effect.particle)
                      : italic(t('misc.none')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.effect.embed.type',
                    ),
                    value:
                      effect.type === 'good'
                        ? t('misc.positive')
                        : t('misc.negative'),
                    inline: true,
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
            enchantment: async () => {
              if (!name) {
                const responses = mcData.enchantmentsArray.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${item.displayName}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.pagination',
                      {
                        edition: minecraftEdition,
                        total: count(mcData.enchantmentsArray),
                      },
                    ),
                    iconURL: minecraftLogo,
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const enchantment = {
                ...mcData.enchantmentsByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.enchantment[
                  getFormattedMinecraftName(snakeCase(name))
                ],
              };

              if (!Object.keys(enchantment).length) {
                throw t('global.error.minecraftEnchantment', {
                  enchantment: inlineCode(name),
                });
              }

              embed
                .setDescription(enchantment.description)
                .setAuthor({ name: `🪧 ${enchantment.displayName}` })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.level',
                    ),
                    value: stringify(enchantment.maxLevel),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.treasure',
                    ),
                    value: enchantment.treasureOnly
                      ? t('misc.yes')
                      : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.curse',
                    ),
                    value: enchantment.curse ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.discoverable',
                    ),
                    value: enchantment.discoverable
                      ? t('misc.yes')
                      : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.tradeable',
                    ),
                    value: enchantment.tradeable ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.weight',
                    ),
                    value: `${enchantment.weight}`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.enchantment.embed.incompatible',
                    ),
                    value: enchantment.exclude.length
                      ? enchantment.exclude
                          .map((exc) => capitalCase(exc))
                          .join(', ')
                      : italic(t('misc.none')),
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
            entity: async () => {
              if (!name) {
                const responses = mcData.entitiesArray.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${item.displayName}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.minecraft.entity.pagination',
                      {
                        edition: minecraftEdition,
                        total: count(mcData.entitiesArray),
                      },
                    ),
                    iconURL: minecraftLogo,
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const entity = {
                ...mcData.entitiesByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.entity[
                  getFormattedMinecraftName(snakeCase(name))
                ],
              };

              if (!Object.keys(entity).length) {
                throw t('global.error.minecraftEntity', {
                  entity: inlineCode(name),
                });
              }

              embed
                .setDescription(entity.description)
                .setThumbnail(
                  getWikiaURL({
                    fileName: `${entity?.altName ?? entity.displayName}${
                      entity.positions?.length
                        ? entity.positions.map((pos) => ` (${pos})`).join('')
                        : ''
                    }${entity.version ? ` ${entity.version}` : ''}`,
                    path: 'minecraft_gamepedia',
                    animated: entity?.animated ?? false,
                  }),
                )
                .setAuthor({ name: `🔣 ${entity.displayName}` });

              switch (entity.type) {
                case 'mob':
                case 'ambient':
                case 'animal':
                case 'hostile':
                case 'water_creature':
                  embed.setFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.minecraft.entity.embed.hp',
                      ),
                      value: `${entity.hp} (❤️x${entity.hp / 2})`,
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.minecraft.entity.embed.spawn',
                      ),
                      value: entity.spawns
                        ? entity.spawns
                            .map((spawn) => {
                              return !/^[A-Z|\d+]/.test(spawn)
                                ? capitalCase(spawn)
                                : spawn;
                            })
                            .join(', ')
                        : italic(t('misc.unknown')),
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.minecraft.entity.embed.items',
                      ),
                      value: entity.usableItems
                        ? entity.usableItems
                            .map((item) =>
                              capitalCase(item).replace(
                                /\b(a|the|an|and|or|but|in|on|of|it)\b/gi,
                                (word) => word.toLowerCase(),
                              ),
                            )
                            .join(', ')
                        : italic(t('misc.none')),
                    },
                  ]);
                  break;

                case 'living':
                case 'projectile':
                case 'other':
                  if (entity.hp) {
                    embed.addFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.minecraft.entity.embed.hp',
                        ),
                        value: `${entity.hp} (❤️x${entity.hp / 2})`,
                        inline: true,
                      },
                    ]);
                  }

                  if (entity.stackSize) {
                    embed.addFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.minecraft.entity.embed.stackable',
                        ),
                        value:
                          entity.stackSize > 0
                            ? `${t('misc.yes')} (${entity.stackSize})`
                            : t('misc.no'),
                        inline: true,
                      },
                    ]);
                  }

                  if (typeof entity.flammable !== 'undefined') {
                    embed.addFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.minecraft.entity.embed.flammable',
                        ),
                        value: entity.flammable ? t('misc.yes') : t('misc.no'),
                        inline: true,
                      },
                    ]);
                  }

                  if (typeof entity.renewable !== 'undefined') {
                    embed.addFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.minecraft.entity.embed.renewable',
                        ),
                        value: entity.renewable ? t('misc.yes') : t('misc.no'),
                        inline: true,
                      },
                    ]);
                  }
                  break;
              }

              await interaction.editReply({ embeds: [embed] });
            },
            food: async () => {
              if (!name) {
                const responses = mcData.foodsArray.map(
                  (item, i) => `${bold(`${i + 1}.`)} ${item.displayName}`,
                );

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.minecraft.food.pagination',
                      {
                        edition: minecraftEdition,
                        total: count(mcData.foodsArray),
                      },
                    ),
                    iconURL: minecraftLogo,
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const food = {
                ...mcData.foodsByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.food[getFormattedMinecraftName(snakeCase(name))],
              };

              if (!Object.keys(food).length) {
                throw t('global.error.minecraftFood', {
                  food: inlineCode(name),
                });
              }

              embed
                .setDescription(food.description)
                .setThumbnail(
                  getWikiaURL({
                    fileName: `${food?.altName ?? food.displayName}${
                      food.positions?.length
                        ? food.positions.map((pos) => ` (${pos})`).join('')
                        : ''
                    }${food.version ? ` ${food.version}` : ''}`,
                    path: 'minecraft_gamepedia',
                    animated: food?.animated ?? false,
                  }),
                )
                .setAuthor({ name: `🍎 ${food.displayName}` })
                .addFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.food.embed.stackable',
                    ),
                    value:
                      food.stackSize > 0
                        ? `${t('misc.yes')} (${food.stackSize})`
                        : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.food.embed.renewable',
                    ),
                    value: food.renewable ? t('misc.yes') : t('misc.no'),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.minecraft.food.embed.fp',
                    ),
                    value: `${food.foodPoints} (🍗x${food.foodPoints / 2})`,
                    inline: true,
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
          }[options.getSubcommand()]();
        },
        vtuber: () => {
          const holodex = new HolodexApiClient({
            apiKey: process.env.HOLODEX_API_KEY,
          });
          const affiliations = Object.values(vtuberAffiliation);

          return {
            affiliation: async () => {
              const affiliation = options.getString('affiliation');
              const sort = options.getString('sort');

              if (!affiliation) {
                const responses = affiliations
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(({ name }, i) => `${bold(`${i + 1}.`)} ${name}`);

                return await generatePagination({ interaction, limit: 10 })
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.vtuber.affiliation.pagination',
                      { total: count(affiliations) },
                    ),
                  })
                  .setDescriptions(responses)
                  .render();
              }

              const org = affiliations.find(
                (aff) => aff.name.toLowerCase() === affiliation.toLowerCase(),
              );

              if (!org) {
                throw t('global.error.vtuberAffiliation', {
                  affiliation: inlineCode(affiliation),
                });
              }

              const channels = await holodex.getChannels({
                org: org.name,
                limit: 50,
                sort: sort ?? 'org',
                order:
                  sort === 'subscriber_count' ||
                  sort === 'video_count' ||
                  sort === 'clip_count'
                    ? SortOrder.Descending
                    : SortOrder.Ascending,
              });

              const embeds = channels.map((item, i, arr) => {
                const {
                  clip_count,
                  english_name,
                  group,
                  id,
                  inactive,
                  name,
                  photo,
                  org: aff,
                  subscriber_count,
                  top_topics,
                  twitter,
                  video_count,
                } = item.toRaw();

                return generateEmbed({ interaction, loop: true, i, arr })
                  .setThumbnail(photo ?? null)
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.vtuber.affiliation.embed.author',
                      {
                        type: aff
                          ? aff.includes('Independents')
                            ? `🧑‍💻 ${aff.slice(0, -1)} Vtubers`
                            : aff
                          : '',
                      },
                    ),
                    iconURL: aff?.logoURL,
                  })
                  .setFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.name',
                      ),
                      value: english_name || name,
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.chName',
                      ),
                      value: `${hyperlink(
                        name,
                        `https://youtube.com/channel/${id}`,
                      )}${inactive ? ` (${t('misc.inactive')})` : ''}`,
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.group',
                      ),
                      value: group || italic(t('misc.none')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.twitter',
                      ),
                      value: twitter
                        ? hyperlink(
                            `@${twitter}`,
                            `https://twitter.com/${twitter}`,
                          )
                        : italic(t('misc.none')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.vod',
                      ),
                      value: video_count
                        ? count(video_count, 'video')
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.subs',
                      ),
                      value: subscriber_count
                        ? count(subscriber_count, 'subscriber')
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.clip',
                      ),
                      value: clip_count
                        ? count(clip_count, 'video')
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.affiliation.embed.field.topics',
                      ),
                      value: top_topics
                        ? top_topics
                            .map((topic) => transformCase(topic))
                            .join(', ')
                        : italic(t('misc.none')),
                      inline: true,
                    },
                  ]);
              });

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
            channel: async () => {
              const id = options.getString('id', true);

              const item = await holodex.getChannel(id).catch(() => {
                throw t('global.error.vtuberChannel', {
                  channelID: inlineCode(id),
                });
              });

              const {
                clip_count,
                description,
                english_name,
                id: channelID,
                inactive,
                name,
                org,
                photo,
                published_at,
                suborg,
                subscriber_count,
                top_topics,
                twitter,
                video_count,
                view_count,
              } = item.toRaw();

              embed
                .setDescription(truncate(description, 4096))
                .setThumbnail(photo ?? null)
                .setAuthor({
                  name: t(
                    'command.info.subcommandGroup.vtuber.channel.embed.author',
                    {
                      type: `${org?.includes('Independents') ? '🧑‍💻 ' : ''}${
                        english_name || name
                      }`,
                    },
                  ),
                  iconURL: affiliations.find(
                    (aff) => aff.name.toLowerCase() === org?.toLowerCase(),
                  )?.logoURL,
                })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.chName',
                    ),
                    value: `${hyperlink(
                      name,
                      `https://youtube.com/channel/${channelID}`,
                    )}${inactive ? ` (${t('misc.inactive')})` : ''}`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.created',
                    ),
                    value: published_at
                      ? time(
                          new Date(published_at),
                          TimestampStyles.RelativeTime,
                        )
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.affiliation',
                    ),
                    value: org || italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.group',
                    ),
                    value: suborg?.substring(2) || italic(t('misc.none')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.twitter',
                    ),
                    value: twitter
                      ? hyperlink(
                          `@${twitter}`,
                          `https://twitter.com/${twitter}`,
                        )
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.view',
                    ),
                    value: view_count
                      ? count(view_count, 'view')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.vod',
                    ),
                    value: video_count
                      ? count(video_count, 'video')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.subs',
                    ),
                    value: subscriber_count
                      ? count(subscriber_count, 'subscriber')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.clip',
                    ),
                    value: clip_count
                      ? count(clip_count, 'video')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.channel.embed.field.topics',
                    ),
                    value: top_topics
                      ? top_topics
                          .map((topic) => transformCase(topic))
                          .join(', ')
                      : italic(t('misc.none')),
                    inline: true,
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
            clipper: async () => {
              const channelID = options.getString('id');
              const sort = options.getString('sort');

              if (!channelID) {
                const channels = await holodex.getChannels({
                  limit: 50,
                  sort: sort ?? 'org',
                  order:
                    sort === 'subscriber_count' ||
                    sort === 'video_count' ||
                    sort === 'clip_count'
                      ? SortOrder.Descending
                      : SortOrder.Ascending,
                  type: ChannelType.Subber,
                });

                const embeds = channels.map((item, i, arr) => {
                  const {
                    id,
                    inactive,
                    name,
                    photo,
                    subscriber_count,
                    twitter,
                    video_count,
                  } = item.toRaw();

                  return generateEmbed({
                    interaction,
                    loop: true,
                    i,
                    arr,
                  })
                    .setThumbnail(photo ?? null)
                    .setAuthor({
                      name: t(
                        'command.info.subcommandGroup.vtuber.clipper.embed.author.many',
                      ),
                    })
                    .setFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.clipper.embed.field.chName',
                        ),
                        value: `${hyperlink(
                          name,
                          `https://youtube.com/channel/${id}`,
                        )}${inactive ? ` (${t('misc.inactive')})` : ''}`,
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.clipper.embed.field.twitter',
                        ),
                        value: twitter
                          ? hyperlink(
                              `@${twitter}`,
                              `https://twitter.com/${twitter}`,
                            )
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.clipper.embed.field.vod',
                        ),
                        value: video_count
                          ? count(video_count, 'video')
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.clipper.embed.field.subs',
                        ),
                        value: subscriber_count
                          ? count(subscriber_count, 'subscriber')
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                    ]);
                });

                return await generatePagination({ interaction })
                  .setEmbeds(embeds)
                  .render();
              }

              const item = await holodex.getChannel(channelID).catch(() => {
                throw t('global.error.vtuberClipper', { channelID });
              });

              const {
                description,
                id,
                inactive,
                name,
                photo,
                published_at,
                subscriber_count,
                twitter,
                video_count,
                view_count,
              } = item.toRaw();

              embed
                .setDescription(truncate(description, 4096))
                .setThumbnail(photo ?? null)
                .setAuthor({
                  name: t(
                    'command.info.subcommandGroup.vtuber.clipper.embed.single',
                    { channel: name },
                  ),
                })
                .setFields([
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.clipper.embed.field.chName',
                    ),
                    value: `${hyperlink(
                      name,
                      `https://youtube.com/channel/${id}`,
                    )}${inactive ? ` (${t('misc.inactive')})` : ''}`,
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.clipper.embed.field.created',
                    ),
                    value: published_at
                      ? time(
                          new Date(published_at),
                          TimestampStyles.RelativeTime,
                        )
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.clipper.embed.field.twitter',
                    ),
                    value: twitter
                      ? hyperlink(
                          `@${twitter}`,
                          `https://twitter.com/${twitter}`,
                        )
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.clipper.embed.field.view',
                    ),
                    value: view_count
                      ? count(view_count, 'view')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.clipper.embed.field.vod',
                    ),
                    value: video_count
                      ? count(video_count, 'video')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                  {
                    name: t(
                      'command.info.subcommandGroup.vtuber.clipper.embed.field.subs',
                    ),
                    value: subscriber_count
                      ? count(subscriber_count, 'subscriber')
                      : italic(t('misc.unknown')),
                    inline: true,
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            },
            live: async () => {
              const channelID = options.getString('id');
              const affiliation = options.getString('affiliation');
              const sort = options.getString('sort') ?? 'live_viewers';

              const org = affiliations.find(
                (aff) => aff.name.toLowerCase() === affiliation?.toLowerCase(),
              );

              if (affiliation && !org) {
                throw t('global.error.vtuberLive.affiliation', {
                  affiliation: inlineCode(affiliation),
                });
              }

              const videosParam = {
                limit: 50,
                include: [ExtraData.Description],
                status: VideoStatus.Live,
                order:
                  sort === 'live_viewers' ||
                  sort === 'available_at' ||
                  sort === 'subscriber_count' ||
                  sort === 'video_count' ||
                  sort === 'clip_count'
                    ? SortOrder.Descending
                    : SortOrder.Ascending,
              };

              if (!channelID) {
                affiliation && org
                  ? Object.assign(videosParam, {
                      sort: 'available_at',
                      org: org.name,
                    })
                  : Object.assign(videosParam, { sort });

                const videos = await holodex.getLiveVideos(videosParam);

                if (!videos.length) {
                  throw t('global.error.vtuberLive.channelLive', {
                    channelID: inlineCode(channelID),
                  });
                }

                const embeds = videos.map((item, i, arr) => {
                  const {
                    available_at,
                    channel: { english_name, name, org: aff, photo },
                    description,
                    id,
                    live_viewers,
                    published_at,
                    title,
                    topic_id,
                  } = item.toRaw();

                  return generateEmbed({
                    interaction,
                    loop: true,
                    i,
                    arr,
                  })
                    .setDescription(
                      description ? truncate(description, 4096) : null,
                    )
                    .setThumbnail(photo ?? null)
                    .setAuthor({
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.author.many',
                        {
                          type: `${aff?.includes('Independents') ? '🧑‍💻 ' : ''}${
                            english_name || name
                          }`,
                        },
                      ),
                      iconURL: affiliations.find(
                        (a) => a.name.toLowerCase() === aff?.toLowerCase(),
                      )?.logoURL,
                    })
                    .setFields([
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.title',
                        ),
                        value: hyperlink(
                          title,
                          `https://youtube.com/watch?v=${id}`,
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.published',
                        ),
                        value: published_at
                          ? time(
                              new Date(published_at),
                              TimestampStyles.RelativeTime,
                            )
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.streamed',
                        ),
                        value: time(
                          new Date(available_at),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.liveView.name',
                        ),
                        value: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.liveView.value',
                          { total: live_viewers ? count(live_viewers) : 0 },
                        ),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.topic',
                        ),
                        value: topic_id
                          ? transformCase(topic_id)
                          : italic(t('misc.unknown')),
                        inline: true,
                      },
                      {
                        name: t(
                          'command.info.subcommandGroup.vtuber.live.embed.field.affiliation',
                        ),
                        value: aff ?? italic(t('misc.unknown')),
                        inline: true,
                      },
                    ]);
                });

                return await generatePagination({ interaction })
                  .setEmbeds(embeds)
                  .render();
              }

              const videos = await holodex.getLiveVideosByChannelId(channelID);

              if (!videos.length) {
                throw t('global.error.vtuberLive.channel', {
                  channelID: inlineCode(channelID),
                });
              }

              const liveVideos = videos.filter(
                (video) => video.toRaw().status === VideoStatus.Live,
              );

              if (!liveVideos.length) {
                throw t('global.error.vtuberLive.live');
              }

              if (liveVideos.length === 1) {
                const {
                  available_at,
                  channel: { english_name, name, org: aff, photo },
                  description,
                  id,
                  live_viewers,
                  published_at,
                  title,
                  topic_id,
                } = liveVideos[0].toRaw();

                embed
                  .setDescription(
                    description ? truncate(description, 4096) : null,
                  )
                  .setThumbnail(photo ?? null)
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.vtuber.live.embed.author.single',
                      {
                        type: `${aff?.includes('Independents') ? '🧑‍💻 ' : ''}${
                          english_name || name
                        }`,
                      },
                    ),
                    iconURL: affiliations.find(
                      (a) => a.name.toLowerCase() === aff?.toLowerCase(),
                    )?.logoURL,
                  })
                  .setFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.title',
                      ),
                      value: hyperlink(
                        title,
                        `https://youtube.com/watch?v=${id}`,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.published',
                      ),
                      value: published_at
                        ? time(
                            new Date(published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.streamed',
                      ),
                      value: time(
                        new Date(available_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.liveView.name',
                      ),
                      value: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.liveView.value',
                        { total: live_viewers ? count(live_viewers) : 0 },
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.topic',
                      ),
                      value: topic_id
                        ? transformCase(topic_id)
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.affiliation',
                      ),
                      value: aff ?? italic(t('misc.unknown')),
                      inline: true,
                    },
                  ]);

                return await interaction.editReply({ embeds: [embed] });
              }

              const embeds = liveVideos.map((item, i, arr) => {
                const {
                  available_at,
                  channel: { english_name, name, org: aff, photo },
                  description,
                  id,
                  live_viewers,
                  published_at,
                  title,
                  topic_id,
                } = item.toRaw();

                return generateEmbed({ interaction, loop: true, i, arr })
                  .setDescription(
                    description ? truncate(description, 4096) : null,
                  )
                  .setThumbnail(photo ?? null)
                  .setAuthor({
                    name: `${aff?.includes('Independents') ? '🧑‍💻' : ''} ${
                      english_name || name
                    }'s YouTube Stream Lists`,
                    iconURL: affiliations.find(
                      (a) => a.name.toLowerCase() === aff?.toLowerCase(),
                    )?.logoURL,
                  })
                  .setFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.title',
                      ),
                      value: hyperlink(
                        title,
                        `https://youtube.com/watch?v=${id}`,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.published',
                      ),
                      value: published_at
                        ? time(
                            new Date(published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.streamed',
                      ),
                      value: time(
                        new Date(available_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.liveView.name',
                      ),
                      value: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.liveView.value',
                        { total: live_viewers ? count(live_viewers) : 0 },
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.topic',
                      ),
                      value: topic_id
                        ? transformCase(topic_id)
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.live.embed.field.affiliation',
                      ),
                      value: aff ?? italic(t('misc.unknown')),
                      inline: true,
                    },
                  ]);
              });

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
            video: async () => {
              const channelID = options.getString('id', true);

              const videos = await holodex.getVideosByChannelId(
                channelID,
                VideoSearchType.Videos,
                {
                  limit: 50,
                  include: [ExtraData.Description, ExtraData.LiveInfo],
                },
              );

              if (!videos.length) {
                throw t('global.error.vtuberLive.video', {
                  channelID: inlineCode(channelID),
                });
              }

              const embeds = videos.map((item, i, arr) => {
                const {
                  available_at,
                  channel: { english_name, name, org: aff, photo },
                  description,
                  duration,
                  id,
                  live_viewers,
                  published_at,
                  status,
                  title,
                } = item.toRaw();

                const newEmbed = generateEmbed({
                  interaction,
                  loop: true,
                  i,
                  arr,
                })
                  .setDescription(
                    description ? truncate(description, 4096) : null,
                  )
                  .setThumbnail(photo ?? null)
                  .setAuthor({
                    name: t(
                      'command.info.subcommandGroup.vtuber.video.embed.author',
                      {
                        type: `${aff?.includes('Independents') ? '🧑‍💻 ' : ''}${
                          english_name || name
                        }`,
                      },
                    ),
                    iconURL: affiliations.find(
                      (a) => a.name.toLowerCase() === aff?.toLowerCase(),
                    )?.logoURL,
                  })
                  .setFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.title',
                      ),
                      value: hyperlink(
                        title,
                        `https://youtube.com/watch?v=${id}`,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.status',
                      ),
                      value: capitalCase(
                        status === VideoStatus.Past ? 'archived' : status,
                      ),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.duration',
                      ),
                      value:
                        status !== VideoStatus.Upcoming
                          ? moment
                              .duration(duration, 's')
                              .locale(code)
                              .humanize()
                          : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.published',
                      ),
                      value: published_at
                        ? time(
                            new Date(published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic(t('misc.unknown')),
                      inline: true,
                    },
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.streamed',
                      ),
                      value: time(
                        new Date(available_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                  ]);

                if (status === VideoStatus.Live) {
                  newEmbed.addFields([
                    {
                      name: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.liveView.name',
                      ),
                      value: t(
                        'command.info.subcommandGroup.vtuber.video.embed.field.liveView.value',
                        { total: live_viewers ? count(live_viewers) : 0 },
                      ),
                      inline: true,
                    },
                  ]);
                }

                return newEmbed;
              });

              await generatePagination({ interaction })
                .setEmbeds(embeds)
                .render();
            },
          }[options.getSubcommand()]();
        },
      }[options.getSubcommandGroup()]();
    }

    return {
      instagram: async () => {
        const usernameQuery = options.getString('username', true).toLowerCase();
        const cleanUsername = usernameQuery.startsWith('@')
          ? usernameQuery.replace('@', '')
          : usernameQuery;

        /** @type {{ data: { result: import('@/constants/types').InstagramInfo } }} */
        const {
          data: {
            result: {
              bio,
              followers,
              following,
              fullname,
              photo_profile,
              posts,
              username,
            },
          },
        } = await axios
          .get(
            `https://api.lolhuman.xyz/api/stalkig/${cleanUsername}?apikey=${process.env.LOLHUMAN_API_KEY}`,
            { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
          )
          .catch((err) => {
            if (err.response?.status === 404) {
              throw t('global.error.instgramUser', {
                username: inlineCode(cleanUsername),
              });
            }

            throw err;
          });

        embed
          .setDescription(bio || null)
          .setThumbnail(photo_profile)
          .setAuthor({
            name: t('command.info.subcommand.instagram.embed.author'),
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
          })
          .setFields([
            {
              name: t('command.info.subcommand.instagram.embed.field.username'),
              value: hyperlink(
                username,
                `https://instagram.com/${username.replace('@', '')}`,
              ),
              inline: true,
            },
            {
              name: t('command.info.subcommand.instagram.embed.field.fullName'),
              value: fullname || italic(t('misc.none')),
              inline: true,
            },
            {
              name: t('command.info.subcommand.instagram.embed.field.posts'),
              value: count(posts),
              inline: true,
            },
            {
              name: t(
                'command.info.subcommand.instagram.embed.field.following',
              ),
              value: count(following),
              inline: true,
            },
            {
              name: t(
                'command.info.subcommand.instagram.embed.field.followers',
              ),
              value: count(followers),
              inline: true,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      },
      npm: async () => {
        const nameQuery = options.getString('name', true);

        /** @type {{ data: import('@/constants/types').NPMPackage }} */
        const {
          data: {
            author,
            description,
            'dist-tags': tags,
            homepage,
            keywords,
            license,
            maintainers,
            name,
            repository,
            time: { created, modified },
            versions,
          },
        } = await axios
          .get(`https://registry.npmjs.com/${nameQuery}`)
          .catch((err) => {
            if (err.response?.status === 404) {
              throw t('global.error.npmPackage', {
                package: inlineCode(nameQuery),
              });
            }

            throw err;
          });

        let maintainerArr = maintainers.map(
          ({ email, name: maintainerName }) =>
            `${bold('•')} ${maintainerName} (${email})`,
        );

        if (maintainerArr.length > 10) {
          const rest = maintainerArr.length - 10;

          maintainerArr = maintainerArr.slice(0, 10);
          maintainerArr.push(italic(t('misc.more', { total: count(rest) })));
        }

        let versionArr =
          tags &&
          Object.entries(tags).map(
            ([key, value]) => `${bold('•')} ${key} (${value})`,
          );

        if (versionArr && versionArr.length > 10) {
          const rest = versionArr.length - 10;

          versionArr = versionArr.slice(0, 10);
          versionArr.push(italic(t('misc.more', { total: count(rest) })));
        }

        const version = tags && versions[tags.latest];

        let dependencies =
          version.dependencies &&
          Object.entries(version.dependencies).map(
            ([key, value]) => `${bold('•')} ${key} (${value})`,
          );

        if (dependencies && dependencies.length > 10) {
          const rest = dependencies.length - 10;

          dependencies = dependencies.slice(0, 10);
          dependencies.push(italic(t('misc.more', { total: count(rest) })));
        }

        const cleanedURL = repository.url?.replace('git+', '');

        embed.setAuthor({
          name: t('command.info.subcommand.npm.embed.author', { name }),
          url: homepage,
          iconURL:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/320px-Npm-logo.svg.png',
        });
        embed.setDescription(description);
        embed.setFields([
          {
            name: t('command.info.subcommand.npm.embed.field.author'),
            value: author
              ? author.url
                ? hyperlink(
                    `${author.name}${author.email ? ` (${author.email})` : ''}`,
                  )
                : `${author.name}${author.email ? ` (${author.email})` : ''}`
              : italic(t('misc.unknown')),
            inline: true,
          },
          {
            name: t('command.info.subcommand.npm.embed.field.created'),
            value: time(new Date(created), TimestampStyles.RelativeTime),
            inline: true,
          },
          {
            name: t('command.info.subcommand.npm.embed.field.updated'),
            value: time(new Date(modified), TimestampStyles.RelativeTime),
            inline: true,
          },
          {
            name: t('command.info.subcommand.npm.embed.field.keyword'),
            value: keywords ? keywords.join(', ') : italic(t('misc.unknown')),
            inline: true,
          },
          {
            name: t('command.info.subcommand.npm.embed.field.license'),
            value: license ?? italic(t('misc.unknown')),
            inline: true,
          },
          {
            name: t('command.info.subcommand.npm.embed.field.repository'),
            value: cleanedURL
              ? cleanedURL.startsWith('git://')
                ? cleanedURL.replace('git://', 'https://').replace('.git', '')
                : [...cleanedURL].slice(0, cleanedURL.lastIndexOf('.')).join('')
              : italic(t('misc.unknown')),
            inline: true,
          },
          {
            name: t('command.info.subcommand.npm.embed.field.maintainer'),
            value: maintainerArr.join('\n'),
          },
          {
            name: t('command.info.subcommand.npm.embed.field.version'),
            value: versionArr
              ? versionArr.join('\n')
              : italic(t('misc.unknown')),
          },
          {
            name: t('command.info.subcommand.npm.embed.field.dependency'),
            value:
              dependencies && dependencies.length
                ? dependencies.join('\n')
                : italic(t('misc.none')),
          },
        ]);

        await interaction.editReply({ embeds: [embed] });
      },
      weather: () => {
        const locationTarget = options.getString('location', true);

        weather.find(
          { search: locationTarget, degreeType: 'C' },
          /**
           *
           * @param {Error} err
           * @param {import('@/constants/types').Weather[]} result
           */
          async (err, result) => {
            if (err) throw err;

            if (!result.length) {
              throw t('global.error.weather', {
                location: inlineCode(locationTarget),
              });
            }

            const [
              {
                location: { degreetype, name },
                current: {
                  day,
                  humidity,
                  imageUrl,
                  observationtime,
                  skytext,
                  temperature,
                  winddisplay,
                },
                forecast,
              },
            ] = result;

            embed
              .setThumbnail(imageUrl)
              .setAuthor({
                name: t('command.info.subcommand.weather.embed.author', {
                  name,
                }),
              })
              .setFields([
                {
                  name: t(
                    'command.info.subcommand.weather.embed.field.temperature',
                  ),
                  value: `${temperature}°${degreetype}`,
                  inline: true,
                },
                {
                  name: t(
                    'command.info.subcommand.weather.embed.field.humidity',
                  ),
                  value: `${humidity}%`,
                  inline: true,
                },
                {
                  name: t('command.info.subcommand.weather.embed.field.wind'),
                  value: winddisplay,
                  inline: true,
                },
                {
                  name: t('command.info.subcommand.weather.embed.field.status'),
                  value: `${day} ${observationtime.slice(
                    0,
                    observationtime.length - 3,
                  )} (${skytext})`,
                  inline: true,
                },
                {
                  name: t(
                    'command.info.subcommand.weather.embed.field.forecast',
                  ),
                  value: forecast
                    .map(
                      ({ day: forecastDay, high, low, precip, skytextday }) =>
                        `${bold(forecastDay)}\n${t(
                          'misc.status',
                        )}: ${skytextday}\n${t(
                          'misc.range',
                        )}: ${low}°${degreetype} - ${high}°${degreetype}\n${t(
                          'misc.precipitation',
                        )}: ${
                          !precip ? italic(t('misc.unknown')) : `${precip}%`
                        }`,
                    )
                    .join('\n\n'),
                },
              ]);

            await interaction.editReply({ embeds: [embed] });
          },
        );
      },
    }[options.getSubcommand()]();
  },
};
