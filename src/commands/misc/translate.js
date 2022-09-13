const translate = require('@vitalets/google-translate-api');
const { bold, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Pagination } = require('pagination.djs');

const { extendedLocales } = require('../../constants');
const { getFlag, isAutoCorrecting } = require('../../utils');

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

    const embed = new EmbedBuilder()
      .setColor(interaction.guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: '📑 Translation Result',
      });

    switch (options.getSubcommand()) {
      case 'list': {
        const locales = Object.entries(extendedLocales)
          .filter(
            ([key, value]) => typeof value !== 'function' && key !== 'auto',
          )
          .sort(([key], [key2]) => key.localeCompare(key2));

        const response = locales.map(
          ([key, value], index) =>
            `${index + 1}. ${bold(key)} - ${value} ${getFlag(value)}`,
        );

        const pagination = new Pagination(interaction, {
          ephemeral: true,
          limit: 10,
        });

        pagination.setColor(interaction.guild.members.me.displayHexColor);
        pagination.setTimestamp(Date.now());
        pagination.setFooter({
          text: `${interaction.client.user.username} | Page {pageNumber} of {totalPages}`,
          iconURL: interaction.client.user.displayAvatarURL({
            dynamic: true,
          }),
        });
        pagination.setAuthor({
          name: `🌐 Translation Locale List (${locales.length})`,
        });
        pagination.setDescriptions(response);

        return pagination.render().catch((err) => console.error(err));
      }

      case 'run': {
        const text = options.getString('text');
        const from = options.getString('from');
        const to = options.getString('to');

        const reply = await interaction.deferReply({ fetchReply: true }).then(
          async () =>
            await interaction.editReply({
              content: 'translating the text, please wait...',
            }),
        );

        if (!from) {
          return translate(text, { to, autoCorrect: true })
            .then(async (result) => {
              const data = {
                embed,
                result,
                options: { text, to },
                reply,
              };

              await isAutoCorrecting(data);
            })
            .catch(async (err) => {
              console.error(err);
              await reply.edit({ content: err.message });
            })
            .finally(() => setTimeout(async () => await reply.delete(), 10000));
        }

        return translate(text, { from, to, autoCorrect: true })
          .then(async (res) => {
            const data = {
              embed,
              res,
              options: { text, from, to },
              reply,
            };

            await isAutoCorrecting(data);
          })
          .catch(async (err) => {
            console.error(err);
            await reply.edit({ content: err.message });
          })
          .finally(() => setTimeout(async () => await reply.delete(), 10000));
      }
    }
  },
};
