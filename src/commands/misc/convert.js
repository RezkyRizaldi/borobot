const { convert } = require('convert');
const CC = require('currency-converter-lt');
const {
  bold,
  codeBlock,
  SlashCommandBuilder,
  hyperlink,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');

const { units } = require('@/constants');
const { count, generateEmbed, generatePagination } = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('🚀 Converter command.')
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName('currency')
        .setDescription('💲 Currency converter.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('📄 View available supported currencies.'),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('run')
            .setDescription(
              '🚀 convert an amount from one currency to another.',
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription(
                  '🔢 The amount of the currency to be converted.',
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('from')
                .setDescription('💲 The currency to convert from.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('to')
                .setDescription('💲 The currency to convert to.')
                .setRequired(true),
            ),
        ),
    )
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName('unit')
        .setDescription('♾️ SI unit converter.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('📄 View available SI units.'),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('run')
            .setDescription('🚀 convert an amount from one unit to another.')
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('🔢 The amount of the unit to be converted.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('from')
                .setDescription('♾️ The unit to convert from.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('to')
                .setDescription('♾️ The unit to convert to.')
                .setRequired(true),
            ),
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
      currency: () => {
        const currencyConverter = new CC();

        return {
          list: async () => {
            const currencies = Object.entries(
              currencyConverter.currencies,
            ).sort(([k], [k2]) => k.localeCompare(k2));

            const responses = currencies.map(
              ([k, v], i) => `${bold(`${i + 1}. ${k}`)} - ${v}`,
            );

            await generatePagination({ interaction, limit: 10 })
              .setAuthor({
                name: t('command.convert.subcommandGroup.currency.pagination', {
                  total: count(currencies),
                }),
              })
              .setDescriptions(responses)
              .render();
          },
          run: async () => {
            const amount = options.getInteger('amount', true);
            const from = options.getString('from', true);
            const to = options.getString('to', true);
            const fromCurrency = currencyConverter.currencyCode.find(
              (currency) => currency.toLowerCase() === from.toLowerCase(),
            );
            const toCurrency = currencyConverter.currencyCode.find(
              (currency) => currency.toLowerCase() === to.toLowerCase(),
            );

            if (!fromCurrency || !toCurrency) {
              throw t('global.error.currency', {
                link: hyperlink(
                  t('misc.currency'),
                  `https://${locale
                    .split('-')
                    .shift()}.wikipedia.org/wiki/ISO_4217`,
                ),
              });
            }

            const result = await currencyConverter
              .from(fromCurrency)
              .to(toCurrency)
              .convert(amount);

            embed
              .setAuthor({
                name: t('command.convert.subcommandGroup.currency.embed'),
              })
              .setDescription(
                codeBlock(
                  `${amount} ${fromCurrency} = ${result} ${toCurrency}`,
                ),
              );

            await interaction.editReply({ embeds: [embed] });
          },
        }[options.getSubcommand()]();
      },
      unit: () => {
        return {
          list: async () => {
            const responses = units
              .sort((a, b) => a.localeCompare(b))
              .map((unit, i) => `${bold(`${i + 1}.`)} ${unit}`);

            await generatePagination({ interaction, limit: 10 })
              .setAuthor({
                name: t('command.convert.subcommandGroup.unit.pagination', {
                  total: count(units),
                }),
              })
              .setDescriptions(responses)
              .render();
          },
          run: async () => {
            const amount = options.getInteger('amount', true);
            const from = options.getString('from', true);
            const to = options.getString('to', true);
            const fromUnit = units.find(
              (unit) => unit.toLowerCase() === from.toLowerCase(),
            );
            const toUnit = units.find(
              (unit) => unit.toLowerCase() === to.toLowerCase(),
            );

            if (!fromUnit || !toUnit) {
              throw t('global.error.unit', {
                link: hyperlink(
                  t('misc.unit'),
                  `https://${locale
                    .split('-')
                    .shift()}.wikipedia.org/wiki/International_System_of_Units`,
                ),
              });
            }

            /** @type {Number} */
            const result = convert(amount, fromUnit).to(toUnit);

            embed
              .setAuthor({
                name: t('command.convert.subcommandGroup.unit.embed'),
              })
              .setDescription(
                codeBlock(`${amount} ${fromUnit} = ${result} ${toUnit}`),
              );

            await interaction.editReply({ embeds: [embed] });
          },
        }[options.getSubcommand()]();
      },
    }[options.getSubcommandGroup()]();
  },
};
