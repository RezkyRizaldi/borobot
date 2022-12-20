const { bold, inlineCode, SlashCommandBuilder } = require('discord.js');
const mexp = require('math-expression-evaluator');

const { math } = require('@/constants');
const { generateEmbed, generatePagination } = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('🧮 Calculator command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('➗ View supported math symbols.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('run')
        .setDescription('🧮 calculate a math operation.')
        .addStringOption((option) =>
          option
            .setName('operation')
            .setDescription('🔢 The operation to calculate.')
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
        const symbols = Object.values(math);

        const responses = symbols.map(
          ({ description, example, result, symbol }, i) =>
            `${bold(`${i + 1}.`)} ${inlineCode(symbol)} ${description}${
              example ? ` ${inlineCode(`eg. ${example}`)}` : ''
            }${result ? ` returns ${inlineCode(result)}` : ''}`,
        );

        await generatePagination({ interaction, limit: 10 })
          .setAuthor({
            name: `➗ Supported Math Symbol Lists (${symbols.length.toLocaleString()})`,
          })
          .setDescriptions(responses)
          .render();
      },
      run: async () => {
        const operation = options.getString('operation', true);

        const embed = generateEmbed({ interaction })
          .setAuthor({ name: '🧮 Calculation Result' })
          .setFields([
            { name: '🔢 Operation', value: operation, inline: true },
            {
              name: '🔢 Result',
              value: `${mexp.eval(operation)}`,
              inline: true,
            },
          ]);

        await interaction.editReply({ embeds: [embed] });
      },
    }[options.getSubcommand()]();
  },
};
