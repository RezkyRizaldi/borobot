const AnimeScraper = require('ctk-anime-scraper');
const {
  ChannelType,
  EmbedBuilder,
  hyperlink,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const pluralize = require('pluralize');

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
            .setDescription('🔢 The anime episode search query.'),
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
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommand()) {
      case 'youtube': {
        const channel = options.getChannel('channel');

        return interaction.deferReply().then(
          async () =>
            await discordTogether
              .createTogetherCode(channel.id, 'youtube')
              .then(async ({ code }) => {
                embed.setAuthor({
                  name: '🔗 YouTube Watch Invite Code',
                });
                embed.setDescription(
                  `Grab your invite code ${pluralize(
                    'here',
                    code,
                    `click here to watch YouTube in #${channel.name}`,
                  )}.`,
                );

                await interaction.editReply({
                  embeds: [embed],
                });
              }),
        );
      }

      case 'anime': {
        const title = options.getString('title');
        const episode = options.getInteger('episode') ?? 1;

        const Gogoanime = new AnimeScraper.Gogoanime();

        return interaction.deferReply().then(async () => {
          await wait(4000);

          await Gogoanime.search(title).then(async (results) => {
            if (!results.length) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: `No result found for ${title}`,
                  }),
              );
            }

            await Gogoanime.fetchAnime(results[0].link).then(
              async ({ episodeCount, name, slug }) => {
                if (episode > episodeCount) {
                  return interaction.editReply({
                    content: `${name} only have ${pluralize(
                      'episode',
                      episodeCount,
                      true,
                    )}.`,
                  });
                }

                await Gogoanime.getEpisodes(slug, episode).then(
                  async ({ id, name: animeName }) => {
                    const arr = animeName.split(' ');
                    const formattedTitle = arr
                      .slice(0, arr.indexOf('English'))
                      .join('+');

                    const query = new URLSearchParams({
                      id,
                      title: decodeURIComponent(formattedTitle),
                    });

                    embed.setAuthor({
                      name: '🎥 Streaming Link Search Result',
                    });
                    embed.setDescription(
                      hyperlink(
                        arr.slice(0, arr.indexOf('at')).join(' '),
                        `https://gogohd.net/streaming.php?${query}`,
                        'Click here to watch the stream.',
                      ),
                    );

                    await interaction.editReply({ embeds: [embed] });
                  },
                );
              },
            );
          });
        });
      }
    }
  },
};
