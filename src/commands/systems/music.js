const {
  bold,
  ButtonBuilder,
  ButtonStyle,
  codeBlock,
  EmbedBuilder,
  hyperlink,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { SearchResultType } = require('distube');
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');
const progressbar = require('string-progressbar');

const { musicSearchChoices, musicSettingChoices } = require('../../constants');
const { applyRepeatMode } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('🎼 Music command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
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
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('playback')
        .setDescription('⏲️ The music playback controls.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('forward')
            .setDescription('⏩ Fast forward the music playback.')
            .addIntegerOption((option) =>
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
            .addIntegerOption((option) =>
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
            .addIntegerOption((option) =>
              option
                .setName('time')
                .setDescription('🕒 The song time to play.')
                .setRequired(true),
            ),
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
            .addChoices(...musicSearchChoices),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('settings')
        .setDescription('⚙️ The music settings.')
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
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('jump')
            .setDescription('⏭️ Jump to specific song in the queue.')
            .addIntegerOption((option) =>
              option
                .setName('position')
                .setDescription('🔢 The song position.')
                .setMinValue(1)
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('volume')
            .setDescription('🔊 Set the music volume.')
            .addIntegerOption((option) =>
              option
                .setName('percentage')
                .setDescription('🔢 The music volume percentage.')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true),
            ),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, client: import('discord.js').Client<true>, member: ?import('discord.js').GuildMember, guild: ?import('discord.js').Guild, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const {
      channel: textChannel,
      client,
      guild,
      member,
      options,
    } = interaction;

    if (!guild) return;

    if (!member) {
      return interaction.deferReply({ ephemeral: true }).then(async () =>
        interaction.editReply({
          content: "Member doesn't exist.",
        }),
      );
    }

    if (!textChannel) {
      return interaction.deferReply({ ephemeral: true }).then(async () =>
        interaction.editReply({
          content: "Channel doesn't exist.",
        }),
      );
    }

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    /** @type {{ distube: import('distube').DisTube }} */
    const { distube } = client;

    const { voice } = member;
    const { channel: voiceChannel } = voice;

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    const musicChannel = guild.channels.cache.find(
      (channel) => channel.id == process.env.CHANNEL_MUSIC_COMMAND_ID,
    );

    if (!musicChannel) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: 'Cannot find a music text channel.',
          }),
      );
    }

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
      !!guild.members.me?.voice.channel &&
      guild.members.me?.voice.channelId !== voiceChannel.id
    ) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: `Already playing music in ${guild.members.me.voice.channel}.`,
          }),
      );
    }

    if (voiceChannel.full) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: `${voiceChannel} user limit is already full.`,
          }),
      );
    }

    switch (options.getSubcommand()) {
      case 'play': {
        const query = options.getString('query', true);

        return interaction.deferReply({ ephemeral: true }).then(async () => {
          await distube
            .play(voiceChannel, query, {
              textChannel,
              member,
            })
            .then(
              async () =>
                await interaction.editReply({ content: 'Request received.' }),
            );
        });
      }

      case 'playskip': {
        const query = options.getString('query', true);

        return interaction.deferReply({ ephemeral: true }).then(
          async () =>
            await distube
              .play(voiceChannel, query, {
                textChannel,
                member,
                skip: true,
              })
              .then(
                async () =>
                  await interaction.editReply({ content: 'Request received.' }),
              ),
        );
      }

      case 'playfirst': {
        const query = options.getString('query', true);

        return interaction.deferReply({ ephemeral: true }).then(
          async () =>
            await distube
              .play(voiceChannel, query, {
                textChannel,
                member,
                position: 1,
              })
              .then(
                async () =>
                  await interaction.editReply({ content: 'Request received.' }),
              ),
        );
      }

      case 'search': {
        const query = options.getString('query', true);
        const type = options.getString('type', true);

        return interaction.deferReply().then(
          async () =>
            await distube
              .search(query, {
                limit: 10,
                type,
              })
              .then(async (searchResults) => {
                const response = searchResults
                  .map(
                    (searchResult, index) =>
                      `${bold(index + 1)}. ${inlineCode(searchResult.name)}${
                        searchResult.type === SearchResultType.VIDEO
                          ? ` - ${inlineCode(searchResult.formattedDuration)}`
                          : ''
                      }${
                        searchResult.uploader.name
                          ? searchResult.uploader.url
                            ? ` by ${hyperlink(
                                searchResult.uploader.name,
                                searchResult.uploader.url,
                              )}`
                            : ` by ${inlineCode(searchResult.uploader.name)}`
                          : ''
                      }`,
                  )
                  .join('\n');

                embed.setAuthor({
                  name: `🔍 ${
                    type === SearchResultType.VIDEO ? 'Video' : 'Playlist'
                  } Search Result`,
                });
                embed.setDescription(
                  `${response}${codeBlock(
                    'Type between 1 to 10 to play the music. (15s remaining time)',
                  )}`,
                );

                await interaction
                  .editReply({ embeds: [embed] })
                  .then(async (message) => {
                    let time = 15000;
                    const interval = setInterval(async () => {
                      switch (true) {
                        case time <= 0:
                          clearInterval(interval);

                          embed.setDescription(
                            `${response}${codeBlock('Command expired.')}`,
                          );

                          return message.edit({ embeds: [embed] });

                        default:
                          time -= 1000;

                          embed.setDescription(
                            `${response}${codeBlock(
                              `Type between 1 to 10 to play the music. (${
                                time / 1000
                              }s remaining time)`,
                            )}`,
                          );

                          return message.edit({ embeds: [embed] });
                      }
                    }, 1000);

                    /**
                     *
                     * @param {import('discord.js').Message} msg
                     * @returns {Boolean} Boolean value of the filtered interaction.
                     */
                    const filter = (msg) =>
                      Array.from(
                        { length: searchResults.length },
                        (_, i) => `${i + 1}`,
                      ).includes(msg.content);

                    await textChannel
                      .awaitMessages({
                        filter,
                        time,
                        max: 1,
                        errors: ['time'],
                      })
                      .then(
                        async (messages) =>
                          await distube
                            .play(
                              voiceChannel,
                              searchResults[+messages.first().content - 1].name,
                              {
                                textChannel,
                                member,
                              },
                            )
                            .then(() => messages.first().delete()),
                      )
                      .catch(() => console.log('No one use the command.'));
                  });
              }),
        );
      }
    }

    const queue = distube.getQueue(voiceChannel);

    if (!queue) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: 'There is no playing queue now.',
          }),
      );
    }

    switch (interaction.options.getSubcommandGroup()) {
      case 'filters':
        switch (options.getSubcommand()) {
          case 'apply': {
            const filter = options.getString('filter', true);

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
                embed.setDescription('The music filters successfully applied.');

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
          }

          case 'cease': {
            const filter = options.getString('filter', true);

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
          }

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
        break;

      case 'playback':
        {
          const time = options.getInteger('time', true);

          switch (options.getSubcommand()) {
            case 'forward':
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

            case 'seek':
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

            case 'rewind':
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
        break;

      case 'settings':
        switch (options.getSubcommand()) {
          case 'jump': {
            const position = options.getInteger('position', true);

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

            return interaction.deferReply().then(
              async () =>
                await queue.jump(position).then(async (song) => {
                  embed.setAuthor({
                    name: '🔢 Queue Jumped',
                  });
                  embed.setDescription('The queue has been jumped.');

                  if (song.name && song.formattedDuration && song.user) {
                    embed.setFields([
                      {
                        name: 'Next Up',
                        value: `${inlineCode(song.name)} - ${inlineCode(
                          song.formattedDuration,
                        )}\nRequested by: ${song.user}.`,
                      },
                    ]);
                  }

                  embed.setThumbnail(song?.thumbnail ?? null);

                  await interaction.editReply({ embeds: [embed] });
                }),
            );
          }

          case 'volume': {
            const percentage = options.getInteger('percentage', true);

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
            switch (options.getString('options', true)) {
              case 'nowPlaying':
                return interaction.deferReply().then(async () => {
                  embed.setAuthor({
                    name: '💿 Now Playing',
                  });
                  embed.setDescription(
                    `${
                      queue.songs[0].name
                        ? inlineCode(queue.songs[0].name)
                        : 'Queue'
                    }${
                      queue.songs[0].user
                        ? `\nRequested by: ${queue.songs[0].user}`
                        : ''
                    }\n${queue.formattedCurrentTime} - [${progressbar
                      .splitBar(
                        queue.songs[0].duration || 10,
                        queue.currentTime,
                        12,
                      )
                      .slice(0, -1)
                      .toString()}]${
                      queue.songs[0].formattedDuration
                        ? ` - ${queue.songs[0].formattedDuration}`
                        : ''
                    }`,
                  );
                  embed.setThumbnail(queue.songs[0]?.thumbnail ?? null);

                  await interaction
                    .editReply({ embeds: [embed] })
                    .then((message) => {
                      const interval = setInterval(async () => {
                        if (queue.currentTime === queue.songs[0].duration) {
                          clearInterval(interval);
                        }

                        embed.setDescription(
                          `${
                            queue.songs[0].name
                              ? inlineCode(queue.songs[0].name)
                              : 'Queue'
                          }${
                            queue.songs[0].user
                              ? `\nRequested by: ${queue.songs[0].user}`
                              : ''
                          }\n${queue.formattedCurrentTime} - [${progressbar
                            .splitBar(
                              queue.songs[0].duration || 10,
                              queue.currentTime,
                              12,
                            )
                            .slice(0, -1)
                            .toString()}]${
                            queue.songs[0].formattedDuration
                              ? ` - ${queue.songs[0].formattedDuration}`
                              : ''
                          }`,
                        );

                        await message.edit({ embeds: [embed] });
                      }, 1000);
                    });
                });

              case 'skip':
                if (queue.songs.length === 1) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: 'There is no up next song in the queue.',
                      }),
                  );
                }

                return interaction.deferReply().then(async () => {
                  await queue.skip(voiceChannel).then(async (song) => {
                    embed.setAuthor({
                      name: '⏩ Queue Skipped',
                    });
                    embed.setDescription('The queue has been skipped.');

                    if (song.name && song.formattedDuration && song.user) {
                      embed.setFields([
                        {
                          name: 'Next Up',
                          value: `${inlineCode(song.name)} - ${inlineCode(
                            song.formattedDuration,
                          )}\nRequested by: ${song.user}.`,
                        },
                      ]);
                    }

                    embed.setThumbnail(song?.thumbnail ?? null);

                    await interaction.editReply({ embeds: [embed] });
                  });
                });

              case 'stop':
                return interaction
                  .deferReply({ ephemeral: true })
                  .then(async () => {
                    await queue.stop(voiceChannel).then(
                      async () =>
                        await interaction.editReply({
                          content: 'Request received.',
                        }),
                    );
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

              case 'autoplay':
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

              case 'relatedSong':
                return interaction.deferReply().then(
                  async () =>
                    await queue
                      .addRelatedSong(voiceChannel)
                      .then(async (song) => {
                        embed.setAuthor({
                          name: '🔃 Queue Added',
                        });
                        embed.setDescription(
                          `${
                            song.name ? inlineCode(song.name) : 'A song'
                          } has been added to the queue${
                            song.user ? ` by ${song.user}` : ''
                          }.`,
                        );
                        embed.setThumbnail(song?.thumbnail ?? null);

                        await interaction.editReply({ embeds: [embed] });
                      }),
                );

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
                    `${bold(`${index + 1}.`)} ${inlineCode(
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

                      pagination.setColor(
                        guild.members.me?.displayHexColor ?? null,
                      );
                      pagination.setTimestamp(Date.now());
                      pagination.setFooter({
                        text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                        iconURL: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      });
                      pagination.setAuthor({
                        name: `🔃 Music Queue (${queue.songs.length.toLocaleString()})`,
                      });
                      pagination.setDescriptions(descriptions);

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
                }

                return interaction.deferReply().then(async () => {
                  embed.setAuthor({
                    name: `🔃 Music Queue (${queue.songs.length.toLocaleString()})`,
                  });
                  embed.setDescription(descriptions.join('\n'));

                  await interaction.editReply({ embeds: [embed] });
                });
              }

              case 'previous':
                if (!queue.previousSongs.length) {
                  return interaction.deferReply({ ephemeral: true }).then(
                    async () =>
                      await interaction.editReply({
                        content: 'There is no previous song in the queue.',
                      }),
                  );
                }

                return interaction.deferReply().then(
                  async () =>
                    await queue.previous(voiceChannel).then(async (song) => {
                      embed.setAuthor({
                        name: '⏮️ Queue Replayed',
                      });
                      embed.setDescription('The queue has been replayed.');

                      if (song.name && song.formattedDuration && song.user) {
                        embed.setFields([
                          {
                            name: 'Next Up',
                            value: `${inlineCode(song.name)} - ${inlineCode(
                              song.formattedDuration,
                            )}\nRequested by: ${song.user}.`,
                          },
                        ]);
                      }

                      embed.setThumbnail(song?.thumbnail ?? null);

                      await interaction.editReply({ embeds: [embed] });
                    }),
                );
            }
            break;
        }
        break;
    }
  },
};
