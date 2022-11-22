const AnimeScraper = require('ctk-anime-scraper');
const {
  ChannelType,
  EmbedBuilder,
  hyperlink,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const pluralize = require('pluralize');

const { count } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('watch')
    .setDescription('🎥 Watch Command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('anime')
        .setDescription('🎥 Watch anime stream from GogoAnime.')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('🔤 The anime title search query.')
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName('episode')
            .setDescription('🔢 The anime episode search query.')
            .setMinValue(1),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('youtube')
        .setDescription('🎥 Watch YouTube video in a voice channel.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('🔊 Voice channel to be used to watch.')
            .addChannelTypes(ChannelType.GuildVoice)
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

    /** @type {{ discordTogether: import('discord-together').DiscordTogether<{[x: string]: string}> }} */
    const { discordTogether } = client;

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    switch (options.getSubcommand()) {
      case 'youtube': {
        const channel = options.getChannel('channel', true);

        await interaction.deferReply();

        const { code } = await discordTogether.createTogetherCode(
          channel.id,
          'youtube',
        );

        embed
          .setAuthor({
            name: 'YouTube Watch Invite Code',
            iconURL:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/YouTube_icon_%282013-2017%29.png/320px-YouTube_icon_%282013-2017%29.png',
          })
          .setDescription(
            `Grab your invite code ${pluralize(
              'here',
              code,
              `click here to watch YouTube in #${channel.name}`,
            )}.`,
          );

        return interaction.editReply({ embeds: [embed] });
      }

      case 'anime': {
        const title = options.getString('title', true);
        const episode = options.getInteger('episode') ?? 1;

        const Gogoanime = new AnimeScraper.Gogoanime();

        /** @type {import('../../constants/types').GogoAnimeSearch[]} */
        const results = await Gogoanime.search(title);

        if (!results.length) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `No result found for ${title}`,
          });
        }

        await interaction.deferReply();

        /** @type {import('../../constants/types').GogoAnimeFetch} */
        const { episodeCount, name, slug } = await Gogoanime.fetchAnime(
          results[0].link,
        );

        if (episode > Number(episodeCount)) {
          return interaction.editReply({
            content: `${name} only have ${count({
              total: episodeCount,
              data: 'episode',
            })}.`,
          });
        }

        /** @type {import('../../constants/types').GogoAnimeEpisode} */
        const { id, name: animeName } = await Gogoanime.getEpisodes(
          slug,
          episode,
        );

        const arr = animeName.split(' ');
        const query = new URLSearchParams({
          id,
          title: decodeURIComponent(
            arr.slice(0, arr.indexOf('English')).join('+'),
          ),
        });

        embed
          .setAuthor({
            name: 'Streaming Link Search Result',
            iconURL:
              'https://play-lh.googleusercontent.com/MaGEiAEhNHAJXcXKzqTNgxqRmhuKB1rCUgb15UrN_mWUNRnLpO5T1qja64oRasO7mn0',
          })
          .setDescription(
            hyperlink(
              arr.slice(0, arr.indexOf('at')).join(' '),
              `https://gogohd.net/streaming.php?${query}`,
              'Click here to watch the stream.',
            ),
          );

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
