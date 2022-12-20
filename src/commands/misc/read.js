const { bold, hyperlink, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { createWorker } = require('tesseract.js');
const languages = require('tesseract.js/src/constants/languages');

const {
  generateEmbed,
  generatePagination,
  getImageReadLocale,
} = require('@/utils');

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
    const { options } = interaction;

    await interaction.deferReply();

    return {
      list: async () => {
        const locales = Object.values(languages);

        const responses = locales.map(
          (locale, i) =>
            `${bold(`${i + 1}. ${locale}`)} - ${getImageReadLocale(locale)}`,
        );

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: `🌐 Image Reader Locale Lists (${locales.length.toLocaleString()})`,
          })
          .setDescriptions(responses)
          .render();
      },
      run: async () => {
        const file = options.getAttachment('file', true);
        const worker = await createWorker();

        await wait(4000);

        await worker.loadLanguage(languages.ENG);

        await worker.initialize(languages.ENG);

        const {
          data: { confidence, text },
        } = await worker.recognize(file.url);

        await worker.terminate();

        const embed = generateEmbed({ interaction })
          .setThumbnail(file.url)
          .setAuthor({ name: '🖨️ Detection Result' })
          .setFields([
            {
              name: '📄 File',
              value: hyperlink(
                file.name ?? file.url,
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
              name: `🔠 Detected Text (${getImageReadLocale(languages.ENG)})`,
              value: text,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
