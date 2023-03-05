const { bold, hyperlink, SlashCommandBuilder } = require('discord.js');
const { changeLanguage, t } = require('i18next');
const wait = require('node:timers/promises').setTimeout;
const { createWorker, languages } = require('tesseract.js');

const { supportedMIMETypes } = require('@/constants');
const {
  count,
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
        )
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription('🌐 The language code to be used.'),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { locale, options } = interaction;

    await interaction.deferReply();

    await changeLanguage(locale);

    return {
      list: async () => {
        const locales = Object.values(languages);

        const responses = locales.map(
          (l, i) => `${bold(`${i + 1}. ${l}`)} - ${getImageReadLocale(l)}`,
        );

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: t('command.read.subcommand.list', { total: count(locales) }),
          })
          .setDescriptions(responses)
          .render();
      },
      run: async () => {
        const file = options.getAttachment('file', true);

        /** @type {String} */
        const language =
          options.getString('language').toLowerCase() ?? languages.ENG;

        if (!supportedMIMETypes.includes(file.contentType)) {
          throw t('global.error.mime');
        }

        if (
          !Object.keys(languages)
            .map((key) => key.toLowerCase())
            .includes(language)
        ) {
          throw t('global.error.language', { language });
        }

        const worker = await createWorker();

        await wait(4000);

        await worker.loadLanguage(language);

        await worker.initialize(language);

        const {
          data: { confidence, text },
        } = await worker.recognize(file.url);

        await worker.terminate();

        const embed = generateEmbed({ interaction })
          .setThumbnail(file.url)
          .setAuthor({ name: t('command.read.subcommand.run.embed.author') })
          .setFields([
            {
              name: t('command.read.subcommand.run.embed.field.file'),
              value: hyperlink(
                file.name ?? file.url,
                file.url,
                file.description ?? t('misc.click.image'),
              ),
              inline: true,
            },
            {
              name: t('command.read.subcommand.run.embed.field.confidence'),
              value: `${Math.floor(confidence)}%`,
              inline: true,
            },
            {
              name: t('command.read.subcommand.run.embed.field.text', {
                locale: getImageReadLocale(language),
              }),
              value: text,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
