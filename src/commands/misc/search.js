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
const Scraper = require('images-scraper').default;
const minecraftData = require('minecraft-data');
const moment = require('moment');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');
const { stringify } = require('roman-numerals-convert');
const truncate = require('truncate');
const weather = require('weather-js');

const {
  animeCharacterSearchOrderChoices,
  animeSearchOrderChoices,
  animeSearchStatusChoices,
  animeSearchTypeChoices,
  extraMcData,
  githubRepoSortingTypeChoices,
  mangaSearchOrderChoices,
  mangaSearchStatusChoices,
  mangaSearchTypeChoices,
  mdnLocales,
  searchSortingChoices,
} = require('../../constants');
const {
  applyKeywordColor,
  getFormattedMinecraftName,
  getWikiaURL,
  getFormattedParam,
  isAlphabeticLetter,
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
                ),
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
                .setDescription('🔤 The anime score search query.'),
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
                .setDescription('🔣 The anime initial search query.'),
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('covid')
        .setDescription('🦠 Search covid-19 information.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('country')
            .setDescription(
              '🌏 Search covid-19 information from provided country.',
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
            .setDescription('📆 Search covid-19 latest information from.'),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('🌐 View available countries.'),
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
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('genshin')
        .setDescription('ℹ️ Search a Genshin Impact information.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('artifact')
            .setDescription('🛡️ Search Genshin Impact artifact information.')
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
        .setDescription('ℹ️ Search a GitHub information.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('repositories')
            .setDescription('🗄️ Search GitHub repositories information.')
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
            .setDescription('👤 Search GitHub user account information.')
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
            .setDescription('🔤 The manga score search query.'),
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
            .setDescription('🔣 The manga initial search query.'),
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
            .addChoices(...mdnLocales),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('minecraft')
        .setDescription('ℹ️ Search a Minecraft information.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('block')
            .setDescription('🟫 Search Minecraft block information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft block name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('biome')
            .setDescription('🌄 Search Minecraft biome information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft biome name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('effect')
            .setDescription('💫 Search Minecraft effect information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft effect name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('enchantment')
            .setDescription('🪧 Search Minecraft enchantment information.')
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
            .setDescription('🔣 Search Minecraft entity information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔣 The Minecraft entity name search query.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('food')
            .setDescription('🍎 Search Minecraft food information.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('🔠 The Minecraft food name search query.'),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('weather')
        .setDescription('🌦️ Search weather information from provided location.')
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
    const { channel, client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    const NSFWChannels = guild.channels.cache
      .filter((ch) => ch.nsfw)
      .map((ch) => ch)
      .join(', ');

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommandGroup()) {
      case 'github':
        switch (options.getSubcommand()) {
          case 'user': {
            const username = options.getString('username');

            return axios
              .get(`https://api.github.com/users/${username}`)
              .then(
                async ({ data }) =>
                  await interaction.deferReply().then(async () => {
                    embed.setAuthor({
                      name: `👤 @${data.login}'s GitHub ${data.type} Account Info`,
                      url: data.html_url,
                    });

                    if (data.bio) {
                      embed.setDescription(data.bio);
                    }

                    embed.setThumbnail(data.avatar_url);
                    embed.setFields([
                      {
                        name: '🔤 Account Name',
                        value: data.name,
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
            const name = options.getString('name');
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
              .then(async ({ data: { items } }) => {
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
                      .setColor(guild.members.me.displayHexColor)
                      .setTimestamp(Date.now())
                      .setFooter({
                        text: `${client.user.username} | Page ${index + 1} of ${
                          array.length
                        }`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      })
                      .setThumbnail(item.owner.avatar_url)
                      .setAuthor({
                        name: '🗄️ GitHub Repository Search Results',
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
                          )} | 👁️‍🗨️ ${item.watchers_count.toLocaleString()} ${pluralize(
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
              });
          }
        }
        break;

      case 'anime':
        switch (options.getSubcommand()) {
          case 'info': {
            const title = options.getString('title');
            const type = options.getString('type');
            const score = options.getInteger('score');
            const status = options.getString('status');
            const order = options.getString('order');
            const sort = options.getString('sort');
            const letter = options.getString('initial');

            const query = new URLSearchParams();

            if (!channel.nsfw) {
              query.append('sfw', 'true');
            }

            if (title) {
              query.append('q', encodeURIComponent(title));
            }

            if (type) {
              query.append('type', type);
            }

            if (score) {
              if (score < 1 || score > 10) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: 'You have to specify a number between 1 to 10.',
                    }),
                );
              }

              const formattedScore = Number(
                score.toString().replace(/,/g, '.'),
              ).toFixed(2);

              query.append('score', formattedScore);
            }

            if (status) {
              query.append('status', status);
            }

            if (order) {
              query.append('order_by', order);
            }

            if (sort) {
              query.append('sort', sort);
            }

            if (!isAlphabeticLetter(letter)) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: 'You have to specify an alphabetic character.',
                  }),
              );
            }

            query.append('letter', letter.charAt(0));

            return axios
              .get(`https://api.jikan.moe/v4/anime?${query}`)
              .then(async ({ data: { data } }) => {
                if (!data.length) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: `No anime found with title ${inlineCode(
                          title,
                        )} or maybe it's contains NSFW stuff. Try to use this command in a NSFW Channel.\n${italic(
                          'eg.',
                        )} ${NSFWChannels}`,
                      }),
                  );
                }

                await interaction.deferReply().then(async () => {
                  /** @type {import('discord.js').EmbedBuilder[]} */
                  const embeds = data.map((item, index, array) => {
                    const newEmbed = new EmbedBuilder()
                      .setColor(guild.members.me.displayHexColor)
                      .setTimestamp(Date.now())
                      .setFooter({
                        text: `${client.user.username} | Page ${index + 1} of ${
                          array.length
                        }`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      })
                      .setAuthor({
                        name: '🖥️ Anime Search Results',
                      })
                      .setFields([
                        {
                          name: '🔤 Title',
                          value: hyperlink(item.title, item.url),
                          inline: true,
                        },
                        {
                          name: '🔠 Type',
                          value: item.type ?? italic('Unknown'),
                          inline: true,
                        },
                        {
                          name: '🎬 Episode',
                          value: `${
                            item.episodes
                              ? `${item.episodes.toLocaleString()} ${pluralize(
                                  'episode',
                                  item.episodes,
                                )}`
                              : '??? episodes'
                          } (${item.duration})`,
                          inline: true,
                        },
                        {
                          name: '📊 Stats',
                          value:
                            item.score ||
                            item.scored_by ||
                            item.members ||
                            item.rank ||
                            item.favorites ||
                            item.rating
                              ? `${
                                  item.score
                                    ? `⭐ ${
                                        item.score
                                      } (by ${item.scored_by.toLocaleString()} ${pluralize(
                                        'user',
                                        item.scored_by,
                                      )})`
                                    : ''
                                } | 👥 ${item.members.toLocaleString()}${
                                  item.rank ? ` | #️⃣ #${item.rank}` : ''
                                } | ❤️ ${item.favorites} | 🔞 ${item.rating}`
                              : italic('None'),
                          inline: true,
                        },
                        {
                          name: '⌛ Status',
                          value: item.status,
                          inline: true,
                        },
                        {
                          name: '📆 Aired',
                          value: item.aired.string ?? italic('Unknown'),
                          inline: true,
                        },
                        {
                          name: '📆 Premiered',
                          value:
                            item.season || item.year
                              ? `${
                                  item.season ? capitalCase(item.season) : ''
                                } ${item.year ?? ''}`
                              : italic('Unknown'),
                          inline: true,
                        },
                        {
                          name: '🏢 Studios',
                          value: item.studios.length
                            ? item.studios
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
                            item.genres.length ||
                            item.explicit_genres.length ||
                            item.themes.length ||
                            item.demographics.length
                              ? [
                                  ...item.genres,
                                  ...item.explicit_genres,
                                  ...item.themes,
                                  ...item.demographics,
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
                          value: item.synopsis
                            ? item.synopsis.includes('[Written by MAL Rewrite]')
                              ? truncate(
                                  item.synopsis.replace(
                                    '[Written by MAL Rewrite]',
                                    '',
                                  ),
                                  1024 - 3,
                                )
                              : truncate(item.synopsis, 1024 - 3)
                            : italic('No available'),
                        },
                        {
                          name: '🎞️ Trailer',
                          value: item.trailer.url ?? italic('No available'),
                        },
                      ]);

                    if (item.images) {
                      newEmbed.setThumbnail(
                        item.images.jpg.image_url ?? item.images.webp.image_url,
                      );
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
              if (!letter.charAt(0).match(/[a-z]/i)) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: 'You have to specify an alphabetic character.',
                    }),
                );
              }

              query.append('letter', [...letter][0]);
            }

            return axios
              .get(`https://api.jikan.moe/v4/characters?${query}`)
              .then(async ({ data: { data } }) => {
                if (!data.length) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: `No anime character found with name ${inlineCode(
                          name,
                        )}`,
                      }),
                  );
                }

                await interaction.deferReply().then(async () => {
                  const embeds = data.map((item, index, array) => {
                    const newEmbed = new EmbedBuilder()
                      .setColor(guild.members.me.displayHexColor)
                      .setTimestamp(Date.now())
                      .setFooter({
                        text: `${client.user.username} | Page ${index + 1} of ${
                          array.length
                        }`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      })
                      .setAuthor({
                        name: '🖥️ Anime Character Search Results',
                      })
                      .setFields([
                        {
                          name: '🔤 Name',
                          value: hyperlink(
                            `${item.name} (${item.name_kanji})`,
                            item.url,
                          ),
                          inline: true,
                        },
                        {
                          name: '🔤 Nickname',
                          value: item.nicknames.length
                            ? item.nicknames.join(', ')
                            : italic('None'),
                          inline: true,
                        },
                        {
                          name: '❤️ Favorite',
                          value: `${item.favorites.toLocaleString()} ${pluralize(
                            'favorite',
                            item.favorites,
                          )}`,
                          inline: true,
                        },
                      ]);

                    if (item.about) {
                      newEmbed.setDescription(
                        truncate(
                          item.about.replace(/\n\n\n/g, '\n\n'),
                          4096 - 3,
                        ),
                      );
                    }

                    if (item.images) {
                      newEmbed.setThumbnail(
                        item.images.jpg.image_url ?? item.images.webp.image_url,
                      );
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
        break;

      case 'genshin': {
        const baseURL = 'https://api.genshin.dev';

        switch (options.getSubcommand()) {
          case 'artifact': {
            const name = options.getString('name');

            if (!name) {
              return interaction.deferReply().then(
                async () =>
                  await axios
                    .get(`${baseURL}/artifacts`)
                    .then(async ({ data }) => {
                      const responses = data.map(
                        (item, index) =>
                          `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                      );

                      const pagination = new Pagination(interaction, {
                        limit: 10,
                      });

                      pagination.setColor(guild.members.me.displayHexColor);
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
                    }),
              );
            }

            return axios
              .get(`${baseURL}/artifacts/${paramCase(name)}`)
              .then(async ({ data }) => {
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
              })
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
            const detailed = options.getBoolean('detailed');

            if (!name) {
              return interaction.deferReply().then(
                async () =>
                  await axios
                    .get(`${baseURL}/characters`)
                    .then(async ({ data }) => {
                      const responses = data.map(
                        (item, index) =>
                          `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                      );

                      const pagination = new Pagination(interaction, {
                        limit: 10,
                      });

                      pagination.setColor(guild.members.me.displayHexColor);
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
                    }),
              );
            }

            return axios
              .get(`${baseURL}/characters/${getFormattedParam(name)}`)
              .then(async ({ data }) => {
                const formattedName =
                  data.name === 'Ayato' ? 'Kamisato Ayato' : data.name;

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
                    value: data.nation,
                    inline: true,
                  },
                  {
                    name: '🏰 Affiliation',
                    value: data.affiliation,
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
                    value: moment(data.birthday).format('MMMM Do'),
                    inline: true,
                  },
                ]);

                if (data.description) {
                  embed.setDescription(data.description);
                }

                if (detailed) {
                  const pagination = new Pagination(interaction);

                  const activeTalentEmbed = new EmbedBuilder()
                    .setColor(guild.members.me.displayHexColor)
                    .setTimestamp(Date.now())
                    .setDescription(
                      `${bold('Active Talents')}\n${data.skillTalents
                        .map(
                          (skill) =>
                            `${bold(`• ${skill.name}`)} (${
                              skill.unlock
                            })\n${skill.description
                              .replace(/\n\n/g, '\n')
                              .replace(/\n$/, '')}${
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
                    .setColor(guild.members.me.displayHexColor)
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
                    .setColor(guild.members.me.displayHexColor)
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
                        .setColor(guild.members.me.displayHexColor)
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
              })
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
                  await axios
                    .get(`${baseURL}/weapons`)
                    .then(async ({ data }) => {
                      const responses = data.map(
                        (item, index) =>
                          `${bold(`${index + 1}.`)} ${capitalCase(item)}`,
                      );

                      const pagination = new Pagination(interaction, {
                        limit: 10,
                      });

                      pagination.setColor(guild.members.me.displayHexColor);
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
                    }),
              );
            }

            return axios
              .get(`${baseURL}/weapons/${paramCase(name)}`)
              .then(async ({ data }) => {
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
                        ? `${bold(data.passiveName)} - ${data.passiveDesc}`
                        : italic('None'),
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

                  pagination.setColor(guild.members.me.displayHexColor);
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
                    } Edition v${
                      mcData.version.minecraftVersion
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

              /** @type {import('minecraft-data').Block} */
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

              embed.setDescription(block.description);
              embed.setThumbnail(
                getWikiaURL({
                  fileName: `${block.altName ?? block.displayName}${
                    block.positions?.length
                      ? block.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${block.version ? ` ${block.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                  animated: block.animated ?? false,
                }),
              );
              embed.setAuthor({
                name: `🟫 ${block.displayName}`,
              });
              embed.setFields([
                {
                  name: '⛏️ Tool',
                  value: capitalCase(
                    block.material !== 'default'
                      ? block.material.slice(
                          block.material.indexOf('/'),
                          block.material.length,
                        )
                      : italic('None'),
                  ),
                  inline: true,
                },
                {
                  name: '💪 Hardness',
                  value: `${block.hardness}`,
                  inline: true,
                },
                {
                  name: '🛡️ Blast Resistance',
                  value: `${block.resistance}`,
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

                  pagination.setColor(guild.members.me.displayHexColor);
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
                    } Edition v${
                      mcData.version.minecraftVersion
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

              /** @type {import('minecraft-data').Biome} */
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
                  fileName: `${biome.altName ?? biome.displayName}${
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

                  pagination.setColor(guild.members.me.displayHexColor);
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
                    } Edition v${
                      mcData.version.minecraftVersion
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

              /** @type {import('minecraft-data').Effect} */
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
                  fileName: `${effect.altName ?? effect.displayName}${
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

                  pagination.setColor(guild.members.me.displayHexColor);
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
                    } Edition v${
                      mcData.version.minecraftVersion
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

              /** @type {import('minecraft-data').Enchantment} */
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

                  pagination.setColor(guild.members.me.displayHexColor);
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
                    } Edition v${
                      mcData.version.minecraftVersion
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

              /** @type {import('minecraft-data').Entity} */
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
                  fileName: `${entity.altName ?? entity.displayName}${
                    entity.positions?.length
                      ? entity.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${entity.version ? ` ${entity.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                  animated: entity.animated ?? false,
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

                  pagination.setColor(guild.members.me.displayHexColor);
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
                    } Edition v${mcData.version.minecraftVersion} Food Lists (${
                      mcData.foodsArray.length
                    })`,
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

              /** @type {import('minecraft-data').Food} */
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
                  fileName: `${food.altName ?? food.displayName}${
                    food.positions?.length
                      ? food.positions.map((pos) => ` (${pos})`).join('')
                      : ''
                  }${food.version ? ` ${food.version}` : ''}`,
                  path: 'minecraft_gamepedia',
                  animated: food.animated ?? false,
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
                  async ({ data }) =>
                    await interaction.deferReply().then(async () => {
                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const embeds = data.map((item, index, array) =>
                        new EmbedBuilder()
                          .setColor(guild.members.me.displayHexColor)
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
                    }),
                );

            case 'list':
              return axios
                .get(`${baseURL}/countries`)
                .then(async ({ data: { countries } }) => {
                  await interaction.deferReply().then(async () => {
                    const responses = countries.map(
                      ({ name }, index) => `${bold(`${index + 1}.`)} ${name}`,
                    );

                    const pagination = new Pagination(interaction, {
                      limit: 10,
                    });

                    pagination.setColor(guild.members.me.displayHexColor);
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
                });

            case 'country': {
              const name = options.getString('name');

              if (!name) {
                return axios.get(`${baseURL}/confirmed`).then(
                  async ({ data }) =>
                    await interaction.deferReply().then(async () => {
                      /** @type {import('discord.js').EmbedBuilder[]} */
                      const embeds = data.map((item, index, array) =>
                        new EmbedBuilder()
                          .setColor(guild.members.me.displayHexColor)
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
                              value: `${Math.floor(
                                item.incidentRate,
                              ).toLocaleString()} ${pluralize(
                                'case',
                                item.incidentRate,
                              )}/day`,
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

              const country = await axios
                .get(`${baseURL}/countries`)
                .then(
                  async ({ data: { countries } }) =>
                    countries.find(
                      (item) => item.name.toLowerCase() === name.toLowerCase(),
                    ).name,
                );

              return axios
                .get(`${baseURL}/countries/${country}/confirmed`)
                .then(async ({ data }) => {
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
                          value: `${data[0].active.toLocaleString()} ${pluralize(
                            'case',
                            data[0].active,
                          )}`,
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
                          value: `${Math.floor(
                            data[0].incidentRate,
                          ).toLocaleString()} ${pluralize(
                            'case',
                            data[0].incidentRate,
                          )}/day`,
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
                        .setColor(guild.members.me.displayHexColor)
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
                            value: `${item.active.toLocaleString()} ${pluralize(
                              'case',
                              item.active,
                            )}`,
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
                            value: `${Math.floor(
                              item.incidentRate,
                            ).toLocaleString()} ${pluralize(
                              'case',
                              item.incidentRate,
                            )}/day`,
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
                });
            }
          }
        }
        break;
    }

    switch (options.getSubcommand()) {
      case 'manga': {
        const title = options.getString('title');
        const type = options.getString('type');
        const score = options.getInteger('score');
        const status = options.getString('status');
        const order = options.getString('order');
        const sort = options.getString('sort');
        const letter = options.getString('initial');

        const query = new URLSearchParams();

        if (!channel.nsfw) {
          query.append('sfw', 'true');
        }

        if (title) {
          query.append('q', encodeURIComponent(title));
        }

        if (type) {
          query.append('type', type);
        }

        if (score) {
          if (score < 1 || score > 10) {
            return interaction.deferReply({ ephemeral: true }).then(
              async () =>
                await interaction.editReply({
                  content: 'You have to specify a number between 1 to 10.',
                }),
            );
          }

          const formattedScore = Number(
            score.toString().replace(/,/g, '.'),
          ).toFixed(2);

          query.append('score', formattedScore);
        }

        if (status) {
          query.append('status', status);
        }

        if (order) {
          query.append('order_by', order);
        }

        if (sort) {
          query.append('sort', sort);
        }

        if (letter && !isAlphabeticLetter(letter)) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'You have to specify an alphabetic character.',
              }),
          );
        }

        query.append('letter', letter.charAt(0));

        return axios
          .get(`https://api.jikan.moe/v4/manga?${query}`)
          .then(async ({ data: { data } }) => {
            if (!data.length) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: `No manga found with title ${inlineCode(
                      title,
                    )} or maybe it's contains NSFW stuff. Try to use this command in a NSFW Channel.\n${italic(
                      'eg.',
                    )} ${NSFWChannels}`,
                  }),
              );
            }

            await interaction.deferReply().then(async () => {
              /** @type {import('discord.js').EmbedBuilder[]} */
              const embeds = data.map((item, index, array) => {
                const newEmbed = new EmbedBuilder()
                  .setColor(guild.members.me.displayHexColor)
                  .setTimestamp(Date.now())
                  .setFooter({
                    text: `${client.user.username} | Page ${index + 1} of ${
                      array.length
                    }`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  })
                  .setAuthor({
                    name: '🖥️ Manga Search Results',
                  })
                  .setFields([
                    {
                      name: '🔤 Title',
                      value: hyperlink(item.title, item.url),
                      inline: true,
                    },
                    {
                      name: '🔠 Type',
                      value: item.type ?? italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📚 Volume & Chapter',
                      value: `${
                        item.volumes
                          ? `${item.volumes.toLocaleString()} ${pluralize(
                              'volume',
                              item.volumes,
                            )}`
                          : '??? volumes'
                      } ${
                        item.chapters
                          ? `${item.chapters.toLocaleString()} (${pluralize(
                              'chapter',
                              item.chapters,
                            )})`
                          : ''
                      }`,
                      inline: true,
                    },
                    {
                      name: '📊 Stats',
                      value:
                        item.score ||
                        item.scored_by ||
                        item.members ||
                        item.rank ||
                        item.favorites
                          ? `${
                              item.score
                                ? `⭐ ${
                                    item.score
                                  } (by ${item.scored_by.toLocaleString()} ${pluralize(
                                    'user',
                                    item.scored_by,
                                  )})`
                                : ''
                            } | 👥 ${item.members.toLocaleString()}${
                              item.rank ? ` | #️⃣ #${item.rank}` : ''
                            } | ❤️ ${item.favorites}`
                          : italic('None'),
                      inline: true,
                    },
                    {
                      name: '⌛ Status',
                      value: item.status ?? italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📆 Published',
                      value: item.published.string ?? italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📝 Authors',
                      value: item.authors.length
                        ? item.authors
                            .map((author) => hyperlink(author.name, author.url))
                            .join(', ')
                        : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '📰 Serializations',
                      value: item.serializations.length
                        ? item.serializations
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
                        item.genres.length ||
                        item.explicit_genres.length ||
                        item.themes.length ||
                        item.demographics.length
                          ? [
                              ...item.genres,
                              ...item.explicit_genres,
                              ...item.themes,
                              ...item.demographics,
                            ]
                              .map((genre) => hyperlink(genre.name, genre.url))
                              .join(', ')
                          : italic('Unknown'),
                      inline: true,
                    },
                    {
                      name: '💫 Synopsis',
                      value: item.synopsis
                        ? item.synopsis.includes('[Written by MAL Rewrite]')
                          ? truncate(
                              item.synopsis.replace(
                                '[Written by MAL Rewrite]',
                                '',
                              ),
                              1024 - 3,
                            )
                          : truncate(item.synopsis, 1024 - 3)
                        : italic('No available'),
                    },
                  ]);

                if (item.images) {
                  newEmbed.setThumbnail(
                    item.images.jpg.image_url ?? item.images.webp.image_url,
                  );
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

      case 'image': {
        const query = options.getString('query');

        const google = new Scraper({
          puppeteer: {
            waitForInitialPage: true,
          },
        });

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          await wait(4000);

          await google.scrape(query, 5).then(
            /**
             *
             * @param {import('images-scraper').Scraper.ScrapeResult[]} results
             */
            async (results) => {
              const pagination = new Pagination(interaction, {
                limit: 1,
              });

              pagination.setColor(guild.members.me.displayHexColor);
              pagination.setTimestamp(Date.now());
              pagination.setFooter({
                text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                iconURL: client.user.displayAvatarURL({
                  dynamic: true,
                }),
              });
              pagination.setAuthor({
                name: '🖼️ Image Search Results',
              });
              pagination.setImages(results.map((result) => result.url));

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
          );
        });
      }

      case 'definition': {
        const term = options.getString('term');
        const query = new URLSearchParams({ term });

        return axios
          .get(`https://api.urbandictionary.com/v0/define?${query}`)
          .then(async ({ data: { list } }) => {
            if (!list.length) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: `No result found for ${inlineCode(term)}.`,
                  }),
              );
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

            embed.setAuthor({
              name: `🔠 ${capitalCase(word)}`,
              url: permalink,
            });
            embed.setFields([
              {
                name: '🔤 Definition',
                value: `${truncate(
                  definition,
                  1024 - formattedCite.length - 3,
                )}${formattedCite}`,
              },
              {
                name: '🔤 Example',
                value: truncate(example, 1024 - 3),
              },
              {
                name: '⭐ Rating',
                value: `${thumbs_up.toLocaleString()} 👍 | ${thumbs_down.toLocaleString()} 👎`,
              },
            ]);

            await interaction
              .deferReply()
              .then(
                async () => await interaction.editReply({ embeds: [embed] }),
              );
          });
      }

      case 'mdn': {
        const term = options.getString('term');
        const language = options.getString('language');
        const query = new URLSearchParams({
          q: term,
          locale: language ?? 'en-US',
        });
        const baseURL = 'https://developer.mozilla.org';

        return axios
          .get(`${baseURL}/api/v1/search?${query}`)
          .then(async ({ data: { documents, suggestions } }) => {
            if (!documents.length) {
              if (!suggestions.length) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `No result found for ${inlineCode(term)}.`,
                    }),
                );
              }

              const newQuery = new URLSearchParams({
                q: suggestions[0].text,
                locale: language ?? 'en-US',
              });

              return axios
                .get(`${baseURL}/api/v1/search${newQuery}`)
                .then(async ({ data: { documents: docs } }) => {
                  const fields = docs.map((doc) => ({
                    name: doc.title,
                    value: `${doc.summary}\n${hyperlink(
                      'View Documentation',
                      `${baseURL}${doc.mdn_url}`,
                      'Click here to view the documentation.',
                    )}`,
                  }));

                  embed.setAuthor({
                    name: '📖 Documentation Search Results',
                  });
                  embed.setFields(fields);

                  await interaction
                    .deferReply()
                    .then(
                      async () =>
                        await interaction.editReply({ embeds: [embed] }),
                    );
                });
            }

            const fields = documents.map((doc) => ({
              name: doc.title,
              value: `${doc.summary}\n${hyperlink(
                'View Documentation',
                `${baseURL}${doc.mdn_url}`,
                'Click here to view the documentation.',
              )}`,
            }));

            embed.setAuthor({
              name: '📖 Documentation Search Results',
            });
            embed.setFields(fields);

            await interaction
              .deferReply()
              .then(
                async () => await interaction.editReply({ embeds: [embed] }),
              );
          });
      }

      case 'weather': {
        const locationTarget = options.getString('location');

        return weather.find(
          { search: locationTarget, degreeType: 'C' },
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
                      }°${location.degreetype} - ${item.high}${
                        location.degreetype
                      }\nPrecipitation: ${item.precip}%`,
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
