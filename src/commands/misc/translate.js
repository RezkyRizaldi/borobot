const { translate } = require('@vitalets/google-translate-api');
const { bold, SlashCommandBuilder } = require('discord.js');
const createHttpProxyAgent = require('http-proxy-agent');
const { changeLanguage, t } = require('i18next');
const wait = require('node:timers/promises').setTimeout;

const { languages } = require('@/constants');
const {
  count,
  generatePagination,
  getLanguage,
  getTranslateFlag,
  generateEmbed,
} = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('📑 Translate command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('🌐 View available language locales.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('run')
        .setDescription('📑 Translate a text from one language to another.')
        .addStringOption((option) =>
          option
            .setName('text')
            .setDescription('🔤 The text to translate.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('to')
            .setDescription('🌐 The language locale to translate to.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('from')
            .setDescription('🌐 The language locale to translate from.'),
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

    const embed = generateEmbed({ interaction });

    return {
      list: async () => {
        const locales = Object.entries(languages)
          .filter(([k]) => k !== 'auto')
          .sort(([k], [k2]) => k.localeCompare(k2));

        const responses = locales.map(
          ([k, v], i) =>
            `${bold(`${i + 1}. ${k}`)} - ${v} ${getTranslateFlag(v)}`,
        );

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: t('command.translate.subcommand.list.pagination', {
              total: count(locales),
            }),
          })
          .setDescriptions(responses)
          .render();
      },
      run: async () => {
        const text = options.getString('text', true);
        const from = options.getString('from');
        const to = options.getString('to', true);
        const agent = createHttpProxyAgent('http://103.178.43.102:8181');
        const translateOptions = { to, agent };

        if (from) Object.assign(translateOptions, { from });

        await wait(4000);

        const result = await translate(text, translateOptions);

        embed
          .setAuthor({
            name: t('command.translate.subcommand.run.embed.author'),
          })
          .setFields([
            {
              name: t('command.translate.subcommand.run.embed.field.from', {
                from: `${getLanguage(languages, result.raw.src)}${
                  from ? '' : ` - ${t('misc.detected')}`
                } ${getTranslateFlag(languages[result.raw.src])}`,
              }),
              value: result.raw.sentences[0].orig,
            },
            {
              name: t('command.translate.subcommand.run.embed.field.from', {
                to: `${getLanguage(languages, to)} ${getTranslateFlag(
                  languages[to.toLowerCase()],
                )}`,
              }),
              value: result.text,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
