const { translate } = require('@vitalets/google-translate-api');
const { bold, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const { languages } = require('../../constants');
const {
  generatePagination,
  getLanguage,
  getTranslateFlag,
  generateEmbed,
} = require('../../utils');

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
    const { options } = interaction;

    await interaction.deferReply();

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
            name: `🌐 Translation Locale Lists (${locales.length.toLocaleString()})`,
          })
          .setDescriptions(responses)
          .render();
      },
      run: async () => {
        const text = options.getString('text', true);
        const from = options.getString('from');
        const to = options.getString('to', true);
        const translateOptions = { to };

        if (from) Object.assign(translateOptions, { from });

        await wait(4000);

        const result = await translate(text, translateOptions);

        embed.setAuthor({ name: '📑 Translation Result' }).setFields([
          {
            name: `From ${getLanguage(languages, result.raw.src)}${
              from ? '' : ' - Detected'
            } ${getTranslateFlag(languages[result.raw.src])}`,
            value: result.raw.sentences[0].orig,
          },
          {
            name: `To ${getLanguage(languages, to)} ${getTranslateFlag(
              languages[to.toLowerCase()],
            )}`,
            value: result.text,
          },
        ]);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
