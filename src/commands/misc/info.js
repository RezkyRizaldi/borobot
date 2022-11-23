const axios = require('axios');
const {
  capitalCase,
  paramCase,
  pascalCase,
  snakeCase,
} = require('change-case');
const {
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
const {
  ChannelType,
  ExtraData,
  HolodexApiClient,
  SortOrder,
  VideoSearchType,
  VideoStatus,
} = require('holodex.js');
const moment = require('moment');
const minecraftData = require('minecraft-data');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');
const { stringify } = require('roman-numerals-convert');
const weather = require('weather-js');

const {
  extraMcData,
  githubRepoSortingTypeChoices,
  searchSortingChoices,
  vtuberAffiliation,
  vtuberStreamSortingChoices,
  vtuberVideoSortingChoices,
} = require('../../constants');
const {
  applyKeywordColor,
  count,
  getFormattedMinecraftName,
  getWikiaURL,
  getFormattedParam,
  transformCase,
  truncate,
} = require('../../utils');

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
    const { client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    switch (options.getSubcommandGroup()) {
      case 'covid':
        {
          const baseURL = 'https://covid19.mathdro.id/api';

          switch (options.getSubcommand()) {
            case 'latest': {
              /** @type {{ data: import('../../constants/types').CovidLatest[] }} */
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
                  index,
                  array,
                ) =>
                  new EmbedBuilder()
                    .setColor(guild?.members.me?.displayHexColor ?? null)
                    .setTimestamp(Date.now())
                    .setFooter({
                      text: `${client.user.username} | Page ${index + 1} of ${
                        array.length
                      }`,
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setThumbnail(`${baseURL}/og`)
                    .setAuthor({ name: '🦠 Covid-19 Latest Cases' })
                    .setFields([
                      {
                        name: '🌏 Country',
                        value: countryRegion,
                        inline: true,
                      },
                      {
                        name: '🗾 Province/State',
                        value:
                          !provinceState || provinceState === 'Unknown'
                            ? italic('Unknown')
                            : provinceState,
                        inline: true,
                      },
                      {
                        name: '📆 Last Updated',
                        value: time(
                          new Date(lastUpdate),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: '✅ Confirmed',
                        value: count({ total: confirmed, data: 'case' }),
                        inline: true,
                      },
                      {
                        name: '☠️ Deaths',
                        value: count({ total: deaths, data: 'death' }),
                        inline: true,
                      },
                      {
                        name: '⚖️ Case Fatality Ratio',
                        value: Number(caseFatalityRatio).toFixed(2),
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

            case 'list': {
              /** @type {{ data: { countries: import('../../constants/types').CovidCountry[] } }} */
              const {
                data: { countries },
              } = await axios.get(`${baseURL}/countries`);

              const responses = countries.map(
                ({ name }, index) => `${bold(`${index + 1}.`)} ${name}`,
              );

              const pagination = new Pagination(interaction, { limit: 10 })
                .setColor(guild?.members.me?.displayHexColor ?? null)
                .setTimestamp(Date.now())
                .setFooter({
                  text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setAuthor({ name: '🌏 Covid-19 Country Lists' })
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
              const name = options.getString('name');

              if (!name) {
                /** @type {{ data: import('../../constants/types').CovidConfirmed[] }} */
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
                    index,
                    array,
                  ) =>
                    new EmbedBuilder()
                      .setColor(guild?.members.me?.displayHexColor ?? null)
                      .setTimestamp(Date.now())
                      .setFooter({
                        text: `${client.user.username} | Page ${index + 1} of ${
                          array.length
                        }`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      })
                      .setThumbnail(
                        `${baseURL}/countries/${encodeURIComponent(
                          countryRegion,
                        )}/og`,
                      )
                      .setAuthor({ name: '🦠 Covid-19 Confirmed Cases' })
                      .setFields([
                        {
                          name: '🌏 Country',
                          value: countryRegion,
                          inline: true,
                        },
                        {
                          name: '🗾 Province/State',
                          value:
                            !provinceState || provinceState === 'Unknown'
                              ? italic('Unknown')
                              : provinceState,
                          inline: true,
                        },
                        {
                          name: '📆 Last Updated',
                          value: time(
                            new Date(lastUpdate),
                            TimestampStyles.RelativeTime,
                          ),
                          inline: true,
                        },
                        {
                          name: '✅ Confirmed',
                          value: `${count({ total: confirmed, data: 'case' })}${
                            cases28Days
                              ? ` (${count({
                                  total: cases28Days,
                                  data: 'case',
                                })}/month)`
                              : ''
                          }`,
                          inline: true,
                        },
                        {
                          name: '☠️ Deaths',
                          value: `${count({ total: deaths, data: 'death' })}${
                            deaths28Days
                              ? ` (${count({
                                  total: deaths28Days,
                                  data: 'death',
                                })}/month)`
                              : ''
                          }`,
                          inline: true,
                        },
                        {
                          name: '📋 Incident Rate',
                          value: incidentRate
                            ? `${count({
                                total: Math.floor(incidentRate),
                                data: 'case',
                              })}/day`
                            : italic('Unknown'),
                          inline: true,
                        },
                      ]),
                );

                const pagination = new Pagination(interaction).setEmbeds(
                  embeds,
                );

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

              /** @type {{ data: { countries: import('../../constants/types').CovidCountry[] } }} */
              const {
                data: { countries },
              } = await axios.get(`${baseURL}/countries`);

              const country = countries.find(
                (item) => item.name.toLowerCase() === name.toLowerCase(),
              )?.name;

              if (!country) {
                throw `No information found in ${inlineCode(name)}.`;
              }

              /** @type {{ data: import('../../constants/types').CovidConfirmed[] }} */
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
                    name: `🦠 Covid-19 Confirmed Cases in ${data[0].countryRegion}`,
                  })
                  .setFields([
                    {
                      name: '🗾 Province/State',
                      value:
                        !data[0].provinceState ||
                        data[0].provinceState === 'Unknown'
                          ? italic('Unknown')
                          : data[0].provinceState,
                      inline: true,
                    },
                    {
                      name: '📆 Last Updated',
                      value: time(
                        new Date(data[0].lastUpdate),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: '✅ Confirmed',
                      value: `${count({
                        total: data[0].confirmed,
                        data: 'case',
                      })}${
                        data[0].cases28Days
                          ? ` (${count({
                              total: data[0].cases28Days,
                              data: 'case',
                            })}/month)`
                          : ''
                      }`,
                      inline: true,
                    },
                    {
                      name: '🔴 Active',
                      value: data[0].active
                        ? `${count({ total: data[0].active, data: 'case' })}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '☠️ Deaths',
                      value: `${count({
                        total: data[0].deaths,
                        data: 'death',
                      })}${
                        data[0].deaths28Days
                          ? ` (${count({
                              total: data[0].deaths28Days,
                              data: 'death',
                            })}/month)`
                          : ''
                      }`,
                      inline: true,
                    },
                    {
                      name: '📋 Incident Rate',
                      value: data[0].incidentRate
                        ? `${count({
                            total: Math.floor(data[0].incidentRate),
                            data: 'case',
                          })}/day`
                        : italic('Unknown'),
                      inline: true,
                    },
                  ]);

                return interaction.editReply({ embeds: [embed] });
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
                  index,
                  array,
                ) =>
                  new EmbedBuilder()
                    .setColor(guild?.members.me?.displayHexColor ?? null)
                    .setTimestamp(Date.now())
                    .setFooter({
                      text: `${client.user.username} | Page ${index + 1} of ${
                        array.length
                      }`,
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setThumbnail(`${baseURL}/countries/${countryRegion}/og`)
                    .setAuthor({
                      name: `🦠 Covid-19 Confirmed Cases in ${countryRegion}`,
                    })
                    .setFields([
                      {
                        name: '🗾 Province/State',
                        value:
                          !provinceState || provinceState === 'Unknown'
                            ? italic('Unknown')
                            : provinceState,
                        inline: true,
                      },
                      {
                        name: '📆 Last Updated',
                        value: time(
                          new Date(lastUpdate),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: '✅ Confirmed',
                        value: `${count({ total: confirmed, data: 'case' })}${
                          cases28Days
                            ? ` (${count({
                                total: cases28Days,
                                data: 'case',
                              })}/month)`
                            : ''
                        }`,
                        inline: true,
                      },
                      {
                        name: '🔴 Active',
                        value: active
                          ? `${count({ total: active, data: 'case' })}`
                          : italic('Unknown'),
                        inline: true,
                      },
                      {
                        name: '☠️ Deaths',
                        value: `${count({ total: deaths, data: 'death' })}${
                          deaths28Days
                            ? ` (${count({
                                total: deaths28Days,
                                data: 'death',
                              })}/month)`
                            : ''
                        }`,
                        inline: true,
                      },
                      {
                        name: '📋 Incident Rate',
                        value: incidentRate
                          ? `${count({
                              total: Math.floor(incidentRate),
                              data: 'case',
                            })}/day`
                          : italic('Unknown'),
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
        }
        break;

      case 'genshin':
        {
          const baseURL = 'https://api.genshin.dev';

          switch (options.getSubcommand()) {
            case 'artifact': {
              const nameQuery = options.getString('name');

              if (!nameQuery) {
                /** @type {{ data: String[] }} */
                const { data } = await axios.get(`${baseURL}/artifacts`);

                const responses = data.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `Genshin Impact Artifact Lists (${data.length})`,
                    iconURL: getWikiaURL({
                      fileName: 'Genshin_Impact',
                      path: 'gensin-impact',
                    }),
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

              /** @type {{ data: import('../../constants/types').GenshinArtifact }} */
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
                .get(`${baseURL}/artifacts/${paramCase(nameQuery)}`)
                .catch(async () => {
                  throw `No artifact found with name ${inlineCode(nameQuery)}.`;
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
                    name: '⭐ Rarity',
                    value:
                      max_rarity > 1
                        ? `1-${max_rarity} ⭐`
                        : `${max_rarity} ⭐`,
                  },
                ]);

              if (piece1) {
                embed.addFields([{ name: '🎁 1-piece Bonus', value: piece1 }]);
              }

              if (piece2) {
                embed.addFields([{ name: '🎁 2-piece Bonus', value: piece2 }]);
              }

              if (piece3) {
                embed.addFields([{ name: '🎁 3-piece Bonus', value: piece3 }]);
              }

              if (piece4) {
                embed.addFields([{ name: '🎁 4-piece Bonus', value: piece4 }]);
              }

              if (piece5) {
                embed.addFields([{ name: '🎁 5-piece Bonus', value: piece5 }]);
              }

              return interaction.editReply({ embeds: [embed] });
            }

            case 'character': {
              const nameQuery = options.getString('name');
              const detailed = options.getBoolean('detailed') ?? false;

              if (!nameQuery) {
                /** @type {{ data: String[] }} */
                const { data } = await axios.get(`${baseURL}/characters`);

                const responses = data.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `Genshin Impact Character Lists (${data.length})`,
                    iconURL: getWikiaURL({
                      fileName: 'Genshin_Impact',
                      path: 'gensin-impact',
                    }),
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

              /** @type {{ data: import('../../constants/types').GenshinCharacter }} */
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
                .get(`${baseURL}/characters/${getFormattedParam(nameQuery)}`)
                .catch(async () => {
                  throw `No character found with name ${inlineCode(
                    nameQuery,
                  )}.`;
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
                    name: '🔤 Title',
                    value: title || italic('None'),
                    inline: true,
                  },
                  { name: '🪄 Vision', value: vision, inline: true },
                  { name: '🗡️ Weapon', value: weapon, inline: true },
                  {
                    name: '🗺️ Nation',
                    value: nation !== 'Unknown' ? nation : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🏰 Affiliation',
                    value:
                      affiliation !== 'Not affilated to any Nation'
                        ? affiliation
                        : italic('None'),
                    inline: true,
                  },
                  {
                    name: '⭐ Rarity',
                    value: '⭐'.repeat(rarity),
                    inline: true,
                  },
                  {
                    name: '✨ Constellation',
                    value: constellation,
                    inline: true,
                  },
                  {
                    name: '🎂 Birthday',
                    value: birthday
                      ? moment(birthday).format('MMMM Do')
                      : italic('Unknown'),
                    inline: true,
                  },
                ]);

              if (specialDish) {
                embed.addFields([
                  { name: '🍽️ Special Dish', value: specialDish, inline: true },
                ]);
              }

              if (!detailed) {
                return interaction.editReply({ embeds: [embed] });
              }

              const activeTalentEmbed = new EmbedBuilder()
                .setColor(guild?.members.me?.displayHexColor ?? null)
                .setTimestamp(Date.now())
                .setDescription(
                  `${bold('Active Talents')}\n${skillTalents
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
                            ? `\n${bold('- Attributes')}\n${upgrades
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

              const passiveTalentEmbed = new EmbedBuilder()
                .setColor(guild?.members.me?.displayHexColor ?? null)
                .setTimestamp(Date.now())
                .setDescription(
                  `${bold('Passive Talents')}\n${passiveTalents
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

              const constellationEmbed = new EmbedBuilder()
                .setColor(guild?.members.me?.displayHexColor ?? null)
                .setTimestamp(Date.now())
                .setDescription(
                  `${bold('Constellations')}\n${constellations
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
                    new EmbedBuilder()
                      .setColor(guild?.members.me?.displayHexColor ?? null)
                      .setTimestamp(Date.now())
                      .setDescription(`${bold('• Outfits')}\n${outfitDesc}`)
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
                          name: '🔣 Type',
                          value: type,
                          inline: true,
                        },
                        {
                          name: '⭐ Rarity',
                          value: '⭐'.repeat(outfitRarity),
                          inline: true,
                        },
                        {
                          name: '💰 Price',
                          value: `${price} 💎`,
                          inline: true,
                        },
                      ]),
                );

                embeds.push(...outfitEmbed);
              }

              embeds = embeds.map((emb, index, array) =>
                emb.setFooter({
                  text: `${client.user.username} | Page ${index + 1} of ${
                    array.length
                  }`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                }),
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

            case 'weapon': {
              const nameQuery = options.getString('name');

              if (!nameQuery) {
                /** @type {{ data: String[] }} */
                const { data } = await axios.get(`${baseURL}/weapons`);

                const responses = data.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `Genshin Impact Weapon Lists (${data.length})`,
                    iconURL: getWikiaURL({
                      fileName: 'Genshin_Impact',
                      path: 'gensin-impact',
                    }),
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

              /** @type {{ data: import('../../constants/types').GenshinWeapon }} */
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
                .get(`${baseURL}/weapons/${paramCase(nameQuery)}`)
                .catch(async () => {
                  throw `No weapon found with name ${inlineCode(nameQuery)}.`;
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
                  { name: '🔣 Type', value: type, inline: true },
                  {
                    name: '⭐ Rarity',
                    value: '⭐'.repeat(rarity),
                    inline: true,
                  },
                  { name: '⚔️ Base ATK', value: `${baseAttack}`, inline: true },
                  {
                    name: '⚔️ Sub-stat Type',
                    value: subStat !== '-' ? subStat : italic('Unknown'),
                    inline: true,
                  },
                  { name: '📥 Obtaining', value: location, inline: true },
                  {
                    name: '⚔️ Passive',
                    value:
                      passiveName !== '-'
                        ? `${bold(passiveName)}${
                            passiveDesc || passiveDesc !== '-'
                              ? ` - ${passiveDesc}`
                              : ''
                          }`
                        : italic('None'),
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;

      case 'github':
        switch (options.getSubcommand()) {
          case 'user': {
            const username = options.getString('username', true);

            /** @type {{ data: import('../../constants/types').GithubUser }} */
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
              .catch(async () => {
                throw `No user found with username ${inlineCode(username)}.`;
              });

            embed
              .setAuthor({
                name: `${login}'s GitHub ${type} Account Info`,
                url: html_url,
                iconURL: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
              })
              .setDescription(bio)
              .setThumbnail(avatar_url)
              .setFields([
                {
                  name: '🔤 Account Name',
                  value: name ?? italic('Unknown'),
                  inline: true,
                },
                {
                  name: '🎊 Account Created',
                  value: time(
                    new Date(created_at),
                    TimestampStyles.RelativeTime,
                  ),
                  inline: true,
                },
                {
                  name: '📊 Stats',
                  value: `${count({
                    total: followers,
                    data: 'follower',
                  })} | ${count({
                    total: following,
                    data: 'following',
                  })} | ${count({
                    total: public_repos,
                    data: 'public repository',
                  })} | ${count({ total: public_gists, data: 'public gist' })}`,
                  inline: true,
                },
              ]);

            if (company) {
              embed.spliceFields(2, 0, {
                name: '🏢 Company',
                value: company,
                inline: true,
              });
            }

            if (blog) {
              embed.addFields([
                { name: '🌐 Website', value: blog, inline: true },
              ]);
            }

            if (twitter_username) {
              embed.addFields([
                {
                  name: '👤 Twitter Account',
                  value: hyperlink(
                    `@${twitter_username}`,
                    `https://twitter.com/${twitter_username}`,
                  ),
                  inline: true,
                },
              ]);
            }

            if (location) {
              embed.addFields([{ name: '📌 Address', value: location }]);
            }

            return interaction.editReply({ embeds: [embed] });
          }

          case 'repositories': {
            const name = options.getString('name', true);
            const language = options.getString('language');
            const sort = options.getString('sort');
            const order = options.getString('order');

            const query = new URLSearchParams({
              q: `${name}${language ? `+language:${language}` : ''}`,
            });

            if (sort) query.append('sort', sort);

            if (order) query.append('order', order);

            /** @type {{ data: { items: import('../../constants/types').GithubRepository[] } }} */
            const {
              data: { items },
            } = await axios.get(
              `https://api.github.com/search/repositories?${query}`,
            );

            if (!items.length) {
              throw `No repository found with name ${inlineCode(name)}.`;
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
                index,
                array,
              ) => {
                const newEmbed = new EmbedBuilder()
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(description)
                  .setThumbnail(owner.avatar_url)
                  .setAuthor({
                    name: 'GitHub Repository Search Results',
                    iconURL:
                      'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                  })
                  .setFields([
                    {
                      name: '🔤 Name',
                      value: hyperlink(
                        name,
                        html_url,
                        'Click here to view the repository.',
                      ),
                      inline: true,
                    },
                    {
                      name: '👑 Owner',
                      value: `${hyperlink(
                        `@${owner.login}`,
                        owner.html_url,
                        'Click here to view the account.',
                      )} (${owner.type})`,
                      inline: true,
                    },
                    {
                      name: '📆 Created At',
                      value: time(
                        new Date(created_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: '📆 Updated At',
                      value: time(
                        new Date(pushed_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: '🔤 Language',
                      value: language ?? italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📜 License',
                      value: license?.name ?? italic('None'),
                      inline: true,
                    },
                    {
                      name: '📊 Stats',
                      value: `⭐ ${count({
                        total: stargazers_count,
                        data: 'star',
                      })} | 👁️ ${count({
                        total: watchers_count,
                        data: 'watcher',
                      })} | 🕎 ${count({
                        total: forks_count,
                        data: 'fork',
                      })} | 🪲 ${count({
                        total: open_issues_count,
                        data: 'issue',
                      })}`,
                    },
                  ]);

                if (homepage) {
                  newEmbed.spliceFields(6, 0, {
                    name: '📖 Docs',
                    value: homepage,
                    inline: true,
                  });
                }

                if (topics.length) {
                  newEmbed.addFields([
                    { name: '🗂️ Topics', value: topics.join(', ') },
                  ]);
                }

                return newEmbed;
              },
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

      case 'minecraft':
        {
          const name = options.getString('name');

          const mcData = minecraftData('1.19');
          const minecraftLogo =
            'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png';

          const minecraftEdition = `Minecraft ${
            mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
          } Edition${
            mcData.version.minecraftVersion
              ? ` v${mcData.version.minecraftVersion}`
              : ''
          }`;

          switch (options.getSubcommand()) {
            case 'block': {
              if (!name) {
                const filteredMcData = mcData.blocksArray.filter(
                  (item, index, array) =>
                    array.findIndex(
                      (duplicate) => duplicate.displayName === item.displayName,
                    ) === index,
                );

                const responses = filteredMcData.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${item.displayName}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `${minecraftEdition} Block Lists (${filteredMcData.length})`,
                    iconURL: minecraftLogo,
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

              const block = {
                ...mcData.blocksByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.block[
                  getFormattedMinecraftName(snakeCase(name))
                ],
              };

              if (!Object.keys(block).length) {
                throw `No block found with name ${inlineCode(name)}.`;
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
                    name: '⛏️ Tool',
                    value:
                      block.material && block.material !== 'default'
                        ? capitalCase(
                            block.material.slice(
                              block.material.indexOf('/'),
                              block.material.length,
                            ),
                          )
                        : italic('None'),
                    inline: true,
                  },
                  {
                    name: '💪 Hardness',
                    value: block.hardness ?? italic('None'),
                    inline: true,
                  },
                  {
                    name: '🛡️ Blast Resistance',
                    value: block?.resistance ?? italic('None'),
                    inline: true,
                  },
                  {
                    name: '📦 Stackable',
                    value:
                      block.stackSize > 0 ? `Yes (${block.stackSize})` : 'No',
                    inline: true,
                  },
                  {
                    name: '🥃 Transparent',
                    value: block.transparent ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '🔦 Luminant',
                    value: block.luminant ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '🔥 Flammable',
                    value: block.flammable ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '🆕 Renewable',
                    value: block.renewable ? 'Yes' : 'No',
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'biome': {
              if (!name) {
                const responses = mcData.biomesArray.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${item.displayName}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `${minecraftEdition} Biome Lists (${mcData.biomesArray.length})`,
                    iconURL: minecraftLogo,
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

              const biome = {
                ...mcData.biomesByName[snakeCase(name)],
                ...extraMcData.biome[snakeCase(name)],
              };

              if (!Object.keys(biome).length) {
                throw `No biome found with name ${inlineCode(name)}.`;
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
                    name: '🌡️ Temperature',
                    value: `${biome.temperature}°`,
                    inline: true,
                  },
                  {
                    name: '🕳️ Dimension',
                    value: capitalCase(biome.dimension),
                    inline: true,
                  },
                  {
                    name: '🌧️ Rainfall',
                    value: `${biome.rainfall}`,
                    inline: true,
                  },
                  {
                    name: '🧱 Structures',
                    value: biome.structures
                      ? biome.structures
                          .map((structure) => capitalCase(structure))
                          .join(', ')
                      : italic('None'),
                  },
                  {
                    name: '🟫 Blocks',
                    value: biome.blocks
                      ? biome.blocks
                          .map((block) => capitalCase(block))
                          .join(', ')
                      : italic('None'),
                  },
                  {
                    name: '🎨 Colors',
                    value: biome.colors
                      ? Object.entries(biome.colors)
                          .map(
                            ([key, value]) =>
                              `${capitalCase(key)}: ${applyKeywordColor(
                                value,
                              )}`,
                          )
                          .join('\n')
                      : italic('Unknown'),
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'effect': {
              if (!name) {
                const responses = mcData.effectsArray.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${item.displayName}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `${minecraftEdition} Effect Lists (${mcData.effectsArray.length})`,
                    iconURL: minecraftLogo,
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

              const effect = {
                ...mcData.effectsByName[pascalCase(name)],
                ...extraMcData.effect[pascalCase(name)],
              };

              if (!Object.keys(effect).length) {
                throw `No effect found with name ${inlineCode(name)}.`;
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
                    name: '✨ Particle',
                    value: effect.particle
                      ? applyKeywordColor(effect.particle)
                      : italic('None'),
                    inline: true,
                  },
                  {
                    name: '🔣 Type',
                    value: effect.type === 'good' ? 'Positive' : 'Negative',
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'enchantment': {
              if (!name) {
                const responses = mcData.enchantmentsArray.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${item.displayName}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `${minecraftEdition} Enchantment Lists (${mcData.enchantmentsArray.length})`,
                    iconURL: minecraftLogo,
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

              const enchantment = {
                ...mcData.enchantmentsByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.enchantment[
                  getFormattedMinecraftName(snakeCase(name))
                ],
              };

              if (!Object.keys(enchantment).length) {
                throw `No enchantment found with name ${inlineCode(name)}.`;
              }

              embed
                .setDescription(enchantment.description)
                .setAuthor({ name: `🪧 ${enchantment.displayName}` })
                .setFields([
                  {
                    name: '✨ Maximum Level',
                    value: stringify(enchantment.maxLevel),
                    inline: true,
                  },
                  {
                    name: '🏴‍☠️ Treasure Only',
                    value: enchantment.treasureOnly ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '🤬 Curse',
                    value: enchantment.curse ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '🔍 Discoverable',
                    value: enchantment.discoverable ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '↔️ Tradeable',
                    value: enchantment.tradeable ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '⚖️ Weight',
                    value: `${enchantment.weight}`,
                    inline: true,
                  },
                  {
                    name: '🚫 Incompatible With',
                    value: enchantment.exclude.length
                      ? enchantment.exclude
                          .map((exc) => capitalCase(exc))
                          .join(', ')
                      : italic('None'),
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'entity': {
              if (!name) {
                const responses = mcData.entitiesArray.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${item.displayName}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `${minecraftEdition} Entity Lists (${mcData.entitiesArray.length})`,
                    iconURL: minecraftLogo,
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

                await pagination.render();
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
                throw `No entity found with name ${inlineCode(name)}.`;
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
                      name: '❤️ Health Points',
                      value: `${entity.hp} (❤️x${entity.hp / 2})`,
                      inline: true,
                    },
                    {
                      name: '🐣 Spawn',
                      value: entity.spawns
                        ? entity.spawns
                            .map((spawn) =>
                              !/^[A-Z|\d+]/.test(spawn)
                                ? capitalCase(spawn)
                                : spawn,
                            )
                            .join(', ')
                        : italic('Unknown'),
                    },
                    {
                      name: '⛏️ Usable Item',
                      value: entity.usableItems
                        ? entity.usableItems
                            .map((item) =>
                              capitalCase(item).replace(
                                /\b(a|the|an|and|or|but|in|on|of|it)\b/gi,
                                (word) => word.toLowerCase(),
                              ),
                            )
                            .join(', ')
                        : italic('None'),
                    },
                  ]);
                  break;

                case 'living':
                case 'projectile':
                case 'other':
                  if (entity.hp) {
                    embed.addFields([
                      {
                        name: '❤️ Health Points',
                        value: `${entity.hp} (❤️x${entity.hp / 2})`,
                        inline: true,
                      },
                    ]);
                  }

                  if (entity.stackSize) {
                    embed.addFields([
                      {
                        name: '📦 Stackable',
                        value:
                          entity.stackSize > 0
                            ? `Yes (${entity.stackSize})`
                            : 'No',
                        inline: true,
                      },
                    ]);
                  }

                  if (typeof entity.flammable !== 'undefined') {
                    embed.addFields([
                      {
                        name: '🔥 Flammable',
                        value: entity.flammable ? 'Yes' : 'No',
                        inline: true,
                      },
                    ]);
                  }

                  if (typeof entity.renewable !== 'undefined') {
                    embed.addFields([
                      {
                        name: '🆕 Renewable',
                        value: entity.renewable ? 'Yes' : 'No',
                        inline: true,
                      },
                    ]);
                  }
                  break;
              }

              return interaction.editReply({ embeds: [embed] });
            }

            case 'food': {
              if (!name) {
                const responses = mcData.foodsArray.map(
                  (item, index) =>
                    `${bold(`${index + 1}.`)} ${item.displayName}`,
                );

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({
                    name: `${minecraftEdition} Food Lists (${mcData.foodsArray.length})`,
                    iconURL: minecraftLogo,
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

                await pagination.render();
              }

              const food = {
                ...mcData.foodsByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.food[getFormattedMinecraftName(snakeCase(name))],
              };

              if (!Object.keys(food).length) {
                throw `No food found with name ${inlineCode(name)}.`;
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
                    name: '📦 Stackable',
                    value:
                      food.stackSize > 0 ? `Yes (${food.stackSize})` : 'No',
                    inline: true,
                  },
                  {
                    name: '🆕 Renewable',
                    value: food.renewable ? 'Yes' : 'No',
                    inline: true,
                  },
                  {
                    name: '❤️‍🩹 Restores',
                    value: `${food.foodPoints} (🍗x${food.foodPoints / 2})`,
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;

      case 'vtuber':
        {
          const holodex = new HolodexApiClient({
            apiKey: process.env.HOLODEX_API_KEY,
          });
          const affiliations = Object.values(vtuberAffiliation);

          switch (options.getSubcommand()) {
            case 'affiliation': {
              const affiliation = options.getString('affiliation');
              const sort = options.getString('sort');

              if (!affiliation) {
                const responses = affiliations
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(({ name }, index) => `${bold(`${index + 1}.`)} ${name}`);

                const pagination = new Pagination(interaction, { limit: 10 })
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setAuthor({ name: '🏢 VTuber Affiliation Lists' })
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

              const org = affiliations.find(
                (aff) => aff.name.toLowerCase() === affiliation.toLowerCase(),
              );

              if (!org) {
                throw `No affiliation found with name ${inlineCode(
                  affiliation,
                )} or maybe the data isn't available yet.`;
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

              const embeds = channels.map((item, index, array) => {
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

                return new EmbedBuilder()
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setThumbnail(photo ?? null)
                  .setAuthor({
                    name: `${
                      aff
                        ? aff.includes('Independents')
                          ? `🧑‍💻 ${aff.slice(0, -1)} Vtubers`
                          : aff
                        : ''
                    }'s YouTube Channel Lists`,
                    iconURL: aff?.logoURL,
                  })
                  .setFields([
                    {
                      name: '🔤 Name',
                      value: english_name || name,
                      inline: true,
                    },
                    {
                      name: '🔤 Channel Name',
                      value: `${hyperlink(
                        name,
                        `https://youtube.com/channel/${id}`,
                      )}${inactive ? ' (Inactive)' : ''}`,
                      inline: true,
                    },
                    {
                      name: '👥 Group',
                      value: group || italic('None'),
                      inline: true,
                    },
                    {
                      name: '🌐 Twitter',
                      value: twitter
                        ? hyperlink(
                            `@${twitter}`,
                            `https://twitter.com/${twitter}`,
                          )
                        : italic('None'),
                      inline: true,
                    },
                    {
                      name: '🔢 VOD Count',
                      value: video_count
                        ? count({ total: video_count, data: 'video' })
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 Subscriber Count',
                      value: subscriber_count
                        ? count({ total: subscriber_count, data: 'subscriber' })
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 Clip Count',
                      value: clip_count
                        ? count({ total: clip_count, data: 'video' })
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🗣️ Top Topic',
                      value: top_topics
                        ? top_topics
                            .map((topic) => transformCase(topic))
                            .join(', ')
                        : italic('None'),
                      inline: true,
                    },
                  ]);
              });

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

            case 'channel': {
              const id = options.getString('id', true);

              const item = await holodex.getChannel(id).catch(async () => {
                throw `No channel found with ID ${inlineCode(
                  id,
                )} or maybe the data isn't available yet.`;
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
                  name: `${org?.includes('Independents') ? '🧑‍💻 ' : ''}${
                    english_name || name
                  }'s YouTube Channel Information`,
                  iconURL: affiliations.find(
                    (aff) => aff.name.toLowerCase() === org?.toLowerCase(),
                  )?.logoURL,
                })
                .setFields([
                  {
                    name: '🔤 Channel Name',
                    value: `${hyperlink(
                      name,
                      `https://youtube.com/channel/${channelID}`,
                    )}${inactive ? ' (Inactive)' : ''}`,
                    inline: true,
                  },
                  {
                    name: '📆 Channel Created At',
                    value: published_at
                      ? time(
                          new Date(published_at),
                          TimestampStyles.RelativeTime,
                        )
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🏢 Affiliation',
                    value: org || italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '👥 Group',
                    value: suborg?.substring(2) || italic('None'),
                    inline: true,
                  },
                  {
                    name: '🌐 Twitter',
                    value: twitter
                      ? hyperlink(
                          `@${twitter}`,
                          `https://twitter.com/${twitter}`,
                        )
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 View Count',
                    value: view_count
                      ? count({ total: view_count, data: 'view' })
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 VOD Count',
                    value: video_count
                      ? count({ total: video_count, data: 'video' })
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 Subscriber Count',
                    value: subscriber_count
                      ? count({ total: subscriber_count, data: 'subscriber' })
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 Clip Count',
                    value: clip_count
                      ? count({ total: clip_count, data: 'video' })
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🗣️ Top Topics',
                    value: top_topics
                      ? top_topics
                          .map((topic) => transformCase(topic))
                          .join(', ')
                      : italic('None'),
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'clipper': {
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

                const embeds = channels.map((item, index, array) => {
                  const {
                    id,
                    inactive,
                    name,
                    photo,
                    subscriber_count,
                    twitter,
                    video_count,
                  } = item.toRaw();

                  return new EmbedBuilder()
                    .setColor(guild?.members.me?.displayHexColor ?? null)
                    .setTimestamp(Date.now())
                    .setFooter({
                      text: `${client.user.username} | Page ${index + 1} of ${
                        array.length
                      }`,
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setThumbnail(photo ?? null)
                    .setAuthor({
                      name: "✂️ VTuber Clipper's YouTube Channel Lists",
                    })
                    .setFields([
                      {
                        name: '🔤 Channel Name',
                        value: `${hyperlink(
                          name,
                          `https://youtube.com/channel/${id}`,
                        )}${inactive ? ' (Inactive)' : ''}`,
                        inline: true,
                      },
                      {
                        name: '🌐 Twitter',
                        value: twitter
                          ? hyperlink(
                              `@${twitter}`,
                              `https://twitter.com/${twitter}`,
                            )
                          : italic('None'),
                        inline: true,
                      },
                      {
                        name: '🔢 VOD Count',
                        value: video_count
                          ? count({ total: video_count, data: 'video' })
                          : italic('Unknown'),
                        inline: true,
                      },
                      {
                        name: '🔢 Subscriber Count',
                        value: subscriber_count
                          ? count({
                              total: subscriber_count,
                              data: 'subscriber',
                            })
                          : italic('Unknown'),
                        inline: true,
                      },
                    ]);
                });

                const pagination = new Pagination(interaction).setEmbeds(
                  embeds,
                );

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

              const item = await holodex
                .getChannel(channelID)
                .catch(async () => {
                  throw `No channel found with ID ${inlineCode(
                    channelID,
                  )} or maybe the data isn't available yet.`;
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
                .setAuthor({ name: `✂️ ${name}'s YouTube Channel Information` })
                .setFields([
                  {
                    name: '🔤 Channel Name',
                    value: `${hyperlink(
                      name,
                      `https://youtube.com/channel/${id}`,
                    )}${inactive ? ' (Inactive)' : ''}`,
                    inline: true,
                  },
                  {
                    name: '📆 Channel Created At',
                    value: published_at
                      ? time(
                          new Date(published_at),
                          TimestampStyles.RelativeTime,
                        )
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🌐 Twitter',
                    value: twitter
                      ? hyperlink(
                          `@${twitter}`,
                          `https://twitter.com/${twitter}`,
                        )
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 View Count',
                    value: view_count
                      ? count({ total: view_count, data: 'view' })
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 VOD Count',
                    value: video_count
                      ? count({ total: video_count, data: 'video' })
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🔢 Subscriber Count',
                    value: subscriber_count
                      ? count({ total: subscriber_count, data: 'subscriber' })
                      : italic('Unknown'),
                    inline: true,
                  },
                ]);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'live': {
              const channelID = options.getString('id');
              const affiliation = options.getString('affiliation');
              const sort = options.getString('sort') ?? 'live_viewers';

              const org = affiliations.find(
                (aff) => aff.name.toLowerCase() === affiliation?.toLowerCase(),
              );

              if (affiliation && !org) {
                throw `No affiliation found with name ${inlineCode(
                  affiliation,
                )} or maybe the data isn't available yet.`;
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
                  throw `No channel found with ID ${inlineCode(
                    channelID,
                  )} or maybe the channel doesn't live right now.`;
                }

                const embeds = videos.map((item, index, array) => {
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

                  return new EmbedBuilder()
                    .setColor(guild?.members.me?.displayHexColor ?? null)
                    .setTimestamp(Date.now())
                    .setFooter({
                      text: `${client.user.username} | Page ${index + 1} of ${
                        array.length
                      }`,
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
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
                        name: '🔤 Title',
                        value: hyperlink(
                          title,
                          `https://youtube.com/watch?v=${id}`,
                        ),
                        inline: true,
                      },
                      {
                        name: '📆 Published At',
                        value: published_at
                          ? time(
                              new Date(published_at),
                              TimestampStyles.RelativeTime,
                            )
                          : italic('Uknown'),
                        inline: true,
                      },
                      {
                        name: '📆 Streamed At',
                        value: time(
                          new Date(available_at),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: '🔢 Live Viewers Count',
                        value: `${live_viewers?.toLocaleString()} watching now`,
                        inline: true,
                      },
                      {
                        name: '🗣️ Topic',
                        value: topic_id
                          ? transformCase(topic_id)
                          : italic('Unknown'),
                        inline: true,
                      },
                      {
                        name: '🏢 Affiliation',
                        value: aff ?? italic('Unknown'),
                        inline: true,
                      },
                    ]);
                });

                const pagination = new Pagination(interaction).setEmbeds(
                  embeds,
                );

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

              const videos = await holodex.getLiveVideosByChannelId(channelID);

              if (!videos.length) {
                throw `No channel found with ID ${inlineCode(channelID)}.`;
              }

              const liveVideos = videos.filter(
                (video) => video.toRaw().status === VideoStatus.Live,
              );

              if (!liveVideos.length) {
                throw "Channel doesn't live right now.";
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
                    name: `${aff?.includes('Independents') ? '🧑‍💻' : ''} ${
                      english_name || name
                    }'s YouTube Stream Information`,
                    iconURL: affiliations.find(
                      (a) => a.name.toLowerCase() === aff?.toLowerCase(),
                    )?.logoURL,
                  })
                  .setFields([
                    {
                      name: '🔤 Title',
                      value: hyperlink(
                        title,
                        `https://youtube.com/watch?v=${id}`,
                      ),
                      inline: true,
                    },
                    {
                      name: '📆 Published At',
                      value: published_at
                        ? time(
                            new Date(published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📆 Streamed At',
                      value: time(
                        new Date(available_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: '🔢 Live Viewers Count',
                      value: `${live_viewers?.toLocaleString()} watching now`,
                      inline: true,
                    },
                    {
                      name: '🗣️ Topic',
                      value: topic_id
                        ? transformCase(topic_id)
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🏢 Affiliation',
                      value: aff ?? italic('Unknown'),
                      inline: true,
                    },
                  ]);

                return interaction.editReply({ embeds: [embed] });
              }

              const embeds = liveVideos.map((item, index, array) => {
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

                return new EmbedBuilder()
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
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
                      name: '🔤 Title',
                      value: hyperlink(
                        title,
                        `https://youtube.com/watch?v=${id}`,
                      ),
                      inline: true,
                    },
                    {
                      name: '📆 Published At',
                      value: published_at
                        ? time(
                            new Date(published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📆 Streamed At',
                      value: time(
                        new Date(available_at),
                        TimestampStyles.RelativeTime,
                      ),
                      inline: true,
                    },
                    {
                      name: '🔢 Live Viewers Count',
                      value: `${live_viewers?.toLocaleString()} watching now`,
                      inline: true,
                    },
                    {
                      name: '🗣️ Topic',
                      value: topic_id
                        ? transformCase(topic_id)
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🏢 Affiliation',
                      value: aff ?? italic('Unknown'),
                      inline: true,
                    },
                  ]);
              });

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

            case 'video': {
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
                throw `No channel found with ID ${inlineCode(
                  channelID,
                )} or maybe the channel doesn't have any video.`;
              }

              const embeds = videos.map((item, index, array) => {
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

                const newEmbed = new EmbedBuilder()
                  .setColor(guild?.members.me?.displayHexColor ?? null)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    description ? truncate(description, 4096) : null,
                  )
                  .setThumbnail(photo ?? null)
                  .setAuthor({
                    name: `${aff?.includes('Independents') ? '🧑‍💻' : ''} ${
                      english_name || name
                    }'s YouTube Video Lists`,
                    iconURL: affiliations.find(
                      (a) => a.name.toLowerCase() === aff?.toLowerCase(),
                    )?.logoURL,
                  })
                  .setFields([
                    {
                      name: '🔤 Title',
                      value: hyperlink(
                        title,
                        `https://youtube.com/watch?v=${id}`,
                      ),
                      inline: true,
                    },
                    {
                      name: '📊 Status',
                      value: capitalCase(
                        status === VideoStatus.Past ? 'archived' : status,
                      ),
                      inline: true,
                    },
                    {
                      name: '⏳ Duration',
                      value:
                        status !== VideoStatus.Upcoming
                          ? moment.duration(duration, 's').humanize()
                          : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📆 Published At',
                      value: published_at
                        ? time(
                            new Date(published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📆 Streamed At',
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
                      name: '🔢 Live Viewers Count',
                      value: `${live_viewers.toLocaleString()} watching now`,
                      inline: true,
                    },
                  ]);
                }

                return newEmbed;
              });

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
        }
        break;
    }

    switch (options.getSubcommand()) {
      case 'instagram': {
        const usernameQuery = options.getString('username', true).toLowerCase();
        const cleanUsername = usernameQuery.startsWith('@')
          ? usernameQuery.replace('@', '')
          : usernameQuery;

        /** @type {{ data: { result: import('../../constants/types').InstagramInfo } }} */
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
          )
          .catch(async () => {
            throw `No user found with username ${cleanUsername}.`;
          });

        embed
          .setDescription(bio || null)
          .setThumbnail(photo_profile)
          .setAuthor({
            name: 'Instagram Account Information',
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
          })
          .setFields([
            {
              name: '🔤 Username',
              value: hyperlink(
                username,
                `https://instagram.com/${username.replace('@', '')}`,
              ),
              inline: true,
            },
            {
              name: '🔤 Full Name',
              value: fullname || italic('None'),
              inline: true,
            },
            {
              name: '🔢 Posts Count',
              value: posts.toLocaleString(),
              inline: true,
            },
            {
              name: '🔢 Following',
              value: following.toLocaleString(),
              inline: true,
            },
            {
              name: '🔢 Followers',
              value: followers.toLocaleString(),
              inline: true,
            },
          ]);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'npm': {
        const nameQuery = options.getString('name', true);

        /** @type {{ data: import('../../constants/types').NPMPackage }} */
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
          .catch(async () => {
            throw `No package found with name ${inlineCode(nameQuery)}.`;
          });

        let maintainerArr = maintainers.map(
          ({ email, name: maintainerName }) =>
            `${bold('•')} ${maintainerName} (${email})`,
        );

        if (maintainerArr.length > 10) {
          const rest = maintainerArr.length - 10;

          maintainerArr = maintainerArr.slice(0, 10);
          maintainerArr.push(italic(`...and ${rest} more.`));
        }

        let versionArr =
          tags &&
          Object.entries(tags).map(
            ([key, value]) => `${bold('•')} ${key} (${value})`,
          );

        if (versionArr && versionArr.length > 10) {
          const rest = versionArr.length - 10;

          versionArr = versionArr.slice(0, 10);
          versionArr.push(italic(`...and ${rest} more.`));
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
          dependencies.push(italic(`...and ${rest} more.`));
        }

        const cleanedURL = repository.url?.replace('git+', '');

        embed.setAuthor({
          name: `${name}'s NPM Information`,
          url: homepage,
          iconURL:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/320px-Npm-logo.svg.png',
        });
        embed.setDescription(description);
        embed.setFields([
          {
            name: '👑 Author',
            value: author
              ? author.url
                ? hyperlink(
                    `${author.name}${author.email ? ` (${author.email})` : ''}`,
                  )
                : `${author.name}${author.email ? ` (${author.email})` : ''}`
              : italic('Unknown'),
            inline: true,
          },
          {
            name: '📆 Created At',
            value: time(new Date(created), TimestampStyles.RelativeTime),
            inline: true,
          },
          {
            name: '📆 Updated At',
            value: time(new Date(modified), TimestampStyles.RelativeTime),
            inline: true,
          },
          {
            name: '🔠 Keyword',
            value: keywords ? keywords.join(', ') : italic('Unknown'),
            inline: true,
          },
          {
            name: '📜 License',
            value: license ?? italic('Unknown'),
            inline: true,
          },
          {
            name: '🗄️ Repository',
            value: cleanedURL
              ? cleanedURL.startsWith('git://')
                ? cleanedURL.replace('git://', 'https://').replace('.git', '')
                : [...cleanedURL].slice(0, cleanedURL.lastIndexOf('.')).join('')
              : italic('Unknown'),
            inline: true,
          },
          { name: '🧑‍💻 Maintainer', value: maintainerArr.join('\n') },
          {
            name: '🔖 Version',
            value: versionArr ? versionArr.join('\n') : italic('Unknown'),
          },
          {
            name: '📦 Dependency',
            value:
              dependencies && dependencies.length
                ? dependencies.join('\n')
                : italic('None'),
          },
        ]);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'weather': {
        const locationTarget = options.getString('location', true);

        return weather.find(
          { search: locationTarget, degreeType: 'C' },
          /**
           *
           * @param {Error} err
           * @param {import('../../constants/types').Weather[]} result
           */
          async (err, result) => {
            if (err) throw err;

            if (!result.length) {
              throw `No information found in ${inlineCode(locationTarget)}.`;
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
                name: `🌦️ ${name} Weather Information`,
              })
              .setFields([
                {
                  name: '🌡️ Temperature',
                  value: `${temperature}°${degreetype}`,
                  inline: true,
                },
                { name: '💧 Humidity', value: `${humidity}%`, inline: true },
                { name: '💨 Wind', value: winddisplay, inline: true },
                {
                  name: '📊 Status',
                  value: `${day} ${observationtime.slice(
                    0,
                    observationtime.length - 3,
                  )} (${skytext})`,
                  inline: true,
                },
                {
                  name: '📈 Forecast',
                  value: forecast
                    .map(
                      ({ day: forecastDay, high, low, precip, skytextday }) =>
                        `${bold(
                          forecastDay,
                        )}\nStatus: ${skytextday}\nRange: ${low}°${degreetype} - ${high}°${degreetype}\nPrecipitation: ${
                          !precip ? italic('Unknown') : `${precip}%`
                        }`,
                    )
                    .join('\n\n'),
                },
              ]);

            return interaction.editReply({ embeds: [embed] });
          },
        );
      }
    }
  },
};
