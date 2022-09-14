const { bold, inlineCode } = require('discord.js');
const { SearchResultType } = require('distube');

/**
 *
 * @param {{ embed: import('discord.js').EmbedBuilder, interaction: import('discord.js').ChatInputCommandInteraction, searchResults: import('distube').SearchResult[], type: String }} data
 * @returns {Promise<import('discord.js').Message>} The interaction message response.
 */
module.exports = async ({ embed, interaction, searchResults, type }) => {
  /** @type {{ member: import('discord.js').GuildMember, channel: import('discord.js').TextChannel, client: { distube: import('distube').DisTube }}} */
  const {
    member,
    channel: textChannel,
    client: { distube },
  } = interaction;
  const { voice } = member;
  const { channel: voiceChannel } = voice;

  embed.setAuthor({
    name: `🔍 ${
      type === SearchResultType.VIDEO ? 'Video' : 'Playlist'
    } Search Result`,
  });
  embed.setDescription(
    searchResults
      .map(
        (searchResult, index) =>
          `${bold(index + 1)}. ${inlineCode(searchResult.name)} ${
            searchResult.type === SearchResultType.VIDEO
              ? `- ${inlineCode(searchResult.formattedDuration)}`
              : `by ${inlineCode(searchResult.uploader.name)}`
          }`,
      )
      .join('\n'),
  );

  return interaction.editReply({ embeds: [embed] }).then(() => {
    /**
     *
     * @param {import('discord.js').Message} message
     * @returns {Boolean} Boolean value of the filtered interaction.
     */
    const filter = (message) =>
      Array.from(
        { length: searchResults.length },
        (_, i) => `${i + 1}`,
      ).includes(message.content);

    const collector = textChannel.createMessageCollector({
      filter,
      time: 15000,
    });

    collector.once('collect', (message) => {
      distube.play(voiceChannel, searchResults[+message.content - 1].name, {
        textChannel,
        member,
      });
    });

    collector.once('end', async (messages) => await messages.first().delete());
  });
};
