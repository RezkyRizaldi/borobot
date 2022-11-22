const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  SlashCommandBuilder,
} = require('discord.js');
const mexp = require('math-expression-evaluator');
const { Pagination } = require('pagination.djs');

const { math } = require('../../constants');

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
    const { client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    await interaction.deferReply();

    switch (options.getSubcommand()) {
      case 'list': {
        const symbols = Object.values(math);

        const responses = symbols.map(
          ({ description, example, result, symbol }, index) =>
            `${bold(`${index + 1}.`)} ${inlineCode(symbol)} ${description}${
              example ? ` ${inlineCode(`eg. ${example}`)}` : ''
            }${result ? ` returns ${inlineCode(result)}` : ''}`,
        );

        const pagination = new Pagination(interaction, { limit: 10 })
          .setColor(guild?.members.me?.displayHexColor ?? null)
          .setTimestamp(Date.now())
          .setFooter({
            text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({
            name: `➗ Supported Math Symbol Lists (${symbols.length.toLocaleString()})`,
          })
          .setDescriptions(responses);

        pagination.buttons = {
          ...pagination.buttons,
          extra: new ButtonBuilder()
            .setCustomId('jump')
            .setEmoji('↕️')
            .setDisabled(false)
            .setStyle(ButtonStyle.Secondary),
        };

        paginations.set(pagination.interaction.id, pagination);

        return pagination.render();
      }

      case 'run': {
        const operation = options.getString('operation', true);

        const embed = new EmbedBuilder()
          .setColor(guild?.members.me?.displayHexColor ?? null)
          .setTimestamp(Date.now())
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({ name: '🧮 Calculation Result' })
          .setFields([
            {
              name: '🔢 Operation',
              value: operation,
              inline: true,
            },
            {
              name: '🔢 Result',
              value: `${mexp.eval(operation)}`,
              inline: true,
            },
          ]);

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
