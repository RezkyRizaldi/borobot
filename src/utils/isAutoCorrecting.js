const translate = require('@vitalets/google-translate-api');

const { extendedLocales: languages } = require('../constants');
const getFlag = require('./getFlag');
const getLanguage = require('./getLanguage');

/**
 *
 * @param {{ embed: import('discord.js').EmbedBuilder, result: import('@vitalets/google-translate-api').ITranslateResponse, options: { text: String|null, from: String|null, to: String|null }, interaction: import('discord.js').ChatInputCommandInteraction }} data
 * @returns {Promise<import('discord.js').Message>} The interaction message response.
 */
module.exports = async ({
  embed,
  result,
  options: { text, from, to },
  interaction,
}) => {
  if (!result.from.text.didYouMean) {
    embed.setFields([
      {
        name: `From ${getLanguage(languages, result.from.language.iso)}${
          from ? '' : ' - Detected'
        } ${getFlag(languages[result.from.language.iso])}`,
        value: text,
      },
      {
        name: `To ${getLanguage(languages, to)} ${getFlag(
          languages[to.toLowerCase()],
        )}`,
        value: result.text,
      },
    ]);

    return interaction.editReply({ embeds: [embed] });
  }

  return translate(result.from.text.value.replace(/\[([a-z]+)\]/gi, '$1'), {
    to,
  }).then(async (res) => {
    embed.setFields([
      {
        name: `From ${getLanguage(languages, res.from.language.iso)}${
          from ? '' : ' - Detected'
        } ${getFlag(languages[res.from.language.iso])}`,
        value: text,
      },
      {
        name: `To ${getLanguage(languages, to)} ${getFlag(
          languages[to.toLowerCase()],
        )}`,
        value: res.text,
      },
    ]);

    await interaction.editReply({ embeds: [embed] });
  });
};
