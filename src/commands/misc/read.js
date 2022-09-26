const {
  bold,
  EmbedBuilder,
  hyperlink,
  SlashCommandBuilder,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');
const { createWorker, languages } = require('tesseract.js');

const { getImageReadLocale } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('read')
    .setDescription('📄 Read command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('🌐 View available languange locales.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('run')
        .setDescription('📄 Read text in an image.')
        .addAttachmentOption((option) =>
          option
            .setName('file')
            .setDescription('🖼️ The image file to read.')
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

    switch (options.getSubcommand()) {
      case 'list':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          const locales = Object.values(languages);

          const responses = locales.map(
            (value, index) =>
              `${bold(`${index + 1}. ${value}`)} - ${getImageReadLocale(
                value,
              )}`,
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
            name: `🌐 Image Reader Locale Lists (${locales.length})`,
          });
          pagination.setDescriptions(responses);

          await pagination.render();
        });

      case 'run': {
        const file = options.getAttachment('file');
        const worker = createWorker();

        return interaction.deferReply().then(async () => {
          await wait(4000);

          await worker.load();

          await worker.loadLanguage(languages.ENG);

          await worker.initialize(languages.ENG);

          await worker
            .recognize(file.url)
            .then(async ({ data: { confidence, text } }) => {
              const embed = new EmbedBuilder()
                .setColor(guild.members.me.displayHexColor)
                .setTimestamp(Date.now())
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL({
                    dynamic: true,
                  }),
                })
                .setThumbnail(file.url)
                .setAuthor({
                  name: '🖨️ Detection Result',
                })
                .setFields([
                  {
                    name: '📄 File',
                    value: hyperlink(
                      file.name,
                      file.url,
                      file.description ?? 'Click here to view the image file.',
                    ),
                    inline: true,
                  },
                  {
                    name: '🎯 Accuracy Rate',
                    value: `${Math.floor(confidence)}%`,
                    inline: true,
                  },
                  {
                    name: `🔠 Detected Text (${getImageReadLocale(
                      languages.ENG,
                    )})`,
                    value: text,
                  },
                ]);

              await interaction.editReply({ embeds: [embed] });
            });

          await worker.terminate();
        });
      }
    }
  },
};
