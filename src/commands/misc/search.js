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
  githubRepoSortingTypeChoices,
  githubRepoOrderingTypeChoices,
} = require('../../constants');
const { truncate } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('🔍 Search command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('image')
        .setDescription('🖼️ Search an image from Google.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The image search query.')
            .setRequired(true),
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
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('github')
        .setDescription('ℹ️ Search a GitHub information.')
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
        )
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
                .addChoices(...githubRepoOrderingTypeChoices),
            ),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommand()) {
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

        return interaction.deferReply().then(
          async () =>
            await axios
              .get(`https://api.urbandictionary.com/v0/define?${query}`)
              .then(async ({ data: { list } }) => {
                if (!list.length) {
                  return interaction.editReply({
                    content: `No results found for ${inlineCode(term)}.`,
                  });
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

                await interaction.editReply({ embeds: [embed] });
              }),
        );
      }
    }

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
                    ]);

                    if (data.company) {
                      embed.addFields([
                        {
                          name: '🏢 Company',
                          value: data.company,
                          inline: true,
                        },
                      ]);
                    }

                    embed.addFields([
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
                          'public repository',
                          data.public_gists,
                          true,
                        )}`,
                        inline: true,
                      },
                    ]);

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
                      ]);

                    if (item.homepage) {
                      newEmbed.addFields([
                        {
                          name: '📖 Docs',
                          value: item.homepage,
                          inline: true,
                        },
                      ]);
                    }

                    newEmbed.addFields([
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
    }
  },
};
