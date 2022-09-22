const translate = require('@vitalets/google-translate-api');
const { bold, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
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
    const { client, guild, options } = interaction;

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
      case 'list': {
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          const locales = Object.entries(extendedLocales)
            .filter(
              ([key, value]) => typeof value !== 'function' && key !== 'auto',
            )
            .sort(([key], [key2]) => key.localeCompare(key2));

          const responses = locales.map(
            ([key, value], index) =>
              `${bold(`${index + 1}.`)} ${bold(key)} - ${value} ${getFlag(
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
            name: `🌐 Translation Locale Lists (${locales.length})`,
          });
          pagination.setDescriptions(responses);

          await pagination.render();
        });
      }

      case 'run': {
        const text = options.getString('text');
        const from = options.getString('from');
        const to = options.getString('to');

        return interaction.deferReply().then(async () => {
          await wait(4000).then(async () => {
            if (!from) {
              return translate(text, { to, autoCorrect: true }).then(
                async (result) => {
                  const data = {
                    embed,
                    result,
                    options: { text, to },
                    interaction,
                  };

                  await isAutoCorrecting(data);
                },
              );
            }

            await translate(text, { from, to, autoCorrect: true }).then(
              async (res) => {
                const data = {
                  embed,
                  res,
                  options: { text, from, to },
                  interaction,
                };

                await isAutoCorrecting(data);
              },
            );
          });
        });
      }
    }
  },
};
