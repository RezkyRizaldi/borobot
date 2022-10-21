const translate = require('@vitalets/google-translate-api');
const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { Pagination } = require('pagination.djs');

const { extendedLocales } = require('../../constants');
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

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '📑 Translation Result',
      });

    switch (options.getSubcommand()) {
      case 'list':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          const locales = Object.entries(extendedLocales)
            .filter(
              ([key, value]) => typeof value !== 'function' && key !== 'auto',
            )
            .sort(([key], [key2]) => key.localeCompare(key2));

          const responses = locales.map(
            ([key, value], index) =>
              `${bold(`${index + 1}. ${key}`)} - ${value} ${getTranslateFlag(
                value,
              )}`,
          );

          const pagination = new Pagination(interaction, {
            limit: 10,
          });

          pagination.setColor(guild.members.me.displayHexColor);
          pagination.setTimestamp(Date.now());
          pagination.setFooter({
            text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
            }),
          });
          pagination.setAuthor({
            name: `🌐 Translation Locale Lists (${locales.length.toLocaleString()})`,
          });
          pagination.setDescriptions(responses);

          pagination.buttons = {
            ...pagination.buttons,
            extra: new ButtonBuilder()
              .setCustomId('jump')
              .setEmoji('↕️')
              .setDisabled(false)
              .setStyle(ButtonStyle.Secondary),
          };

          paginations.set(pagination.interaction.id, pagination);

          await pagination.render();
        });

      case 'run': {
        const text = options.getString('text');
        const from = options.getString('from');
        const to = options.getString('to');

        const translateOptions = { to, autoCorrect: true };

        if (from) Object.assign(translateOptions, { from });

        return interaction.deferReply().then(
          async () =>
            await wait(4000).then(
              async () =>
                await translate(text, translateOptions).then(async (result) => {
                  if (!result.from.text.didYouMean) {
                    embed.setFields([
                      {
                        name: `From ${getLanguage(
                          extendedLocales,
                          result.from.language.iso,
                        )}${from ? '' : ' - Detected'} ${getTranslateFlag(
                          extendedLocales[result.from.language.iso],
                        )}`,
                        value: text,
                      },
                      {
                        name: `To ${getLanguage(
                          extendedLocales,
                          to,
                        )} ${getTranslateFlag(
                          extendedLocales[to.toLowerCase()],
                        )}`,
                        value: result.text,
                      },
                    ]);

                    return interaction.editReply({ embeds: [embed] });
                  }

                  await translate(
                    result.from.text.value.replace(/\[([a-z]+)\]/gi, '$1'),
                    {
                      to,
                    },
                  ).then(async (res) => {
                    embed.setFields([
                      {
                        name: `From ${getLanguage(
                          extendedLocales,
                          res.from.language.iso,
                        )}${from ? '' : ' - Detected'} ${getTranslateFlag(
                          extendedLocales[res.from.language.iso],
                        )}`,
                        value: text,
                      },
                      {
                        name: `To ${getLanguage(
                          extendedLocales,
                          to,
                        )} ${getTranslateFlag(
                          extendedLocales[to.toLowerCase()],
                        )}`,
                        value: res.text,
                      },
                    ]);

                    await interaction.editReply({ embeds: [embed] });
                  });
                }),
            ),
        );
      }
    }
  },
};
