const { translate } = require('@vitalets/google-translate-api');
const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');

const { languages } = require('../../constants');
const { getLanguage, getTranslateFlag } = require('../../utils');

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
    const { client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({ name: '📑 Translation Result' });

    switch (options.getSubcommand()) {
      case 'list': {
        const locales = Object.entries(languages)
          .filter(([key]) => key !== 'auto')
          .sort(([key], [key2]) => key.localeCompare(key2));

        const responses = locales.map(
          ([key, value], index) =>
            `${bold(`${index + 1}. ${key}`)} - ${value} ${getTranslateFlag(
              value,
            )}`,
        );

        const pagination = new Pagination(interaction, { limit: 10 })
          .setColor(guild?.members.me?.displayHexColor ?? null)
          .setTimestamp(Date.now())
          .setFooter({
            text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({
            name: `🌐 Translation Locale Lists (${locales.length.toLocaleString()})`,
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
        const text = options.getString('text', true);
        const from = options.getString('from');
        const to = options.getString('to', true);

        const translateOptions = { to };

        if (from) Object.assign(translateOptions, { from });

        await wait(4000);

        const result = await translate(text, translateOptions);

        embed.setFields([
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

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
