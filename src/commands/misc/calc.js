const { bold, inlineCode, SlashCommandBuilder } = require('discord.js');
const { changeLanguage, t } = require('i18next');
const Mexp = require('math-expression-evaluator');

const { math } = require('@/constants');
const { count, generateEmbed, generatePagination } = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('🧮 Calculator command.')
    .setDescriptionLocalizations({
      'es-ES': t('command.calc.description', { lng: 'es-ES' }),
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('➗ Displays supported math symbols.')
        .setDescriptionLocalizations({
          'es-ES': t('command.calc.subcommand.list.description', {
            lng: 'es-ES',
          }),
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('run')
        .setDescription('🧮 Calculate a math operation.')
        .setDescriptionLocalizations({
          'es-ES': t('command.calc.subcommand.run.description', {
            lng: 'es-ES',
          }),
        })
        .addStringOption((option) =>
          option
            .setName('operation')
            .setDescription('🔢 The operation to be calculated.')
            .setDescriptionLocalizations({
              'es-ES': t(
                'command.calc.subcommand.run.option.operation.description',
                { lng: 'es-ES' },
              ),
            })
            .setRequired(true),
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
        const symbols = Object.entries(math).map(([k, v]) => ({
          ...v,
          description: t(`global.constant.math.${k}`),
        }));

        const responses = symbols.map(
          ({ description, example, result, symbol }, i) =>
            `${bold(`${i + 1}.`)} ${inlineCode(symbol)} ${description}${
              example ? ` ${inlineCode(`${t('misc.eg')} ${example}`)}` : ''
            }${result ? ` ${t('misc.returns')} ${inlineCode(result)}` : ''}`,
        );

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: t('command.calc.pagination', {
              total: count(symbols),
            }),
          })
          .setDescriptions(responses)
          .render();
      },
      run: async () => {
        const operation = options.getString('operation', true);
        const mexp = new Mexp();

        const embed = generateEmbed({ interaction })
          .setAuthor({ name: t('command.calc.embed.author') })
          .setFields([
            {
              name: t('command.calc.embed.field.operation'),
              value: operation,
              inline: true,
            },
            {
              name: t('command.calc.embed.field.result'),
              value: `${mexp.eval(operation)}`,
              inline: true,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
