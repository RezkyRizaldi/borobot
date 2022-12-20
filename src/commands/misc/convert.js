const { convert } = require('convert');
const CC = require('currency-converter-lt');
const { bold, codeBlock, SlashCommandBuilder } = require('discord.js');

const { units } = require('@/constants');
const { generateEmbed, generatePagination } = require('@/utils');

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
    const { options } = interaction;
    const embed = generateEmbed({ interaction });

    await interaction.deferReply();

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
                name: `💲 Currency Lists (${currencies.length.toLocaleString()})`,
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
              throw 'Please provide a valid unit.';
            }

            const result = await currencyConverter
              .from(fromCurrency)
              .to(toCurrency)
              .amount(amount)
              .setDecimalComma(true)
              .setupRatesCache({ isRatesCaching: true })
              .convert();

            embed
              .setAuthor({
                name: '💲 Currency Conversion Result',
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
              .map((unit, i) => `${bold(`${i + 1}.`)} - ${unit}`);

            await generatePagination({ interaction, limit: 10 })
              .setAuthor({
                name: `📄 SI Unit Lists (${units.length.toLocaleString()})`,
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
              throw 'Please provide a valid unit.';
            }

            /** @type {Number} */
            const result = convert(amount, fromUnit).to(toUnit);

            embed
              .setAuthor({
                name: '♾️ Unit Conversion Result',
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
