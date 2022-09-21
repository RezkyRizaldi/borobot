const {
  bold,
  EmbedBuilder,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { SearchResultType } = require('distube');
const { getLyrics } = require('genius-lyrics-api');
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');
const progressbar = require('string-progressbar');

const { musicSettingChoices } = require('../../constants');
const { applyRepeatMode, musicSearch } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('🎼 Music command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('play')
        .setDescription('🎶 Play a song.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The music search query.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playskip')
        .setDescription('🎶 Play a song and skip the current playing queue.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The music search query.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playfirst')
        .setDescription('🎶 Play a song and put it in the first queue.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The music search query.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('search')
        .setDescription('🔍 search a song.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The music search query.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🔣 The music search type.')
            .setRequired(true)
            .addChoices(
              {
                name: 'Video',
                value: SearchResultType.VIDEO,
              },
              {
                name: 'Playlist',
                value: SearchResultType.PLAYLIST,
              },
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('filters')
        .setDescription(
          '🎚️ Set the music filters for the current playing queue.',
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('apply')
            .setDescription(
              '➕ Add music filters for the current playing queue.',
            )
            .addStringOption((option) =>
              option
                .setName('filter')
                .setDescription('🎚️ The music filter to add.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('cease')
            .setDescription(
              '➖ Remove music filters in the current playing queue.',
            )
            .addStringOption((option) =>
              option
                .setName('filter')
                .setDescription('🎚️ The music filter to remove.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('clear')
            .setDescription('❌ Turn off the music filters.'),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('playback')
        .setDescription('⏲️ The music playback controls.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('forward')
            .setDescription('⏩ Fast forward the music playback.')
            .addNumberOption((option) =>
              option
                .setName('time')
                .setDescription('🕒 The song time to play.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('seek')
            .setDescription('🕒 Set the time of the music playback.')
            .addNumberOption((option) =>
              option
                .setName('time')
                .setDescription('🕒 The song time to play.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('rewind')
            .setDescription('⏪ Fast reverse the music playback.')
            .addNumberOption((option) =>
              option
                .setName('time')
                .setDescription('🕒 The song time to play.')
                .setRequired(true),
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('settings')
        .setDescription('⚙️ The music settings.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('lyrics')
            .setDescription(
              '🗒️ Get the music lyrics from current playing queue.',
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('jump')
            .setDescription('⏭️ Jump to specific song in the queue.')
            .addNumberOption((option) =>
              option
                .setName('position')
                .setDescription('🔢 The song position.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('volume')
            .setDescription('🔊 Set the music volume.')
            .addNumberOption((option) =>
              option
                .setName('percentage')
                .setDescription('🔢 The music volume percentage.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('controls')
            .setDescription('🎚️ The music controller options.')
            .addStringOption((option) =>
              option
                .setName('options')
                .setDescription('🎚️ Set the music setting options.')
                .setRequired(true)
                .addChoices(...musicSettingChoices),
            ),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: import('discord.js').TextChannel, client: import('discord.js').Client, member: import('discord.js').GuildMember, guild: import('discord.js').Guild, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const {
      channel: textChannel,
      client,
      guild,
      member,
      options,
    } = interaction;

    /** @type {{ distube: import('distube').DisTube }} */
    const { distube } = client;

    const { voice } = member;
    const { channel: voiceChannel } = voice;

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    const musicChannel = guild.channels.cache.find(
      (channel) => channel.id == process.env.CHANNEL_MUSIC_COMMAND_ID,
    );

    if (interaction.channelId !== musicChannel.id) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: `Please use this command in ${musicChannel}.`,
          }),
      );
    }

    if (!voiceChannel) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content:
              'You must be in a voice channel to be able to use this command.',
          }),
      );
    }

    if (
      !!guild.members.me.voice.channel &&
      guild.members.me.voice.channelId !== voiceChannel.id
    ) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: `Already playing music in ${guild.members.me.voice.channel}.`,
          }),
      );
    }

    const query = options.getString('query');

    switch (options.getSubcommand()) {
      case 'play':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          distube.play(voiceChannel, query, {
            textChannel,
            member,
          });

          await interaction.editReply({ content: 'Request received.' });
        });

      case 'playskip':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          distube.play(voiceChannel, query, {
            textChannel,
            member,
            skip: true,
          });

          await interaction.editReply({ content: 'Request received.' });
        });

      case 'playfirst':
        return interaction.deferReply({ ephemeral: true }).then(async () => {
          distube.play(voiceChannel, query, {
            textChannel,
            member,
            position: 1,
          });

          await interaction.editReply({ content: 'Request received.' });
        });

      case 'search': {
        const type = interaction.options.getString('type');

        return interaction.deferReply().then(
          async () =>
            await distube
              .search(query, {
                limit: 10,
                type,
              })
              .then(
                async (searchResults) =>
                  await musicSearch({
                    embed,
                    interaction,
                    searchResults,
                    type,
                  }),
              )
              .catch(async (err) => {
                console.error(err);

                await interaction.editReply({
                  content: err.message,
                });
              }),
        );
      }
    }

    const queue = distube.getQueue(voiceChannel);

    switch (interaction.options.getSubcommandGroup()) {
      case 'filters':
        {
          const filter = options.getString('filter');

          if (!queue) {
            return interaction.deferReply({ ephemeral: true }).then(
              async () =>
                await interaction.editReply({
                  content: 'There is no playing queue now.',
                }),
            );
          }

          switch (options.getSubcommand()) {
            case 'apply':
              if (!queue.filters.names.includes(filter)) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: 'Please provide a valid filters.',
                    }),
                );
              }

              if (!queue.filters.has(filter)) {
                return interaction.deferReply().then(async () => {
                  queue.filters.set(filter);

                  embed.setAuthor({
                    name: '🎚️ Music Filters Applied',
                  });
                  embed.setDescription(
                    'The music filters successfully applied.',
                  );

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              return interaction.deferReply().then(async () => {
                queue.filters.add(filter, true);

                embed.setAuthor({
                  name: '🎚️ Music Filters Applied',
                });
                embed.setDescription('The music filters successfully applied.');

                await interaction.editReply({ embeds: [embed] });
              });

            case 'cease':
              if (!queue.filters.names.includes(filter)) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: 'Please provide a valid filters.',
                    }),
                );
              }

              if (!queue.filters.has(filter)) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: "The queue doesn't have that filters.",
                    }),
                );
              }

              return interaction.deferReply().then(async () => {
                queue.filters.remove(filter);

                embed.setAuthor({
                  name: '🎚️ Music Filters Ceased',
                });
                embed.setDescription('The music filters successfully ceased.');

                await interaction.editReply({ embeds: [embed] });
              });

            case 'clear':
              if (!queue.filters.size) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.reply({
                      content: "The queue doesn't have any filters.",
                    }),
                );
              }

              return interaction.deferReply().then(async () => {
                queue.filters.clear();

                embed.setAuthor({
                  name: '🎚️ Music Filters Cleared',
                });
                embed.setDescription('The music filters successfully cleared.');

                await interaction.editReply({ embeds: [embed] });
              });
          }
        }
        break;

      case 'playback':
        {
          const time = options.getInteger('time');

          if (!queue) {
            return interaction.deferReply({ ephemeral: true }).then(
              async () =>
                await interaction.editReply({
                  content: 'There is no playing queue now.',
                }),
            );
          }

          switch (options.getSubcommand()) {
            case 'forward': {
              if (time > queue.duration || queue.currentTime > queue.duration) {
                return interaction.deferReply().then(async () => {
                  queue.seek(queue.beginTime);

                  embed.setAuthor({
                    name: '🕒 Queue Time Adjusted',
                  });
                  embed.setDescription(
                    `The queue time has been set to ${inlineCode(
                      queue.formattedCurrentTime,
                    )}.`,
                  );

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              return interaction.deferReply().then(async () => {
                queue.seek(queue.currentTime + time);

                embed.setAuthor({
                  name: '🕒 Queue Time Adjusted',
                });
                embed.setDescription(
                  `The queue time has been set to ${inlineCode(
                    queue.formattedCurrentTime,
                  )}.`,
                );

                await interaction.editReply({ embeds: [embed] });
              });
            }

            case 'seek': {
              if (time > queue.duration) {
                return interaction.deferReply().then(async () => {
                  queue.seek(queue.beginTime);

                  embed.setAuthor({
                    name: '🕒 Queue Time Adjusted',
                  });
                  embed.setDescription(
                    `The queue time has been set to ${inlineCode(
                      queue.formattedCurrentTime,
                    )}.`,
                  );

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              return interaction.deferReply().then(async () => {
                queue.seek(time);

                embed.setAuthor({
                  name: '🕒 Queue Time Adjusted',
                });
                embed.setDescription(
                  `The queue time has been set to ${inlineCode(
                    queue.formattedCurrentTime,
                  )}.`,
                );

                await interaction.editReply({ embeds: [embed] });
              });
            }

            case 'rewind': {
              if (
                time > queue.duration ||
                queue.currentTime < queue.beginTime
              ) {
                return interaction.deferReply().then(async () => {
                  queue.seek(queue.beginTime);

                  embed.setAuthor({
                    name: '🕒 Queue Time Adjusted',
                  });
                  embed.setDescription(
                    `The queue time has been set to ${inlineCode(
                      queue.formattedCurrentTime,
                    )}.`,
                  );

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              return interaction.deferReply().then(async () => {
                queue.seek(queue.currentTime - time);

                embed.setAuthor({
                  name: '🕒 Queue Time Adjusted',
                });
                embed.setDescription(
                  `The queue time has been set to ${inlineCode(
                    queue.formattedCurrentTime,
                  )}.`,
                );

                await interaction.editReply({ embeds: [embed] });
              });
            }
          }
        }
        break;

      case 'settings':
        if (!queue) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'There is no playing queue now.',
              }),
          );
        }

        switch (options.getSubcommand()) {
          case 'lyrics':
            return getLyrics({
              apiKey: process.env.GENIUS_CLIENT_ACCESS_TOKEN,
              title: queue.songs[0].name,
              artist: queue.songs[0].uploader.name,
              optimizeQuery: true,
            }).then(async (lyrics) => {
              if (!lyrics) {
                return interaction.deferReply({ ephemeral: true }).then(
                  async () =>
                    await interaction.editReply({
                      content: `There is no lyrics found for ${inlineCode(
                        queue.songs[0].name,
                      )}.`,
                    }),
                );
              }

              embed.setAuthor({
                name: `🗒️ ${queue.songs[0].name}`,
              });
              embed.setDescription(lyrics);

              if (queue.songs[0].thumbnail !== undefined) {
                embed.setThumbnail(queue.songs[0].thumbnail);
              }

              await interaction
                .deferReply()
                .then(
                  async () => await interaction.editReply({ embeds: [embed] }),
                );
            });

          case 'jump': {
            const position = options.getInteger('position');

            if (position > queue.songs.length) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.editReply({
                    content: `The queue only have ${pluralize(
                      'song',
                      queue.songs.length,
                      true,
                    )}.`,
                  }),
              );
            }

            return interaction.deferReply().then(async () => {
              await queue.jump(position).then(async (song) => {
                embed.setAuthor({
                  name: '🔢 Queue Jumped',
                });
                embed.setDescription('The queue has been jumped.');
                embed.setFields([
                  {
                    name: 'Next Up',
                    value: `${inlineCode(song.name)} - ${inlineCode(
                      song.formattedDuration,
                    )}\nRequested by: ${song.user}.`,
                  },
                ]);

                if (song.thumbnail !== undefined) {
                  embed.setThumbnail(song.thumbnail);
                }

                await interaction.editReply({ embeds: [embed] });
              });
            });
          }

          case 'volume': {
            const percentage = options.getInteger('percentage');

            if (percentage > 100 || percentage < 1) {
              return interaction.deferReply({ ephemeral: true }).then(
                async () =>
                  await interaction.reply({
                    content: 'You have to specify a number between 1 to 100.',
                  }),
              );
            }

            return interaction.deferReply().then(async () => {
              queue.setVolume(voiceChannel, percentage);

              embed.setAuthor({
                name: '🔊 Volume Adjusted',
              });
              embed.setDescription(
                `The volume has been set to ${inlineCode(`${queue.volume}%`)}.`,
              );

              await interaction.editReply({ embeds: [embed] });
            });
          }

          case 'controls':
            switch (options.getString('options')) {
              case 'nowPlaying':
                return interaction.deferReply().then(async () => {
                  embed.setAuthor({
                    name: '💿 Now Playing',
                  });
                  embed.setDescription(
                    `${inlineCode(queue.songs[0].name)} - ${inlineCode(
                      queue.songs[0].formattedDuration,
                    )}\nRequested by: ${queue.songs[0].user}\n${
                      queue.formattedCurrentTime
                    } - [${progressbar
                      .splitBar(queue.songs[0].duration, queue.currentTime, 12)
                      .slice(0, -1)
                      .toString()}] - ${queue.songs[0].formattedDuration}`,
                  );

                  if (queue.songs[0].thumbnail !== undefined) {
                    embed.setThumbnail(queue.songs[0].thumbnail);
                  }

                  await interaction
                    .editReply({ embeds: [embed] })
                    .then((message) => {
                      const interval = setInterval(async () => {
                        if (queue.currentTime === queue.songs[0]?.duration) {
                          clearInterval(interval);
                        }

                        embed.setDescription(
                          `${inlineCode(queue.songs[0]?.name)} - ${inlineCode(
                            queue.songs[0]?.formattedDuration,
                          )}\nRequested by: ${queue.songs[0]?.user}\n${
                            queue.formattedCurrentTime
                          } - [${progressbar
                            .splitBar(
                              queue.songs.length
                                ? queue.songs[0]?.duration
                                : 10,
                              queue.currentTime,
                              12,
                            )
                            .slice(0, -1)
                            .toString()}] - ${
                            queue.songs[0]?.formattedDuration
                          }`,
                        );

                        await message.edit({ embeds: [embed] });
                      }, 1000);
                    });
                });

              case 'skip':
                return interaction.deferReply().then(async () => {
                  await queue.skip(voiceChannel).then(async (song) => {
                    embed.setAuthor({
                      name: '⏩ Queue Skipped',
                    });
                    embed.setDescription('The queue has been skipped.');
                    embed.setFields([
                      {
                        name: 'Next Up',
                        value: `${inlineCode(song.name)} - ${inlineCode(
                          song.formattedDuration,
                        )}\nRequested by: ${song.user}.`,
                      },
                    ]);

                    if (song.thumbnail !== undefined) {
                      embed.setThumbnail(song.thumbnail);
                    }

                    await interaction.editReply({ embeds: [embed] });
                  });
                });

              case 'stop':
                return interaction.deferReply().then(async () => {
                  await queue.stop(voiceChannel).then(async () => {
                    embed.setAuthor({
                      name: '⏹️ Queue Stopped',
                    });
                    embed.setDescription('The queue has been stopped.');

                    await interaction.editReply({ embeds: [embed] });
                  });
                });

              case 'pause':
                if (queue.paused) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: 'The queue has currently being paused.',
                      }),
                  );
                }

                return interaction.deferReply().then(async () => {
                  queue.pause(voiceChannel);

                  embed.setAuthor({
                    name: '⏸️ Queue Paused',
                  });
                  embed.setDescription('The queue has been paused.');

                  await interaction.editReply({ embeds: [embed] });
                });

              case 'resume':
                return interaction.deferReply().then(async () => {
                  queue.resume(voiceChannel);

                  embed.setAuthor({
                    name: '⏯️ Queue Resumed',
                  });
                  embed.setDescription('Resumed back all the queue.');

                  await interaction.editReply({ embeds: [embed] });
                });

              case 'shuffle':
                return interaction.deferReply().then(async () => {
                  await queue.shuffle(voiceChannel).then(async () => {
                    embed.setAuthor({
                      name: '🔀 Queue Shuffled',
                    });
                    embed.setDescription('The queue order has been shuffled.');

                    await interaction.editReply({ embeds: [embed] });
                  });
                });

              case 'autoplay': {
                return interaction.deferReply().then(async () => {
                  queue.toggleAutoplay();

                  embed.setAuthor({
                    name: '▶️ Queue Autoplay Applied',
                  });
                  embed.setDescription(
                    `The Autoplay mode has been set to ${inlineCode(
                      queue.autoplay ? 'On' : 'Off',
                    )}.`,
                  );

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              case 'relatedSong':
                return interaction.deferReply().then(async () => {
                  await queue
                    .addRelatedSong(voiceChannel)
                    .then(async (song) => {
                      embed.setAuthor({
                        name: '🔃 Queue Added',
                      });
                      embed.setDescription(
                        `${inlineCode(
                          song.name,
                        )} has been added to the queue by ${song.user}.`,
                      );

                      if (song.thumbnail !== undefined) {
                        embed.setThumbnail(song.thumbnail);
                      }

                      await interaction.editReply({ embeds: [embed] });
                    });
                });

              case 'repeatMode':
                return interaction.deferReply().then(async () => {
                  queue.setRepeatMode(queue.repeatMode);

                  embed.setAuthor({
                    name: '🔁 Queue Repeat Mode Applied',
                  });
                  embed.setDescription(
                    `Repeat mode has been set to ${inlineCode(
                      applyRepeatMode(queue.repeatMode),
                    )}.`,
                  );

                  await interaction.editReply({ embeds: [embed] });
                });

              case 'queue': {
                const descriptions = queue.songs.map(
                  (song, index) =>
                    `${bold(`${index + 1}`)}. ${inlineCode(
                      song.name,
                    )} - ${inlineCode(song.formattedDuration)}\nRequested by: ${
                      song.user
                    }`,
                );

                if (queue.songs.length > 10) {
                  return interaction
                    .deferReply({ ephemeral: true })
                    .then(async () => {
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
                        name: `🔃 Music Queue (${queue.songs.length})`,
                      });
                      pagination.setDescriptions(descriptions);

                      await pagination.render();
                    });
                }

                return interaction.deferReply().then(async () => {
                  embed.setAuthor({
                    name: `🔃 Music Queue (${queue.songs.length})`,
                  });
                  embed.setDescription(descriptions.join('\n'));

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              case 'previous':
                return interaction.deferReply().then(async () => {
                  await queue.previous(voiceChannel).then(async (song) => {
                    embed.setAuthor({
                      name: '⏮️ Queue Replayed',
                    });
                    embed.setDescription('The queue has been replayed.');
                    embed.setFields([
                      {
                        name: 'Next Up',
                        value: `${inlineCode(song.name)} - ${inlineCode(
                          song.formattedDuration,
                        )}\nRequested by: ${song.user}.`,
                      },
                    ]);

                    if (song.thumbnail !== undefined) {
                      embed.setThumbnail(song.thumbnail);
                    }

                    await interaction.editReply({ embeds: [embed] });
                  });
                });
            }
            break;
        }
        break;
    }
  },
};
