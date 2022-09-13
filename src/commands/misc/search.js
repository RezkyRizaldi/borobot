const { SlashCommandBuilder } = require('discord.js');
const Scraper = require('images-scraper').default;
const { Pagination } = require('pagination.djs');

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
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'image': {
        const query = interaction.options.getString('query');

        const reply = await interaction.deferReply({ fetchReply: true }).then(
          async () =>
            await interaction.editReply({
              content: `Fetching ${query} images, please wait...`,
            }),
        );

        const google = new Scraper({
          puppeteer: {
            waitForInitialPage: true,
          },
        });

        return google.scrape(query, 5).then(
          /**
           *
           * @param {import('images-scraper').Scraper.ScrapeResult[]} results
           */
          async (results) => {
            const pagination = new Pagination(interaction, {
              idle: 15000,
              limit: 1,
            });

            pagination.setColor(interaction.guild.members.me.displayHexColor);
            pagination.setTimestamp(Date.now());
            pagination.setFooter({
              text: `${interaction.client.user.username} | Page {pageNumber} of {totalPages}`,
              iconURL: interaction.client.user.displayAvatarURL({
                dynamic: true,
              }),
            });
            pagination.setImages(results.map((result) => result.url));

            const payloads = pagination.ready();

            await reply
              .edit(payloads)
              .then((response) => pagination.paginate(response));
          },
        );
      }
    }
  },
};
