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
const { Pagination } = require('pagination.djs');

const { animeDownloadSiteChoices } = require('../../constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('📩 Downloader Command.')
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
                `https://api.lolhuman.xyz/api/otakudesusearch?query=${title}&apikey=${process.env.LOLHUMAN_API_KEY}`,
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
                `https://api.lolhuman.xyz/api/kusonimesearch?query=${title}&apikey=${process.env.LOLHUMAN_API_KEY}`,
              );

              const response = `${bold(t)}\n${Object.entries(link_dl)
                .map(
                  ([reso, provider]) =>
                    `${bold('•')} ${reso}: ${Object.entries(provider)
                      .map(([name, url]) => hyperlink(name, url))
                      .join(' | ')}`,
                )
                .join('\n')}`;

              const embed = new EmbedBuilder()
                .setColor(guild?.members.me?.displayHexColor ?? null)
                .setTimestamp(Date.now())
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL({
                    dynamic: true,
                  }),
                })
                .setAuthor({
                  name: 'Kusonime Search Results',
                  iconURL: 'attachment://kusonime-logo.png',
                })
                .setDescription(response);

              await interaction.editReply({ embeds: [embed], files: [file] });
            }
          }
        });
      }
    }
  },
};
