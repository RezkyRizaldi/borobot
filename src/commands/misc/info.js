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
const pluralize = require('pluralize');
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

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommandGroup()) {
      case 'covid':
        {
          const baseURL = 'https://covid19.mathdro.id/api';

          switch (options.getSubcommand()) {
            case 'latest':
              return axios
                .get(
                  `${baseURL}/daily/${moment(Date.now())
                    .subtract(2, 'd')
                    .format('M-DD-YYYY')}`,
                )
                .then(
                  /**
                   *
                   * @param {{ data: import('../../constants/types').CovidLatest[] }}
                   */
                  async ({ data }) => {
                    await interaction.deferReply().then(async () => {
                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const embeds = data.map((item, index, array) =>
                        new EmbedBuilder()
                          .setColor(guild?.members.me?.displayHexColor ?? null)
                          .setTimestamp(Date.now())
                          .setFooter({
                            text: `${client.user.username} | Page ${
                              index + 1
                            } of ${array.length}`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setThumbnail(`${baseURL}/og`)
                          .setAuthor({
                            name: '🦠 Covid-19 Latest Cases',
                          })
                          .setFields([
                            {
                              name: '🌏 Country',
                              value: item.countryRegion,
                              inline: true,
                            },
                            {
                              name: '🗾 Province/State',
                              value:
                                !item.provinceState ||
                                item.provinceState === 'Unknown'
                                  ? italic('Unknown')
                                  : item.provinceState,
                              inline: true,
                            },
                            {
                              name: '📆 Last Updated',
                              value: time(
                                new Date(item.lastUpdate),
                                TimestampStyles.RelativeTime,
                              ),
                              inline: true,
                            },
                            {
                              name: '✅ Confirmed',
                              value: `${Number(
                                item.confirmed,
                              ).toLocaleString()} ${pluralize(
                                'case',
                                Number(item.confirmed),
                              )}`,
                              inline: true,
                            },
                            {
                              name: '☠️ Deaths',
                              value: `${Number(
                                item.deaths,
                              ).toLocaleString()} ${pluralize(
                                'death',
                                Number(item.deaths),
                              )}`,
                              inline: true,
                            },
                            {
                              name: '⚖️ Case Fatality Ratio',
                              value: Number(item.caseFatalityRatio).toFixed(2),
                              inline: true,
                            },
                          ]),
                      );

                      const pagination = new Pagination(interaction);

                      pagination.setEmbeds(embeds);

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
                    });
                  },
                );

            case 'list':
              return axios.get(`${baseURL}/countries`).then(
                /**
                 *
                 * @param {{ data: { countries: import('../../constants/types').CovidCountry[] } }}
                 */
                async ({ data: { countries } }) => {
                  await interaction.deferReply().then(async () => {
                    const responses = countries.map(
                      ({ name }, index) => `${bold(`${index + 1}.`)} ${name}`,
                    );

                    const pagination = new Pagination(interaction, {
                      limit: 10,
                    });

                    pagination.setColor(
                      guild?.members.me?.displayHexColor ?? null,
                    );
                    pagination.setTimestamp(Date.now());
                    pagination.setFooter({
                      text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                      iconURL: client.user.displayAvatarURL({
                        dynamic: true,
                      }),
                    });
                    pagination.setAuthor({
                      name: '🌏 Covid-19 Country Lists',
                    });
                    pagination.setDescriptions(responses);

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
                  });
                },
              );

            case 'country': {
              const name = options.getString('name');

              if (!name) {
                return axios.get(`${baseURL}/confirmed`).then(
                  /**
                   *
                   * @param {{ data: import('../../constants/types').CovidConfirmed[] }}
                   */
                  async ({ data }) =>
                    await interaction.deferReply().then(async () => {
                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const embeds = data.map((item, index, array) =>
                        new EmbedBuilder()
                          .setColor(guild?.members.me?.displayHexColor ?? null)
                          .setTimestamp(Date.now())
                          .setFooter({
                            text: `${client.user.username} | Page ${
                              index + 1
                            } of ${array.length}`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setThumbnail(
                            `${baseURL}/countries/${encodeURIComponent(
                              item.countryRegion,
                            )}/og`,
                          )
                          .setAuthor({
                            name: '🦠 Covid-19 Confirmed Cases',
                          })
                          .setFields([
                            {
                              name: '🌏 Country',
                              value: item.countryRegion,
                              inline: true,
                            },
                            {
                              name: '🗾 Province/State',
                              value:
                                !item.provinceState ||
                                item.provinceState === 'Unknown'
                                  ? italic('Unknown')
                                  : item.provinceState,
                              inline: true,
                            },
                            {
                              name: '📆 Last Updated',
                              value: time(
                                new Date(item.lastUpdate),
                                TimestampStyles.RelativeTime,
                              ),
                              inline: true,
                            },
                            {
                              name: '✅ Confirmed',
                              value: `${item.confirmed.toLocaleString()} ${pluralize(
                                'case',
                                item.confirmed,
                              )}${
                                item.cases28Days
                                  ? ` (${item.cases28Days.toLocaleString()} ${pluralize(
                                      'case',
                                      item.cases28Days,
                                    )}/month)`
                                  : ''
                              }`,
                              inline: true,
                            },
                            {
                              name: '☠️ Deaths',
                              value: `${item.deaths.toLocaleString()} ${pluralize(
                                'death',
                                item.deaths,
                              )}${
                                item.deaths28Days
                                  ? ` (${item.deaths28Days.toLocaleString()} ${pluralize(
                                      'death',
                                      item.deaths28Days,
                                    )}/month)`
                                  : ''
                              }`,
                              inline: true,
                            },
                            {
                              name: '📋 Incident Rate',
                              value: item.incidentRate
                                ? `${Math.floor(
                                    item.incidentRate,
                                  ).toLocaleString()} ${pluralize(
                                    'case',
                                    item.incidentRate,
                                  )}/day`
                                : italic('Unknown'),
                              inline: true,
                            },
                          ]),
                      );

                      const pagination = new Pagination(interaction);

                      pagination.setEmbeds(embeds);

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
                    }),
                );
              }

              const country = await axios.get(`${baseURL}/countries`).then(
                /**
                 *
                 * @param {{ data: { countries: import('../../constants/types').CovidCountry[] } }}
                 */
                async ({ data: { countries } }) =>
                  countries.find(
                    (item) => item.name.toLowerCase() === name.toLowerCase(),
                  ).name,
              );

              return axios
                .get(`${baseURL}/countries/${country}/confirmed`)
                .then(
                  /**
                   *
                   * @param {{ data: import('../../constants/types').CovidConfirmed[] }}
                   */
                  async ({ data }) => {
                    if (!data.length) {
                      return interaction.deferReply({ ephemeral: true }).then(
                        async () =>
                          await interaction.editReply({
                            content: `No information found in ${inlineCode(
                              name,
                            )}.`,
                          }),
                      );
                    }

                    if (data.length === 1) {
                      return interaction.deferReply().then(async () => {
                        await wait(4000);

                        embed.setThumbnail(
                          `${baseURL}/countries/${data[0].countryRegion}/og`,
                        );
                        embed.setAuthor({
                          name: `🦠 Covid-19 Confirmed Cases in ${data[0].countryRegion}`,
                        });
                        embed.setFields([
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
                            value: `${data[0].confirmed.toLocaleString()} ${pluralize(
                              'case',
                              data[0].confirmed,
                            )}${
                              data[0].cases28Days
                                ? ` (${data[0].cases28Days.toLocaleString()} ${pluralize(
                                    'case',
                                    data[0].cases28Days,
                                  )}/month)`
                                : ''
                            }`,
                            inline: true,
                          },
                          {
                            name: '🔴 Active',
                            value: data[0].active
                              ? `${data[0].active.toLocaleString()} ${pluralize(
                                  'case',
                                  data[0].active,
                                )}`
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '☠️ Deaths',
                            value: `${data[0].deaths.toLocaleString()} ${pluralize(
                              'death',
                              data[0].deaths,
                            )}${
                              data[0].deaths28Days
                                ? ` (${data[0].deaths28Days.toLocaleString()} ${pluralize(
                                    'death',
                                    data[0].deaths28Days,
                                  )}/month)`
                                : ''
                            }`,
                            inline: true,
                          },
                          {
                            name: '📋 Incident Rate',
                            value: data[0].incidentRate
                              ? `${Math.floor(
                                  data[0].incidentRate,
                                ).toLocaleString()} ${pluralize(
                                  'case',
                                  data[0].incidentRate,
                                )}/day`
                              : italic('Unknown'),
                            inline: true,
                          },
                        ]);

                        await interaction.editReply({ embeds: [embed] });
                      });
                    }

                    await interaction.deferReply().then(async () => {
                      await wait(4000);

                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const embeds = data.map((item, index, array) =>
                        new EmbedBuilder()
                          .setColor(guild?.members.me?.displayHexColor ?? null)
                          .setTimestamp(Date.now())
                          .setFooter({
                            text: `${client.user.username} | Page ${
                              index + 1
                            } of ${array.length}`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setThumbnail(
                            `${baseURL}/countries/${item.countryRegion}/og`,
                          )
                          .setAuthor({
                            name: `🦠 Covid-19 Confirmed Cases in ${item.countryRegion}`,
                          })
                          .setFields([
                            {
                              name: '🗾 Province/State',
                              value:
                                !item.provinceState ||
                                item.provinceState === 'Unknown'
                                  ? italic('Unknown')
                                  : item.provinceState,
                              inline: true,
                            },
                            {
                              name: '📆 Last Updated',
                              value: time(
                                new Date(item.lastUpdate),
                                TimestampStyles.RelativeTime,
                              ),
                              inline: true,
                            },
                            {
                              name: '✅ Confirmed',
                              value: `${item.confirmed.toLocaleString()} ${pluralize(
                                'case',
                                item.confirmed,
                              )}${
                                item.cases28Days
                                  ? ` (${item.cases28Days.toLocaleString()} ${pluralize(
                                      'case',
                                      item.cases28Days,
                                    )}/month)`
                                  : ''
                              }`,
                              inline: true,
                            },
                            {
                              name: '🔴 Active',
                              value: item.active
                                ? `${item.active.toLocaleString()} ${pluralize(
                                    'case',
                                    item.active,
                                  )}`
                                : italic('Unknown'),
                              inline: true,
                            },
                            {
                              name: '☠️ Deaths',
                              value: `${item.deaths.toLocaleString()} ${pluralize(
                                'death',
                                item.deaths,
                              )}${
                                item.deaths28Days
                                  ? ` (${item.deaths28Days.toLocaleString()} ${pluralize(
                                      'death',
                                      item.deaths28Days,
                                    )}/month)`
                                  : ''
                              }`,
                              inline: true,
                            },
                            {
                              name: '📋 Incident Rate',
                              value: item.incidentRate
                                ? `${Math.floor(
                                    item.incidentRate,
                                  ).toLocaleString()} ${pluralize(
                                    'case',
                                    item.incidentRate,
                                  )}/day`
                                : italic('Unknown'),
                              inline: true,
                            },
                          ]),
                      );

                      const pagination = new Pagination(interaction);

                      pagination.setEmbeds(embeds);

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
                    });
                  },
                );
            }
          }
        }
        break;

      case 'genshin': {
        const baseURL = 'https://api.genshin.dev';

        switch (options.getSubcommand()) {
          case 'artifact': {
            const name = options.getString('name');

            if (!name) {
              return interaction.deferReply().then(
                async () =>
                  await axios.get(`${baseURL}/artifacts`).then(
                    /**
                     *
                     * @param {{ data: String[] }}
                     */
                    async ({ data }) => {
                      const responses = data.map(
                        (item, index) =>
                          `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                      );

                      const pagination = new Pagination(interaction, {
                        limit: 10,
                      });

                      pagination.setColor(
                        guild?.members.me?.displayHexColor ?? null,
                      );
                      pagination.setTimestamp(Date.now());
                      pagination.setFooter({
                        text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      });
                      pagination.setAuthor({
                        name: `Genshin Impact Artifact Lists (${data.length})`,
                        iconURL: getWikiaURL({
                          fileName: 'Genshin_Impact',
                          path: 'gensin-impact',
                        }),
                      });
                      pagination.setDescriptions(responses);

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
                    },
                  ),
              );
            }

            return axios
              .get(`${baseURL}/artifacts/${paramCase(name)}`)
              .then(
                /**
                 *
                 * @param {{ data: import('../../constants/types').GenshinArtifact }}
                 */
                async ({ data }) => {
                  embed.setThumbnail(
                    getWikiaURL({
                      fileName: 'Icon_Inventory_Artifacts',
                      path: 'gensin-impact',
                    }),
                  );
                  embed.setAuthor({
                    name: `🛡️ ${data.name}`,
                  });
                  embed.setFields([
                    {
                      name: '⭐ Rarity',
                      value:
                        data.max_rarity > 1
                          ? `1-${data.max_rarity} ⭐`
                          : `${data.max_rarity} ⭐`,
                    },
                  ]);

                  if (data['1-piece_bonus']) {
                    embed.addFields([
                      {
                        name: '🎁 1-piece Bonus',
                        value: data['1-piece_bonus'],
                      },
                    ]);
                  }

                  if (data['2-piece_bonus']) {
                    embed.addFields([
                      {
                        name: '🎁 2-piece Bonus',
                        value: data['2-piece_bonus'],
                      },
                    ]);
                  }

                  if (data['3-piece_bonus']) {
                    embed.addFields([
                      {
                        name: '🎁 3-piece Bonus',
                        value: data['3-piece_bonus'],
                      },
                    ]);
                  }

                  if (data['4-piece_bonus']) {
                    embed.addFields([
                      {
                        name: '🎁 4-piece Bonus',
                        value: data['4-piece_bonus'],
                      },
                    ]);
                  }

                  if (data['5-piece_bonus']) {
                    embed.addFields([
                      {
                        name: '🎁 5-piece Bonus',
                        value: data['5-piece_bonus'],
                      },
                    ]);
                  }

                  await interaction
                    .deferReply()
                    .then(
                      async () =>
                        await interaction.editReply({ embeds: [embed] }),
                    );
                },
              )
              .catch(async (err) => {
                console.error(err);

                if (err.response?.status === 404) {
                  await interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: `No character found with name ${inlineCode(
                          name,
                        )}.`,
                      }),
                  );
                }
              });
          }

          case 'character': {
            const name = options.getString('name');
            const detailed = options.getBoolean('detailed') ?? false;

            if (!name) {
              return interaction.deferReply().then(
                async () =>
                  await axios.get(`${baseURL}/characters`).then(
                    /**
                     *
                     * @param {{ data: String[] }}
                     */
                    async ({ data }) => {
                      const responses = data.map(
                        (item, index) =>
                          `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                      );

                      const pagination = new Pagination(interaction, {
                        limit: 10,
                      });

                      pagination.setColor(
                        guild?.members.me?.displayHexColor ?? null,
                      );
                      pagination.setTimestamp(Date.now());
                      pagination.setFooter({
                        text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      });
                      pagination.setAuthor({
                        name: `Genshin Impact Character Lists (${data.length})`,
                        iconURL: getWikiaURL({
                          fileName: 'Genshin_Impact',
                          path: 'gensin-impact',
                        }),
                      });
                      pagination.setDescriptions(responses);

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
                    },
                  ),
              );
            }

            return axios
              .get(`${baseURL}/characters/${getFormattedParam(name)}`)
              .then(
                /**
                 *
                 * @param {{ data: import('../../constants/types').GenshinCharacter }}
                 */
                async ({ data }) => {
                  const formattedName =
                    data.name === 'Ayato' ? 'Kamisato Ayato' : data.name;

                  embed.setDescription(data.description || null);
                  embed.setThumbnail(
                    getWikiaURL({
                      fileName: `Character_${formattedName}_Thumb`,
                      path: 'gensin-impact',
                    }),
                  );
                  embed.setAuthor({
                    name: `👤 ${formattedName}`,
                  });
                  embed.setFields([
                    {
                      name: '🔤 Title',
                      value: data.title || italic('None'),
                      inline: true,
                    },
                    {
                      name: '🪄 Vision',
                      value: data.vision,
                      inline: true,
                    },
                    {
                      name: '🗡️ Weapon',
                      value: data.weapon,
                      inline: true,
                    },
                    {
                      name: '🗺️ Nation',
                      value:
                        data.nation === 'Unknown'
                          ? italic('Unknown')
                          : data.nation,
                      inline: true,
                    },
                    {
                      name: '🏰 Affiliation',
                      value:
                        data.affiliation === 'Not affilated to any Nation'
                          ? italic('None')
                          : data.affiliation,
                      inline: true,
                    },
                    {
                      name: '⭐ Rarity',
                      value: '⭐'.repeat(data.rarity),
                      inline: true,
                    },
                    {
                      name: '✨ Constellation',
                      value: data.constellation,
                      inline: true,
                    },
                    {
                      name: '🎂 Birthday',
                      value: data.birthday
                        ? moment(data.birthday).format('MMMM Do')
                        : italic('Unknown'),
                      inline: true,
                    },
                  ]);

                  if (data.specialDish) {
                    embed.addFields([
                      {
                        name: '🍽️ Special Dish',
                        value: data.specialDish,
                        inline: true,
                      },
                    ]);
                  }

                  if (detailed) {
                    const pagination = new Pagination(interaction);

                    const activeTalentEmbed = new EmbedBuilder()
                      .setColor(guild?.members.me?.displayHexColor ?? null)
                      .setTimestamp(Date.now())
                      .setDescription(
                        `${bold('Active Talents')}\n${data.skillTalents
                          .map(
                            (skill) =>
                              `${
                                skill.name
                                  ? `${bold(`• ${skill.name}`)} (${
                                      skill.unlock
                                    })`
                                  : `${bold(`• ${skill.unlock}`)}`
                              }${
                                skill.description
                                  ? `\n${skill.description
                                      .replace(/\n\n/g, '\n')
                                      .replace(/\n$/, '')}`
                                  : ''
                              }${
                                skill.upgrades
                                  ? `\n${bold('- Attributes')}\n${skill.upgrades
                                      .map(
                                        (upgrade) =>
                                          `${upgrade.name}: ${upgrade.value}`,
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
                      .setAuthor({
                        name: `👤 ${formattedName}`,
                      });

                    const passiveTalentEmbed = new EmbedBuilder()
                      .setColor(guild?.members.me?.displayHexColor ?? null)
                      .setTimestamp(Date.now())
                      .setDescription(
                        `${bold('Passive Talents')}\n${data.passiveTalents
                          .map(
                            (skill) =>
                              `${bold(`• ${skill.name}`)} (${
                                skill.unlock
                              })\n${skill.description.replace(/\n\n/g, '\n')}`,
                          )
                          .join('\n\n')}`,
                      )
                      .setThumbnail(
                        getWikiaURL({
                          fileName: `Character_${formattedName}_Thumb`,
                          path: 'gensin-impact',
                        }),
                      )
                      .setAuthor({
                        name: `👤 ${formattedName}`,
                      });

                    const constellationEmbed = new EmbedBuilder()
                      .setColor(guild?.members.me?.displayHexColor ?? null)
                      .setTimestamp(Date.now())
                      .setDescription(
                        `${bold('Constellations')}\n${data.constellations
                          .map(
                            (skill) =>
                              `${bold(`• ${skill.name}`)} (${
                                skill.unlock
                              })\n${skill.description.replace(/\n\n/g, '\n')}`,
                          )
                          .join('\n\n')}`,
                      )
                      .setThumbnail(
                        getWikiaURL({
                          fileName: `Character_${formattedName}_Thumb`,
                          path: 'gensin-impact',
                        }),
                      )
                      .setAuthor({
                        name: `👤 ${formattedName}`,
                      });

                    let embeds = [
                      embed,
                      activeTalentEmbed,
                      passiveTalentEmbed,
                      constellationEmbed,
                    ];

                    if (data.outfits) {
                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const outfitEmbed = data.outfits.map((outfit) =>
                        new EmbedBuilder()
                          .setColor(guild?.members.me?.displayHexColor ?? null)
                          .setTimestamp(Date.now())
                          .setDescription(
                            `${bold('• Outfits')}\n${outfit.description}`,
                          )
                          .setThumbnail(
                            getWikiaURL({
                              fileName: `Character_${formattedName}_Thumb`,
                              path: 'gensin-impact',
                            }),
                          )
                          .setImage(
                            getWikiaURL({
                              fileName: `Outfit_${outfit.name}_Thumb`,
                              path: 'gensin-impact',
                            }),
                          )
                          .setAuthor({
                            name: `👤 ${formattedName}`,
                          })
                          .setFields([
                            {
                              name: '🔣 Type',
                              value: outfit.type,
                              inline: true,
                            },
                            {
                              name: '⭐ Rarity',
                              value: '⭐'.repeat(outfit.rarity),
                              inline: true,
                            },
                            {
                              name: '💰 Price',
                              value: `${outfit.price} 💎`,
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
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      }),
                    );

                    pagination.setEmbeds(embeds);

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

                  await interaction
                    .deferReply()
                    .then(
                      async () =>
                        await interaction.editReply({ embeds: [embed] }),
                    );
                },
              )
              .catch(async (err) => {
                console.error(err);

                if (err.response?.status === 404) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: `No character found with name ${inlineCode(
                          name,
                        )}.`,
                      }),
                  );
                }
              });
          }

          case 'weapon': {
            const name = options.getString('name');

            if (!name) {
              return interaction.deferReply().then(
                async () =>
                  await axios.get(`${baseURL}/weapons`).then(
                    /**
                     *
                     * @param {{ data: String[] }}
                     */
                    async ({ data }) => {
                      const responses = data.map(
                        (item, index) =>
                          `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                      );

                      const pagination = new Pagination(interaction, {
                        limit: 10,
                      });

                      pagination.setColor(
                        guild.members.me
                          ? guild.members.me?.displayHexColor ?? null
                          : null,
                      );
                      pagination.setTimestamp(Date.now());
                      pagination.setFooter({
                        text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      });
                      pagination.setAuthor({
                        name: `Genshin Impact Weapon Lists (${data.length})`,
                        iconURL: getWikiaURL({
                          fileName: 'Genshin_Impact',
                          path: 'gensin-impact',
                        }),
                      });
                      pagination.setDescriptions(responses);

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
                    },
                  ),
              );
            }

            return axios
              .get(`${baseURL}/weapons/${paramCase(name)}`)
              .then(
                /**
                 *
                 * @param {{ data: import('../../constants/types').GenshinWeapon }}
                 */
                async ({ data }) => {
                  embed.setThumbnail(
                    getWikiaURL({
                      fileName: `Weapon_${data.name}`,
                      path: 'gensin-impact',
                    }),
                  );
                  embed.setAuthor({
                    name: `🗡️ ${data.name}`,
                  });
                  embed.setFields([
                    {
                      name: '🔣 Type',
                      value: data.type,
                      inline: true,
                    },
                    {
                      name: '⭐ Rarity',
                      value: '⭐'.repeat(data.rarity),
                      inline: true,
                    },
                    {
                      name: '⚔️ Base ATK',
                      value: `${data.baseAttack}`,
                      inline: true,
                    },
                    {
                      name: '⚔️ Sub-stat Type',
                      value:
                        data.subStat !== '-' ? data.subStat : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📥 Obtaining',
                      value: data.location,
                      inline: true,
                    },
                    {
                      name: '⚔️ Passive',
                      value:
                        data.passiveName !== '-'
                          ? `${bold(data.passiveName)}${
                              data.passiveDesc || data.passiveDesc !== '-'
                                ? ` - ${data.passiveDesc}`
                                : ''
                            }`
                          : italic('None'),
                    },
                  ]);

                  await interaction
                    .deferReply()
                    .then(
                      async () =>
                        await interaction.editReply({ embeds: [embed] }),
                    );
                },
              )
              .catch(async (err) => {
                console.error(err);

                if (err.response?.status === 404) {
                  await interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: `No character found with name ${inlineCode(
                          name,
                        )}.`,
                      }),
                  );
                }
              });
          }
        }
        break;
      }

      case 'github':
        switch (options.getSubcommand()) {
          case 'user': {
            const username = options.getString('username', true);

            return axios
              .get(`https://api.github.com/users/${username}`)
              .then(
                /**
                 *
                 * @param {{ data: import('../../constants/types').GithubUser }}
                 */
                async ({ data }) =>
                  await interaction.deferReply().then(async () => {
                    embed.setAuthor({
                      name: `${data.login}'s GitHub ${data.type} Account Info`,
                      url: data.html_url,
                      iconURL:
                        'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                    });
                    embed.setDescription(data.bio);
                    embed.setThumbnail(data.avatar_url);
                    embed.setFields([
                      {
                        name: '🔤 Account Name',
                        value: data.name ?? italic('Unknown'),
                        inline: true,
                      },
                      {
                        name: '🎊 Account Created',
                        value: time(
                          new Date(data.created_at),
                          TimestampStyles.RelativeTime,
                        ),
                        inline: true,
                      },
                      {
                        name: '📊 Stats',
                        value: `${data.followers.toLocaleString()} ${pluralize(
                          'follower',
                          data.followers,
                        )} | ${data.following.toLocaleString()} ${pluralize(
                          'following',
                          data.following,
                        )} | ${data.public_repos.toLocaleString()} ${pluralize(
                          'public repository',
                          data.public_repos,
                        )} | ${data.public_gists.toLocaleString()} ${pluralize(
                          'public gists',
                          data.public_gists,
                        )}`,
                        inline: true,
                      },
                    ]);

                    if (data.company) {
                      embed.spliceFields(2, 0, {
                        name: '🏢 Company',
                        value: data.company,
                        inline: true,
                      });
                    }

                    if (data.blog) {
                      embed.addFields([
                        {
                          name: '🌐 Website',
                          value: data.blog,
                          inline: true,
                        },
                      ]);
                    }

                    if (data.twitter_username) {
                      embed.addFields([
                        {
                          name: '👤 Twitter Account',
                          value: hyperlink(
                            `@${data.twitter_username}`,
                            `https://twitter.com/${data.twitter_username}`,
                          ),
                          inline: true,
                        },
                      ]);
                    }

                    if (data.location) {
                      embed.addFields([
                        {
                          name: '📌 Address',
                          value: data.location,
                        },
                      ]);
                    }

                    await interaction.editReply({ embeds: [embed] });
                  }),
              )
              .catch(async (err) => {
                console.error(err);

                if (err.response.status === 404) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: `No user found with username ${inlineCode(
                          username,
                        )}.`,
                      }),
                  );
                }
              });
          }

          case 'repositories': {
            const name = options.getString('name', true);
            const language = options.getString('language');
            const sort = options.getString('sort');
            const order = options.getString('order');

            const query = new URLSearchParams({
              q: `${name}${language ? `+language:${language}` : ''}`,
            });

            if (sort) {
              query.append('sort', sort);
            }

            if (order) {
              query.append('order', order);
            }

            return axios
              .get(`https://api.github.com/search/repositories?${query}`)
              .then(
                /**
                 *
                 * @param {{ data: { items: import('../../constants/types').GithubRepository[] } }}
                 */
                async ({ data: { items } }) => {
                  if (!items.length) {
                    return interaction.deferReply({ ephemeral: true }).then(
                      async () =>
                        await interaction.editReply({
                          content: `No repository found with name ${inlineCode(
                            name,
                          )}`,
                        }),
                    );
                  }

                  await interaction.deferReply().then(async () => {
                    /** @type {import('discord.js').EmbedBuilder[]} */
                    const embeds = items.map((item, index, array) => {
                      const newEmbed = new EmbedBuilder()
                        .setColor(guild?.members.me?.displayHexColor ?? null)
                        .setTimestamp(Date.now())
                        .setFooter({
                          text: `${client.user.username} | Page ${
                            index + 1
                          } of ${array.length}`,
                          iconURL: client.user.displayAvatarURL({
                            dynamic: true,
                          }),
                        })
                        .setThumbnail(item.owner?.avatar_url ?? null)
                        .setAuthor({
                          name: 'GitHub Repository Search Results',
                          iconURL:
                            'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                        })
                        .setFields([
                          {
                            name: '🔤 Name',
                            value: hyperlink(
                              item.name,
                              item.html_url,
                              'Click here to view the repository.',
                            ),
                            inline: true,
                          },
                          {
                            name: '👑 Owner',
                            value: `${hyperlink(
                              `@${item.owner.login}`,
                              item.owner.html_url,
                              'Click here to view the account.',
                            )} (${item.owner.type})`,
                            inline: true,
                          },
                          {
                            name: '📆 Created At',
                            value: time(
                              new Date(item.created_at),
                              TimestampStyles.RelativeTime,
                            ),
                            inline: true,
                          },
                          {
                            name: '📆 Updated At',
                            value: time(
                              new Date(item.pushed_at),
                              TimestampStyles.RelativeTime,
                            ),
                            inline: true,
                          },
                          {
                            name: '🔤 Language',
                            value: item?.language ?? italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '📜 License',
                            value: item.license?.name ?? italic('None'),
                            inline: true,
                          },
                          {
                            name: '📊 Stats',
                            value: `⭐ ${item.stargazers_count.toLocaleString()} ${pluralize(
                              'star',
                              item.stargazers_count,
                            )} | 👁️ ${item.watchers_count.toLocaleString()} ${pluralize(
                              'watcher',
                              item.watchers_count,
                            )} | 🕎 ${item.forks_count.toLocaleString()} ${pluralize(
                              'fork',
                              item.forks_count,
                            )} | 🪲 ${item.open_issues_count.toLocaleString()} ${pluralize(
                              'issue',
                              item.open_issues_count,
                            )}`,
                          },
                        ]);

                      if (item.homepage) {
                        newEmbed.spliceFields(6, 0, {
                          name: '📖 Docs',
                          value: item.homepage,
                          inline: true,
                        });
                      }

                      if (item.topics.length) {
                        newEmbed.addFields([
                          {
                            name: '🗂️ Topics',
                            value: item.topics.join(', '),
                          },
                        ]);
                      }

                      if (item.description) {
                        newEmbed.setDescription(item.description);
                      }

                      return newEmbed;
                    });

                    const pagination = new Pagination(interaction);

                    pagination.setEmbeds(embeds);

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
                  });
                },
              );
          }
        }
        break;

      case 'minecraft':
        {
          const name = options.getString('name');

          const mcData = minecraftData('1.19');
          const minecraftLogo =
            'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png';

          switch (options.getSubcommand()) {
            case 'block': {
              if (!name) {
                return interaction.deferReply().then(async () => {
                  const filteredMcData = mcData.blocksArray.filter(
                    (item, index, array) =>
                      array.findIndex(
                        (duplicate) =>
                          duplicate.displayName === item.displayName,
                      ) === index,
                  );

                  const responses = filteredMcData.map(
                    (item, index) =>
                      `${bold(`${index + 1}.`)} ${item.displayName}`,
                  );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: `Minecraft ${
                      mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
                    } Edition${
                      mcData.version.minecraftVersion
                        ? ` v${mcData.version.minecraftVersion}`
                        : ''
                    } Block Lists (${filteredMcData.length})`,
                    iconURL: minecraftLogo,
                  });
                  pagination.setDescriptions(responses);

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
                });
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
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No block found with name ${inlineCode(name)}.`,
                    }),
                );
              }

              embed.setDescription(block?.description ?? null);
              embed.setThumbnail(
                getWikiaURL({
                  fileName: `${block?.altName ?? block.displayName}${
                    block.positions?.length
                      ? block.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${block.version ? ` ${block.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                  animated: block?.animated ?? false,
                }),
              );
              embed.setAuthor({
                name: `🟫 ${block.displayName}`,
              });
              embed.setFields([
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

              return interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
            }

            case 'biome': {
              if (!name) {
                return interaction.deferReply().then(async () => {
                  const responses = mcData.biomesArray.map(
                    (item, index) =>
                      `${bold(`${index + 1}.`)} ${item.displayName}`,
                  );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: `Minecraft ${
                      mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
                    } Edition${
                      mcData.version.minecraftVersion
                        ? ` v${mcData.version.minecraftVersion}`
                        : ''
                    } Biome Lists (${mcData.biomesArray.length})`,
                    iconURL: minecraftLogo,
                  });
                  pagination.setDescriptions(responses);

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
                });
              }

              const biome = {
                ...mcData.biomesByName[snakeCase(name)],
                ...extraMcData.biome[snakeCase(name)],
              };

              if (!Object.keys(biome).length) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No biome found with name ${inlineCode(name)}.`,
                    }),
                );
              }

              embed.setDescription(biome.description);
              embed.setThumbnail(
                getWikiaURL({
                  fileName: `${biome?.altName ?? biome.displayName}${
                    biome.version ? ` ${biome.version}` : ''
                  }`,
                  path: 'minecraft_gamepedia',
                }),
              );
              embed.setAuthor({
                name: `🌄 ${biome.displayName}`,
              });
              embed.setFields([
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
                    ? biome.blocks.map((block) => capitalCase(block)).join(', ')
                    : italic('None'),
                },
                {
                  name: '🎨 Colors',
                  value: biome.colors
                    ? Object.entries(biome.colors)
                        .map(
                          ([key, value]) =>
                            `${capitalCase(key)}: ${applyKeywordColor(value)}`,
                        )
                        .join('\n')
                    : italic('Unknown'),
                },
              ]);

              return interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
            }

            case 'effect': {
              if (!name) {
                return interaction.deferReply().then(async () => {
                  const responses = mcData.effectsArray.map(
                    (item, index) =>
                      `${bold(`${index + 1}.`)} ${item.displayName}`,
                  );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: `Minecraft ${
                      mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
                    } Edition${
                      mcData.version.minecraftVersion
                        ? ` v${mcData.version.minecraftVersion}`
                        : ''
                    } Effect Lists (${mcData.effectsArray.length})`,
                    iconURL: minecraftLogo,
                  });
                  pagination.setDescriptions(responses);

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
                });
              }

              const effect = {
                ...mcData.effectsByName[pascalCase(name)],
                ...extraMcData.effect[pascalCase(name)],
              };

              if (!Object.keys(effect).length) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No effect found with name ${inlineCode(name)}.`,
                    }),
                );
              }

              embed.setDescription(effect.description);
              embed.setThumbnail(
                getWikiaURL({
                  fileName: `${effect?.altName ?? effect.displayName}${
                    effect.positions?.length
                      ? effect.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${effect.version ? ` ${effect.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                }),
              );
              embed.setAuthor({
                name: `💫 ${effect.displayName}`,
              });
              embed.setFields([
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

              return interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
            }

            case 'enchantment': {
              if (!name) {
                return interaction.deferReply().then(async () => {
                  const responses = mcData.enchantmentsArray.map(
                    (item, index) =>
                      `${bold(`${index + 1}.`)} ${item.displayName}`,
                  );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: `Minecraft ${
                      mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
                    } Edition${
                      mcData.version.minecraftVersion
                        ? ` v${mcData.version.minecraftVersion}`
                        : ''
                    } Enchantment Lists (${mcData.enchantmentsArray.length})`,
                    iconURL: minecraftLogo,
                  });
                  pagination.setDescriptions(responses);

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
                });
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
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No enchantment found with name ${inlineCode(
                        name,
                      )}.`,
                    }),
                );
              }

              embed.setDescription(enchantment.description);
              embed.setAuthor({
                name: `🪧 ${enchantment.displayName}`,
              });
              embed.setFields([
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

              return interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
            }

            case 'entity': {
              if (!name) {
                return interaction.deferReply().then(async () => {
                  const responses = mcData.entitiesArray.map(
                    (item, index) =>
                      `${bold(`${index + 1}.`)} ${item.displayName}`,
                  );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: `Minecraft ${
                      mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
                    } Edition${
                      mcData.version.minecraftVersion
                        ? ` v${mcData.version.minecraftVersion}`
                        : ''
                    } Entity Lists (${mcData.entitiesArray.length})`,
                    iconURL: minecraftLogo,
                  });
                  pagination.setDescriptions(responses);

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
                });
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
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No entity found with name ${inlineCode(name)}.`,
                    }),
                );
              }

              embed.setDescription(entity.description);
              embed.setThumbnail(
                getWikiaURL({
                  fileName: `${entity?.altName ?? entity.displayName}${
                    entity.positions?.length
                      ? entity.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${entity.version ? ` ${entity.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                  animated: entity?.animated ?? false,
                }),
              );
              embed.setAuthor({
                name: `🔣 ${entity.displayName}`,
              });

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

              return interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
            }

            case 'food': {
              if (!name) {
                return interaction.deferReply().then(async () => {
                  const responses = mcData.foodsArray.map(
                    (item, index) =>
                      `${bold(`${index + 1}.`)} ${item.displayName}`,
                  );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: `Minecraft ${
                      mcData.version.type === 'pc' ? 'Java' : 'Bedrock'
                    } Edition${
                      mcData.version.minecraftVersion
                        ? ` v${mcData.version.minecraftVersion}`
                        : ''
                    } Food Lists (${mcData.foodsArray.length})`,
                    iconURL: minecraftLogo,
                  });
                  pagination.setDescriptions(responses);

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
                });
              }

              const food = {
                ...mcData.foodsByName[
                  getFormattedMinecraftName(snakeCase(name))
                ],
                ...extraMcData.food[getFormattedMinecraftName(snakeCase(name))],
              };

              if (!Object.keys(food).length) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No food found with name ${inlineCode(name)}.`,
                    }),
                );
              }

              embed.setDescription(food.description);
              embed.setThumbnail(
                getWikiaURL({
                  fileName: `${food?.altName ?? food.displayName}${
                    food.positions?.length
                      ? food.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${food.version ? ` ${food.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                  animated: food?.animated ?? false,
                }),
              );
              embed.setAuthor({
                name: `🍎 ${food.displayName}`,
              });
              embed.addFields([
                {
                  name: '📦 Stackable',
                  value: food.stackSize > 0 ? `Yes (${food.stackSize})` : 'No',
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

              return interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
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
                return interaction.deferReply().then(async () => {
                  const responses = affiliations
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(
                      ({ name }, index) => `${bold(`${index + 1}.`)} ${name}`,
                    );

                  const pagination = new Pagination(interaction, {
                    limit: 10,
                  });

                  pagination.setColor(
                    guild?.members.me?.displayHexColor ?? null,
                  );
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setAuthor({
                    name: '🏢 VTuber Affiliation Lists',
                  });
                  pagination.setDescriptions(responses);

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
                });
              }

              const org = affiliations.find(
                (aff) => aff.name.toLowerCase() === affiliation.toLowerCase(),
              );

              if (!org) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No affiliation found with name ${inlineCode(
                        affiliation,
                      )} or maybe the data isn't available yet.`,
                    }),
                );
              }

              return holodex
                .getChannels({
                  org: org.name,
                  limit: 50,
                  sort: sort ?? 'org',
                  order:
                    sort === 'subscriber_count' ||
                    sort === 'video_count' ||
                    sort === 'clip_count'
                      ? SortOrder.Descending
                      : SortOrder.Ascending,
                })
                .then(async (channels) => {
                  if (!channels.length) {
                    return interaction.deferReply({ ephemeral: true }).then(
                      async () =>
                        await interaction.editReply({
                          content: `No affiliation found with name ${inlineCode(
                            affiliation,
                          )} or maybe the data isn't available yet.`,
                        }),
                    );
                  }

                  await interaction.deferReply().then(async () => {
                    /** @type {import('discord.js').EmbedBuilder[]} */
                    const embeds = channels.map((item, index, array) => {
                      const channel = item.toRaw();

                      return new EmbedBuilder()
                        .setColor(guild?.members.me?.displayHexColor ?? null)
                        .setTimestamp(Date.now())
                        .setFooter({
                          text: `${client.user.username} | Page ${
                            index + 1
                          } of ${array.length}`,
                          iconURL: client.user.displayAvatarURL({
                            dynamic: true,
                          }),
                        })
                        .setThumbnail(channel?.photo ?? null)
                        .setAuthor({
                          name: `${
                            channel.org
                              ? channel.org.includes('Independents')
                                ? `🧑‍💻 ${channel.org.slice(0, -1)} Vtubers`
                                : channel.org
                              : ''
                          }'s YouTube Channel Lists`,
                          iconURL: org?.logoURL,
                        })
                        .setFields([
                          {
                            name: '🔤 Name',
                            value: channel?.english_name || channel.name,
                            inline: true,
                          },
                          {
                            name: '🔤 Channel Name',
                            value: `${hyperlink(
                              channel.name,
                              `https://youtube.com/channel/${channel.id}`,
                            )}${channel.inactive ? ' (Inactive)' : ''}`,
                            inline: true,
                          },
                          {
                            name: '👥 Group',
                            value: channel?.group || italic('None'),
                            inline: true,
                          },
                          {
                            name: '🌐 Twitter',
                            value: channel.twitter
                              ? hyperlink(
                                  `@${channel.twitter}`,
                                  `https://twitter.com/${channel.twitter}`,
                                )
                              : italic('None'),
                            inline: true,
                          },
                          {
                            name: '🔢 VOD Count',
                            value: channel.video_count
                              ? `${Number(
                                  channel.video_count,
                                ).toLocaleString()} ${pluralize(
                                  'video',
                                  Number(channel.video_count),
                                )}`
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '🔢 Subscriber Count',
                            value: channel.subscriber_count
                              ? `${Number(
                                  channel.subscriber_count,
                                ).toLocaleString()} ${pluralize(
                                  'subscriber',
                                  Number(channel.subscriber_count),
                                )}`
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '🔢 Clip Count',
                            value: channel.clip_count
                              ? `${channel.clip_count.toLocaleString()} ${pluralize(
                                  'video',
                                  channel.clip_count,
                                )}`
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '🗣️ Top Topic',
                            value: channel.top_topics
                              ? channel.top_topics
                                  .map((topic) => transformCase(topic))
                                  .join(', ')
                              : italic('None'),
                            inline: true,
                          },
                        ]);
                    });

                    const pagination = new Pagination(interaction);

                    pagination.setEmbeds(embeds);

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
                  });
                });
            }

            case 'channel': {
              const id = options.getString('id', true);

              return holodex
                .getChannel(id)
                .then(async (item) => {
                  const channel = item.toRaw();

                  embed.setDescription(truncate(channel.description, 4096));
                  embed.setThumbnail(channel?.photo ?? null);
                  embed.setAuthor({
                    name: `${
                      channel.org?.includes('Independents') ? '🧑‍💻 ' : ''
                    }${
                      channel?.english_name || channel.name
                    }'s YouTube Channel Information`,
                    iconURL: affiliations.find(
                      (aff) =>
                        aff.name.toLowerCase() === channel.org?.toLowerCase(),
                    )?.logoURL,
                  });
                  embed.setFields([
                    {
                      name: '🔤 Channel Name',
                      value: `${hyperlink(
                        channel.name,
                        `https://youtube.com/channel/${channel.id}`,
                      )}${channel.inactive ? ' (Inactive)' : ''}`,
                      inline: true,
                    },
                    {
                      name: '📆 Channel Created At',
                      value: channel.published_at
                        ? time(
                            new Date(channel.published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🏢 Affiliation',
                      value: channel?.org || italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '👥 Group',
                      value: channel.suborg?.substring(2) || italic('None'),
                      inline: true,
                    },
                    {
                      name: '🌐 Twitter',
                      value: channel.twitter
                        ? hyperlink(
                            `@${channel.twitter}`,
                            `https://twitter.com/${channel.twitter}`,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 View Count',
                      value: channel.view_count
                        ? `${Number(
                            channel.view_count,
                          ).toLocaleString()} ${pluralize(
                            'view',
                            Number(channel.view_count),
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 VOD Count',
                      value: channel.video_count
                        ? `${Number(
                            channel.video_count,
                          ).toLocaleString()} ${pluralize(
                            'video',
                            Number(channel.video_count),
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 Subscriber Count',
                      value: channel.subscriber_count
                        ? `${Number(
                            channel.subscriber_count,
                          ).toLocaleString()} ${pluralize(
                            'subscriber',
                            Number(channel.subscriber_count),
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 Clip Count',
                      value: channel.clip_count
                        ? `${channel.clip_count.toLocaleString()} ${pluralize(
                            'video',
                            channel.clip_count,
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🗣️ Top Topics',
                      value: channel.top_topics
                        ? channel.top_topics
                            .map((topic) => transformCase(topic))
                            .join(', ')
                        : italic('None'),
                      inline: true,
                    },
                  ]);

                  await interaction
                    .deferReply()
                    .then(
                      async () =>
                        await interaction.editReply({ embeds: [embed] }),
                    );
                })
                .catch(async (err) => {
                  console.error(err);

                  if (err.response?.status === 404) {
                    await interaction.deferReply({ ephemeral: true }).then(
                      async () =>
                        await interaction.editReply({
                          content: `No channel found with ID ${inlineCode(
                            id,
                          )} or maybe the data isn't available yet.`,
                        }),
                    );
                  }
                });
            }

            case 'clipper': {
              const channelID = options.getString('id');
              const sort = options.getString('sort');

              if (!channelID) {
                return holodex
                  .getChannels({
                    limit: 50,
                    sort: sort ?? 'org',
                    order:
                      sort === 'subscriber_count' ||
                      sort === 'video_count' ||
                      sort === 'clip_count'
                        ? SortOrder.Descending
                        : SortOrder.Ascending,
                    type: ChannelType.Subber,
                  })
                  .then(
                    async (channels) =>
                      await interaction.deferReply().then(async () => {
                        /** @type {import('discord.js').EmbedBuilder[]} */
                        const embeds = channels.map((item, index, array) => {
                          const channel = item.toRaw();

                          return new EmbedBuilder()
                            .setColor(
                              guild?.members.me?.displayHexColor ?? null,
                            )
                            .setTimestamp(Date.now())
                            .setFooter({
                              text: `${client.user.username} | Page ${
                                index + 1
                              } of ${array.length}`,
                              iconURL: client.user.displayAvatarURL({
                                dynamic: true,
                              }),
                            })
                            .setThumbnail(channel?.photo ?? null)
                            .setAuthor({
                              name: "✂️ VTuber Clipper's YouTube Channel Lists",
                            })
                            .setFields([
                              {
                                name: '🔤 Channel Name',
                                value: `${hyperlink(
                                  channel.name,
                                  `https://youtube.com/channel/${channel.id}`,
                                )}${channel.inactive ? ' (Inactive)' : ''}`,
                                inline: true,
                              },
                              {
                                name: '🌐 Twitter',
                                value: channel.twitter
                                  ? hyperlink(
                                      `@${channel.twitter}`,
                                      `https://twitter.com/${channel.twitter}`,
                                    )
                                  : italic('None'),
                                inline: true,
                              },
                              {
                                name: '🔢 VOD Count',
                                value: channel.video_count
                                  ? `${Number(
                                      channel.video_count,
                                    ).toLocaleString()} ${pluralize(
                                      'video',
                                      Number(channel.video_count),
                                    )}`
                                  : italic('Unknown'),
                                inline: true,
                              },
                              {
                                name: '🔢 Subscriber Count',
                                value: channel.subscriber_count
                                  ? `${Number(
                                      channel.subscriber_count,
                                    ).toLocaleString()} ${pluralize(
                                      'subscriber',
                                      Number(channel.subscriber_count),
                                    )}`
                                  : italic('Unknown'),
                                inline: true,
                              },
                            ]);
                        });

                        const pagination = new Pagination(interaction);

                        pagination.setEmbeds(embeds);

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
                      }),
                  );
              }

              return holodex
                .getChannel(channelID)
                .then(async (item) => {
                  const channel = item.toRaw();

                  embed.setDescription(truncate(channel.description, 4096));
                  embed.setThumbnail(channel?.photo ?? null);
                  embed.setAuthor({
                    name: `✂️ ${channel.name}'s YouTube Channel Information`,
                  });
                  embed.setFields([
                    {
                      name: '🔤 Channel Name',
                      value: `${hyperlink(
                        channel.name,
                        `https://youtube.com/channel/${channel.id}`,
                      )}${channel.inactive ? ' (Inactive)' : ''}`,
                      inline: true,
                    },
                    {
                      name: '📆 Channel Created At',
                      value: channel.published_at
                        ? time(
                            new Date(channel.published_at),
                            TimestampStyles.RelativeTime,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🌐 Twitter',
                      value: channel.twitter
                        ? hyperlink(
                            `@${channel.twitter}`,
                            `https://twitter.com/${channel.twitter}`,
                          )
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 View Count',
                      value: channel.view_count
                        ? `${Number(
                            channel.view_count,
                          ).toLocaleString()} ${pluralize(
                            'view',
                            Number(channel.view_count),
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 VOD Count',
                      value: channel.video_count
                        ? `${Number(
                            channel.video_count,
                          ).toLocaleString()} ${pluralize(
                            'video',
                            Number(channel.video_count),
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '🔢 Subscriber Count',
                      value: channel.subscriber_count
                        ? `${Number(
                            channel.subscriber_count,
                          ).toLocaleString()} ${pluralize(
                            'subscriber',
                            Number(channel.subscriber_count),
                          )}`
                        : italic('Unknown'),
                      inline: true,
                    },
                  ]);

                  await interaction
                    .deferReply()
                    .then(
                      async () =>
                        await interaction.editReply({ embeds: [embed] }),
                    );
                })
                .catch(async (err) => {
                  console.error(err);

                  if (err.response?.status === 404) {
                    await interaction.deferReply({ ephemeral: true }).then(
                      async () =>
                        await interaction.editReply({
                          content: `No channel found with ID ${inlineCode(
                            channelID,
                          )} or maybe the data isn't available yet.`,
                        }),
                    );
                  }
                });
            }

            case 'live': {
              const channelID = options.getString('id');
              const affiliation = options.getString('affiliation');
              const sort = options.getString('sort') ?? 'live_viewers';

              const org = affiliations.find(
                (aff) => aff.name.toLowerCase() === affiliation?.toLowerCase(),
              );

              if (affiliation && !org) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No affiliation found with name ${inlineCode(
                        affiliation,
                      )} or maybe the data isn't available yet.`,
                    }),
                );
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

                return holodex
                  .getLiveVideos(videosParam)
                  .then(async (videos) => {
                    if (!videos.length) {
                      return interaction.deferReply({ ephemeral: true }).then(
                        async () =>
                          await interaction.editReply({
                            content: `No channel found with ID ${inlineCode(
                              channelID,
                            )} or maybe the channel doesn't live right now.`,
                          }),
                      );
                    }

                    await interaction.deferReply().then(async () => {
                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const embeds = videos.map((item, index, array) => {
                        const video = item.toRaw();

                        return new EmbedBuilder()
                          .setColor(guild?.members.me?.displayHexColor ?? null)
                          .setTimestamp(Date.now())
                          .setFooter({
                            text: `${client.user.username} | Page ${
                              index + 1
                            } of ${array.length}`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setDescription(
                            video.description
                              ? truncate(video.description, 4096)
                              : null,
                          )
                          .setThumbnail(video.channel?.photo ?? null)
                          .setAuthor({
                            name: `${
                              video.channel.org?.includes('Independents')
                                ? '🧑‍💻'
                                : ''
                            } ${
                              video.channel?.english_name || video.channel.name
                            }'s YouTube Stream Lists`,
                            iconURL: affiliations.find(
                              (aff) =>
                                aff.name.toLowerCase() ===
                                video.channel.org?.toLowerCase(),
                            )?.logoURL,
                          })
                          .setFields([
                            {
                              name: '🔤 Title',
                              value: hyperlink(
                                video.title,
                                `https://youtube.com/watch?v=${video.id}`,
                              ),
                              inline: true,
                            },
                            {
                              name: '📆 Published At',
                              value: video.published_at
                                ? time(
                                    new Date(video.published_at),
                                    TimestampStyles.RelativeTime,
                                  )
                                : italic('Uknown'),
                              inline: true,
                            },
                            {
                              name: '📆 Streamed At',
                              value: time(
                                new Date(video.available_at),
                                TimestampStyles.RelativeTime,
                              ),
                              inline: true,
                            },
                            {
                              name: '🔢 Live Viewers Count',
                              value: `${video.live_viewers?.toLocaleString()} watching now`,
                              inline: true,
                            },
                            {
                              name: '🗣️ Topic',
                              value: video.topic_id
                                ? transformCase(video.topic_id)
                                : italic('Unknown'),
                              inline: true,
                            },
                            {
                              name: '🏢 Affiliation',
                              value: video.channel?.org ?? italic('Unknown'),
                              inline: true,
                            },
                          ]);
                      });

                      const pagination = new Pagination(interaction);

                      pagination.setEmbeds(embeds);

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
                    });
                  });
              }

              return holodex
                .getLiveVideosByChannelId(channelID)
                .then(async (videos) => {
                  const liveVideos = videos.filter(
                    (video) => video.toRaw().status === VideoStatus.Live,
                  );

                  if (!liveVideos.length) {
                    return interaction.deferReply({ ephemeral: true }).then(
                      async () =>
                        await interaction.editReply({
                          content: `No channel found with ID ${inlineCode(
                            channelID,
                          )} or maybe the channel doesn't live right now.`,
                        }),
                    );
                  }

                  if (liveVideos.length === 1) {
                    const video = liveVideos[0].toRaw();

                    return interaction.deferReply().then(async () => {
                      embed.setDescription(
                        video.description
                          ? truncate(video.description, 4096)
                          : null,
                      );
                      embed.setThumbnail(video.channel?.photo ?? null);
                      embed.setAuthor({
                        name: `${
                          video.channel.org?.includes('Independents')
                            ? '🧑‍💻'
                            : ''
                        } ${
                          video.channel?.english_name || video.channel.name
                        }'s YouTube Stream Information`,
                        iconURL: affiliations.find(
                          (aff) =>
                            aff.name.toLowerCase() ===
                            video.channel.org?.toLowerCase(),
                        )?.logoURL,
                      });
                      embed.setFields([
                        {
                          name: '🔤 Title',
                          value: hyperlink(
                            video.title,
                            `https://youtube.com/watch?v=${video.id}`,
                          ),
                          inline: true,
                        },
                        {
                          name: '📆 Published At',
                          value: video.published_at
                            ? time(
                                new Date(video.published_at),
                                TimestampStyles.RelativeTime,
                              )
                            : italic('Unknown'),
                          inline: true,
                        },
                        {
                          name: '📆 Streamed At',
                          value: time(
                            new Date(video.available_at),
                            TimestampStyles.RelativeTime,
                          ),
                          inline: true,
                        },
                        {
                          name: '🔢 Live Viewers Count',
                          value: `${video.live_viewers?.toLocaleString()} watching now`,
                          inline: true,
                        },
                        {
                          name: '🗣️ Topic',
                          value: video.topic_id
                            ? transformCase(video.topic_id)
                            : italic('Unknown'),
                          inline: true,
                        },
                        {
                          name: '🏢 Affiliation',
                          value: video.channel?.org ?? italic('Unknown'),
                          inline: true,
                        },
                      ]);

                      await interaction.editReply({ embeds: [embed] });
                    });
                  }

                  await interaction.deferReply().then(async () => {
                    /** @type {import('discord.js').EmbedBuilder[]} */
                    const embeds = liveVideos.map((item, index, array) => {
                      const video = item.toRaw();

                      return new EmbedBuilder()
                        .setColor(guild?.members.me?.displayHexColor ?? null)
                        .setTimestamp(Date.now())
                        .setFooter({
                          text: `${client.user.username} | Page ${
                            index + 1
                          } of ${array.length}`,
                          iconURL: client.user.displayAvatarURL({
                            dynamic: true,
                          }),
                        })
                        .setDescription(
                          video.description
                            ? truncate(video.description, 4096)
                            : null,
                        )
                        .setThumbnail(video.channel?.photo ?? null)
                        .setAuthor({
                          name: `${
                            video.channel.org?.includes('Independents')
                              ? '🧑‍💻'
                              : ''
                          } ${
                            video.channel?.english_name || video.channel.name
                          }'s YouTube Stream Lists`,
                          iconURL: affiliations.find(
                            (aff) =>
                              aff.name.toLowerCase() ===
                              video.channel.org?.toLowerCase(),
                          )?.logoURL,
                        })
                        .setFields([
                          {
                            name: '🔤 Title',
                            value: hyperlink(
                              video.title,
                              `https://youtube.com/watch?v=${video.id}`,
                            ),
                            inline: true,
                          },
                          {
                            name: '📆 Published At',
                            value: video.published_at
                              ? time(
                                  new Date(video.published_at),
                                  TimestampStyles.RelativeTime,
                                )
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '📆 Streamed At',
                            value: time(
                              new Date(video.available_at),
                              TimestampStyles.RelativeTime,
                            ),
                            inline: true,
                          },
                          {
                            name: '🔢 Live Viewers Count',
                            value: `${video.live_viewers?.toLocaleString()} watching now`,
                            inline: true,
                          },
                          {
                            name: '🗣️ Topic',
                            value: video.topic_id
                              ? transformCase(video.topic_id)
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '🏢 Affiliation',
                            value: video.channel?.org ?? italic('Unknown'),
                            inline: true,
                          },
                        ]);
                    });

                    const pagination = new Pagination(interaction);

                    pagination.setEmbeds(embeds);

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
                  });
                });
            }

            case 'video': {
              const channelID = options.getString('id', true);

              return holodex
                .getVideosByChannelId(channelID, VideoSearchType.Videos, {
                  limit: 50,
                  include: [ExtraData.Description, ExtraData.LiveInfo],
                })
                .then(async (videos) => {
                  if (!videos.length) {
                    return interaction.deferReply({ ephemeral: true }).then(
                      async () =>
                        await interaction.editReply({
                          content: `No channel found with ID ${inlineCode(
                            channelID,
                          )} or maybe the channel doesn't have any video.`,
                        }),
                    );
                  }

                  await interaction.deferReply().then(async () => {
                    /** @type {import('discord.js').EmbedBuilder[]} */
                    const embeds = videos.map((item, index, array) => {
                      const video = item.toRaw();

                      const newEmbed = new EmbedBuilder()
                        .setColor(guild?.members.me?.displayHexColor ?? null)
                        .setTimestamp(Date.now())
                        .setFooter({
                          text: `${client.user.username} | Page ${
                            index + 1
                          } of ${array.length}`,
                          iconURL: client.user.displayAvatarURL({
                            dynamic: true,
                          }),
                        })
                        .setDescription(
                          video.description
                            ? truncate(video.description, 4096)
                            : null,
                        )
                        .setThumbnail(video.channel?.photo ?? null)
                        .setAuthor({
                          name: `${
                            video.channel.org?.includes('Independents')
                              ? '🧑‍💻'
                              : ''
                          } ${
                            video.channel?.english_name || video.channel.name
                          }'s YouTube Video Lists`,
                          iconURL: affiliations.find(
                            (aff) =>
                              aff.name.toLowerCase() ===
                              video.channel.org?.toLowerCase(),
                          )?.logoURL,
                        })
                        .setFields([
                          {
                            name: '🔤 Title',
                            value: hyperlink(
                              video.title,
                              `https://youtube.com/watch?v=${video.id}`,
                            ),
                            inline: true,
                          },
                          {
                            name: '📊 Status',
                            value: capitalCase(
                              video.status === VideoStatus.Past
                                ? 'archived'
                                : video.status,
                            ),
                            inline: true,
                          },
                          {
                            name: '⏳ Duration',
                            value:
                              video.status !== VideoStatus.Upcoming
                                ? moment
                                    .duration(video.duration, 's')
                                    .humanize()
                                : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '📆 Published At',
                            value: video.published_at
                              ? time(
                                  new Date(video.published_at),
                                  TimestampStyles.RelativeTime,
                                )
                              : italic('Unknown'),
                            inline: true,
                          },
                          {
                            name: '📆 Streamed At',
                            value: time(
                              new Date(video.available_at),
                              TimestampStyles.RelativeTime,
                            ),
                            inline: true,
                          },
                        ]);

                      if (video.status === VideoStatus.Live) {
                        newEmbed.addFields([
                          {
                            name: '🔢 Live Viewers Count',
                            value: `${video.live_viewers.toLocaleString()} watching now`,
                            inline: true,
                          },
                        ]);
                      }

                      return newEmbed;
                    });

                    const pagination = new Pagination(interaction);

                    pagination.setEmbeds(embeds);

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
                  });
                });
            }
          }
        }
        break;
    }

    switch (options.getSubcommand()) {
      case 'npm': {
        const name = options.getString('name', true);

        return axios
          .get(`https://registry.npmjs.com/${name}`)
          .then(
            /**
             *
             * @param {{ data: import('../../constants/types').NPMPackage }}
             */
            async ({ data }) =>
              await interaction.deferReply().then(async () => {
                let maintainers = data.maintainers.map(
                  (maintainer) =>
                    `${bold('•')} ${maintainer.name} (${maintainer.email})`,
                );

                if (maintainers.length > 10) {
                  const rest = maintainers.length - 10;

                  maintainers = maintainers.slice(0, 10);
                  maintainers.push(italic(`...and ${rest} more.`));
                }

                let versions =
                  data['dist-tags'] &&
                  Object.entries(data['dist-tags']).map(
                    ([key, value]) => `${bold('•')} ${key} (${value})`,
                  );

                if (versions && versions.length > 10) {
                  const rest = versions.length - 10;

                  versions = versions.slice(0, 10);
                  versions.push(italic(`...and ${rest} more.`));
                }

                const version =
                  data['dist-tags'] && data.versions[data['dist-tags'].latest];

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

                const cleanedURL = data.repository.url?.replace('git+', '');

                embed.setAuthor({
                  name: `${data.name}'s NPM Information`,
                  url: data.homepage,
                  iconURL:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/320px-Npm-logo.svg.png',
                });
                embed.setDescription(data.description);
                embed.setFields([
                  {
                    name: '👑 Author',
                    value: data.author
                      ? data.author.url
                        ? hyperlink(
                            `${data.author.name}${
                              data.author.email ? ` (${data.author.email})` : ''
                            }`,
                          )
                        : `${data.author.name}${
                            data.author.email ? ` (${data.author.email})` : ''
                          }`
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '📆 Created At',
                    value: time(
                      new Date(data.time.created),
                      TimestampStyles.RelativeTime,
                    ),
                    inline: true,
                  },
                  {
                    name: '📆 Updated At',
                    value: time(
                      new Date(data.time.modified),
                      TimestampStyles.RelativeTime,
                    ),
                    inline: true,
                  },
                  {
                    name: '🔠 Keyword',
                    value: data.keywords
                      ? data.keywords.join(', ')
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '📜 License',
                    value: data.license ?? italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🗄️ Repository',
                    value: cleanedURL
                      ? cleanedURL.startsWith('git://')
                        ? cleanedURL
                            .replace('git://', 'https://')
                            .replace('.git', '')
                        : [...cleanedURL]
                            .slice(0, cleanedURL.lastIndexOf('.'))
                            .join('')
                      : italic('Unknown'),
                    inline: true,
                  },
                  {
                    name: '🧑‍💻 Maintainer',
                    value: maintainers.join('\n'),
                  },
                  {
                    name: '🔖 Version',
                    value: versions ? versions.join('\n') : italic('Unknown'),
                  },
                  {
                    name: '📦 Dependency',
                    value:
                      dependencies && dependencies.length
                        ? dependencies.join('\n')
                        : italic('None'),
                  },
                ]);

                await interaction.editReply({ embeds: [embed] });
              }),
          )
          .catch(async (err) => {
            console.error(err);

            if (err.response.status === 404) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: `No package found with name ${inlineCode(name)}.`,
                  }),
              );
            }
          });
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
            if (err) {
              return interaction
                .deferReply({ ephemeral: true })
                .then(async () => interaction.editReply({ content: err }));
            }

            if (!result.length) {
              return interaction
                .deferReply({ ephemeral: true })
                .then(async () =>
                  interaction.editReply({
                    content: `No information found in ${inlineCode(
                      locationTarget,
                    )}.`,
                  }),
                );
            }

            const [{ location, current, forecast }] = result;

            embed.setThumbnail(current.imageUrl);
            embed.setAuthor({
              name: `🌦️ ${location.name} Weather Information`,
            });
            embed.setFields([
              {
                name: '🌡️ Temperature',
                value: `${current.temperature}°${location.degreetype}`,
                inline: true,
              },
              {
                name: '💧 Humidity',
                value: `${current.humidity}%`,
                inline: true,
              },
              {
                name: '💨 Wind',
                value: current.winddisplay,
                inline: true,
              },
              {
                name: '📊 Status',
                value: `${current.day} ${current.observationtime.slice(
                  0,
                  current.observationtime.length - 3,
                )} (${current.skytext})`,
                inline: true,
              },
              {
                name: '📈 Forecast',
                value: forecast
                  .map(
                    (item) =>
                      `${bold(item.day)}\nStatus: ${item.skytextday}\nRange: ${
                        item.low
                      }°${location.degreetype} - ${item.high}°${
                        location.degreetype
                      }\nPrecipitation: ${
                        !item.precip ? italic('Unknown') : `${item.precip}%`
                      }`,
                  )
                  .join('\n\n'),
              },
            ]);

            await interaction
              .deferReply()
              .then(async () => interaction.editReply({ embeds: [embed] }));
          },
        );
      }
    }
  },
};
