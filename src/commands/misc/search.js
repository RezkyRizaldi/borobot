const axios = require('axios').default;
const {
  EmbedBuilder,
  hyperlink,
  inlineCode,
  italic,
  SlashCommandBuilder,
  time,
  TimestampStyles,
} = require('discord.js');
const Scraper = require('images-scraper').default;
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');

const {
  animeCharacterSearchOrderChoices,
  animeSearchOrderChoices,
  animeSearchStatusChoices,
  animeSearchTypeChoices,
  githubRepoSortingTypeChoices,
  mangaSearchOrderChoices,
  mangaSearchStatusChoices,
  mangaSearchTypeChoices,
  mdnLocales,
  searchSortingChoices,
} = require('../../constants');
const { truncate } = require('../../utils');

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
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, client, guild, options } = interaction;

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
                        value: `${pluralize(
                          'follower',
                          data.followers,
                          true,
                        )} | ${pluralize(
                          'following',
                          data.following,
                          true,
                        )} | ${pluralize(
                          'public repository',
                          data.public_repos,
                          true,
                        )} | ${pluralize(
                          'public gists',
                          data.public_gists,
                          true,
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
                          value: `https://twitter.com/${data.twitter_username}`,
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
                          value: `⭐ ${pluralize(
                            'star',
                            item.stargazers_count,
                            true,
                          )} | 👁️‍🗨️ ${pluralize(
                            'watcher',
                            item.watchers_count,
                            true,
                          )} | 🕎 ${pluralize(
                            'fork',
                            item.forks_count,
                            true,
                          )} | 🪲 ${pluralize(
                            'issue',
                            item.open_issues_count,
                            true,
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
                              ? pluralize('episode', item.episodes, true)
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
                                  item.season
                                    ? item.season.charAt(0).toUpperCase() +
                                      item.season.slice(1)
                                    : ''
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
                            ? truncate(item.synopsis, 1024)
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
                          value: pluralize('favorite', item.favorites, true),
                          inline: true,
                        },
                      ]);

                    if (item.about) {
                      newEmbed.setDescription(item.about);
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

                  await pagination.render();
                });
              });
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

        if (letter) {
          const firstChar = letter.charAt(0);

          if (!firstChar.match(/[a-z]/i)) {
            return interaction.deferReply({ ephemeral: true }).then(
              async () =>
                await interaction.editReply({
                  content: 'You have to specify an alphabetic character.',
                }),
            );
          }

          query.append('letter', firstChar);
        }

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
                          ? pluralize('volume', item.volumes, true)
                          : '??? volumes'
                      } ${
                        item.chapters
                          ? `(${pluralize('chapter', item.chapters, true)})`
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
                        ? truncate(item.synopsis, 1024)
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
              name: `🔠 ${word}`,
              url: permalink,
            });
            embed.setFields([
              {
                name: '🔤 Definition',
                value: truncate(
                  `${definition}${formattedCite}`,
                  1024,
                  formattedCite.length + 3,
                ),
              },
              {
                name: '🔤 Example',
                value: truncate(example, 1024),
              },
              {
                name: '⭐ Rating',
                value: `${thumbs_up} 👍 | ${thumbs_down} 👎`,
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
    }
  },
};
