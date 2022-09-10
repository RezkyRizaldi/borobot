const {
  bold,
  EmbedBuilder,
  inlineCode,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { SearchResultType } = require('distube');
const { Pagination } = require('pagination.djs');
const pluralize = require('pluralize');
const progressbar = require('string-progressbar');

const { musicSettingChoices } = require('../../constants');
const { applyRepeatMode } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Music command.')
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
    /** @type {{ member: import('discord.js').GuildMember, channel: import('discord.js').TextChannel, client: { distube: import('distube').DisTube }}} */
    const {
      member,
      channel: textChannel,
      client: { distube },
    } = interaction;
    const { voice } = member;
    const { channel: voiceChannel } = voice;

    const musicChannel = await interaction.guild.channels
      .fetch(process.env.CHANNEL_MUSIC_COMMAND_ID)
      .then((ch) => ch);

    const botColor = await interaction.guild.members
      .fetch(interaction.client.user.id)
      .then((res) => res.displayHexColor);

    const embed = new EmbedBuilder()
      .setColor(botColor || 0xfcc9b9)
      .setTimestamp(Date.now())
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });

    if (interaction.channelId !== musicChannel.id) {
      return interaction.reply({
        content: `Please use this command in ${musicChannel}.`,
        ephemeral: true,
      });
    }

    if (!voiceChannel) {
      return interaction.reply({
        content:
          'You must be in a voice channel to be able to use this command.',
        ephemeral: true,
      });
    }

    if (
      !!interaction.guild.members.me.voice.channel &&
      interaction.guild.members.me.voice.channelId !== voiceChannel.id
    ) {
      return interaction.reply({
        content: `Already playing music in ${interaction.guild.members.me.voice.channel}.`,
        ephemeral: true,
      });
    }

    const queue = distube.getQueue(voiceChannel);

    switch (interaction.options.getSubcommand()) {
      case 'play': {
        const query = interaction.options.getString('query');

        distube.play(voiceChannel, query, {
          textChannel,
          member,
        });

        return interaction
          .deferReply({ fetchReply: true, ephemeral: true })
          .then(
            async () =>
              await interaction.editReply({ content: 'Request received.' }),
          );
      }

      case 'playskip': {
        const query = interaction.options.getString('query');

        distube.play(voiceChannel, query, {
          textChannel,
          member,
          skip: true,
        });

        return interaction
          .deferReply({ fetchReply: true, ephemeral: true })
          .then(
            async () =>
              await interaction.editReply({ content: 'Request received.' }),
          );
      }

      case 'playfirst': {
        const query = interaction.options.getString('query');

        distube.play(voiceChannel, query, {
          textChannel,
          member,
          position: 1,
        });

        return interaction
          .deferReply({ fetchReply: true, ephemeral: true })
          .then(
            async () =>
              await interaction.editReply({ content: 'Request received.' }),
          );
      }

      case 'search': {
        const query = interaction.options.getString('query');
        const type = interaction.options.getString('type');

        return distube
          .search(query, {
            limit: 10,
            type,
          })
          .then(async (searchResults) => {
            if (type === SearchResultType.VIDEO) {
              embed.setAuthor({
                name: '🔍 Video Search Result',
              });
              embed.setDescription(
                `${searchResults
                  .map(
                    (searchResult, index) =>
                      `\n${bold(index + 1)}. ${inlineCode(
                        searchResult.name,
                      )} - ${inlineCode(searchResult.formattedDuration)}`,
                  )
                  .join('\n')}`,
              );

              return interaction
                .reply({ embeds: [embed], fetchReply: true })
                .then((message) => {
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
                  const collector = textChannel.createMessageCollector({
                    filter,
                    time: 15000,
                  });

                  collector.once('collect', (msg) => {
                    distube.play(
                      voiceChannel,
                      searchResults[+msg.content - 1].name,
                      {
                        textChannel,
                        member,
                      },
                    );
                  });

                  collector.once('end', async () => await message.delete());
                });
            }

            embed.setAuthor({
              name: '🔍 Playlist Search Result',
            });
            embed.setDescription(
              `${searchResults
                .map(
                  (searchResult, index) =>
                    `\n${bold(index + 1)}. ${inlineCode(
                      searchResult.name,
                    )} by ${inlineCode(searchResult.uploader.name)}`,
                )
                .join('\n')}`,
            );

            return interaction
              .reply({ embeds: [embed], fetchReply: true })
              .then((message) => {
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
                const collector = textChannel.createMessageCollector({
                  filter,
                  time: 15000,
                });

                collector.once('collect', (msg) => {
                  distube.play(
                    voiceChannel,
                    searchResults[+msg.content - 1].name,
                    {
                      textChannel,
                      member,
                    },
                  );
                });

                collector.once('end', async () => await message.delete());
              });
          })
          .catch(
            async (err) =>
              await interaction.reply({
                content: err.message,
                ephemeral: true,
              }),
          );
      }
    }

    switch (interaction.options.getSubcommandGroup()) {
      case 'filters':
        if (!queue) {
          return interaction.reply({
            content: 'There is no playing queue now.',
            ephemeral: true,
          });
        }

        switch (interaction.options.getSubcommand()) {
          case 'apply': {
            const filter = interaction.options.getString('filter');

            if (!queue.filters.names.includes(filter)) {
              return interaction.reply({
                content: 'Please provide a valid filters.',
                ephemeral: true,
              });
            }

            if (!queue.filters.has(filter)) {
              queue.filters.set(filter);

              embed.setAuthor({
                name: '🎚️ Music Filters Applied',
              });
              embed.setDescription('The music filters successfully applied.');

              return interaction.reply({ embeds: [embed] });
            }

            queue.filters.add(filter, true);

            embed.setAuthor({
              name: '🎚️ Music Filters Applied',
            });
            embed.setDescription('The music filters successfully applied.');

            return interaction.reply({ embeds: [embed] });
          }

          case 'cease': {
            const filter = interaction.options.getString('filter');

            if (!queue.filters.names.includes(filter)) {
              return interaction.reply({
                content: 'Please provide a valid filters.',
                ephemeral: true,
              });
            }

            if (!queue.filters.has(filter)) {
              return interaction.reply({
                content: "The queue doesn't have that filters.",
                ephemeral: true,
              });
            }

            queue.filters.remove(filter);

            embed.setAuthor({
              name: '🎚️ Music Filters Ceased',
            });
            embed.setDescription('The music filters successfully ceased.');

            return interaction.reply({ embeds: [embed] });
          }

          case 'clear':
            if (!queue.filters.size) {
              return interaction.reply({
                content: "The queue doesn't have any filters.",
                ephemeral: true,
              });
            }

            queue.filters.clear();

            embed.setAuthor({
              name: '🎚️ Music Filters Cleared',
            });
            embed.setDescription('The music filters successfully cleared.');

            return interaction.reply({ embeds: [embed] });
        }
        break;

      case 'playback':
        if (!queue) {
          return interaction.reply({
            content: 'There is no playing queue now.',
            ephemeral: true,
          });
        }

        switch (interaction.options.getSubcommand()) {
          case 'forward': {
            const time = interaction.options.getNumber('time');

            if (time > queue.duration || queue.currentTime > queue.duration) {
              queue.seek(queue.beginTime);

              embed.setAuthor({
                name: '🕒 Queue Time Adjusted',
              });
              embed.setDescription(
                `The queue time has been set to ${inlineCode(
                  queue.formattedCurrentTime,
                )}.`,
              );

              return interaction.reply({ embeds: [embed] });
            }

            queue.seek(queue.currentTime + time);

            embed.setAuthor({
              name: '🕒 Queue Time Adjusted',
            });
            embed.setDescription(
              `The queue time has been set to ${inlineCode(
                queue.formattedCurrentTime,
              )}.`,
            );

            return interaction.reply({ embeds: [embed] });
          }

          case 'seek': {
            const time = interaction.options.getNumber('time');

            if (time > queue.duration) {
              queue.seek(queue.beginTime);

              embed.setAuthor({
                name: '🕒 Queue Time Adjusted',
              });
              embed.setDescription(
                `The queue time has been set to ${inlineCode(
                  queue.formattedCurrentTime,
                )}.`,
              );

              return interaction.reply({ embeds: [embed] });
            }

            queue.seek(time);

            embed.setAuthor({
              name: '🕒 Queue Time Adjusted',
            });
            embed.setDescription(
              `The queue time has been set to ${inlineCode(
                queue.formattedCurrentTime,
              )}.`,
            );

            return interaction.reply({ embeds: [embed] });
          }

          case 'rewind': {
            const time = interaction.options.getNumber('time');

            if (time > queue.duration || queue.currentTime < queue.beginTime) {
              queue.seek(queue.beginTime);

              embed.setAuthor({
                name: '🕒 Queue Time Adjusted',
              });
              embed.setDescription(
                `The queue time has been set to ${inlineCode(
                  queue.formattedCurrentTime,
                )}.`,
              );

              return interaction.reply({ embeds: [embed] });
            }

            queue.seek(queue.currentTime - time);

            embed.setAuthor({
              name: '🕒 Queue Time Adjusted',
            });
            embed.setDescription(
              `The queue time has been set to ${inlineCode(
                queue.formattedCurrentTime,
              )}.`,
            );

            return interaction.reply({ embeds: [embed] });
          }
        }
        break;

      case 'settings':
        if (!queue) {
          return interaction.reply({
            content: 'There is no playing queue now.',
            ephemeral: true,
          });
        }

        switch (interaction.options.getSubcommand()) {
          case 'jump': {
            const position = interaction.options.getNumber('position');

            if (position > queue.songs.length) {
              return interaction.reply({
                content: `The queue only have ${pluralize(
                  'song',
                  queue.songs.length,
                  true,
                )}.`,
                ephemeral: true,
              });
            }

            return queue
              .jump(position)
              .then(async (song) => {
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

                await interaction.reply({ embeds: [embed] });
              })
              .catch(
                async (err) =>
                  await interaction.reply({
                    content: err.message,
                    ephemeral: true,
                  }),
              );
          }

          case 'volume': {
            const percentage = interaction.options.getNumber('percentage');

            if (percentage > 100 || percentage < 1) {
              return interaction.reply({
                content: 'You have to specify a number between 1 to 100.',
                ephemeral: true,
              });
            }

            queue.setVolume(voiceChannel, percentage);
            embed.setAuthor({
              name: '🔊 Volume Adjusted',
            });
            embed.setDescription(
              `The volume has been set to ${inlineCode(`${queue.volume}%`)}.`,
            );

            return interaction.reply({ embeds: [embed] });
          }

          case 'controls':
            switch (interaction.options.getString('options')) {
              case 'nowPlaying':
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

                return interaction
                  .reply({ embeds: [embed], fetchReply: true })
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
                            queue.songs.length ? queue.songs[0]?.duration : 10,
                            queue.currentTime,
                            12,
                          )
                          .slice(0, -1)
                          .toString()}] - ${queue.songs[0]?.formattedDuration}`,
                      );

                      await message.edit({ embeds: [embed] });
                    }, 1000);
                  })
                  .catch((err) => console.error(err));

              case 'skip':
                return queue
                  .skip(voiceChannel)
                  .then(async (song) => {
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

                    await interaction.reply({ embeds: [embed] });
                  })
                  .catch(
                    async (err) =>
                      await interaction.reply({
                        content: err.message,
                        ephemeral: true,
                      }),
                  );

              case 'stop':
                return queue
                  .stop(voiceChannel)
                  .then(async () => {
                    embed.setAuthor({
                      name: '⏹️ Queue Stopped',
                    });
                    embed.setDescription('The queue has been stopped.');

                    await interaction.reply({ embeds: [embed] });
                  })
                  .catch(
                    async (err) =>
                      await interaction.reply({
                        content: err.message,
                        ephemeral: true,
                      }),
                  );

              case 'pause':
                if (queue.paused) {
                  return interaction.reply({
                    content: 'The queue has currently being paused.',
                    ephemeral: true,
                  });
                }

                queue.pause(voiceChannel);

                embed.setAuthor({
                  name: '⏸️ Queue Paused',
                });
                embed.setDescription('The queue has been paused.');

                return interaction.reply({ embeds: [embed] });

              case 'resume':
                queue.resume(voiceChannel);

                embed.setAuthor({
                  name: '⏯️ Queue Resumed',
                });
                embed.setDescription('Resumed back all the queue.');

                return interaction.reply({ embeds: [embed] });

              case 'shuffle':
                return queue
                  .shuffle(voiceChannel)
                  .then(async () => {
                    embed.setAuthor({
                      name: '🔀 Queue Shuffled',
                    });
                    embed.setDescription('The queue order has been shuffled.');

                    await interaction.reply({ embeds: [embed] });
                  })
                  .catch(
                    async (err) =>
                      await interaction.reply({
                        content: err.message,
                        ephemeral: true,
                      }),
                  );

              case 'autoplay': {
                queue.toggleAutoplay();

                embed.setAuthor({
                  name: '▶️ Queue Autoplay Applied',
                });
                embed.setDescription(
                  `The Autoplay mode has been set to ${inlineCode(
                    queue.autoplay ? 'On' : 'Off',
                  )}.`,
                );

                return interaction.reply({ embeds: [embed] });
              }

              case 'relatedSong':
                return queue
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

                    await interaction.reply({ embeds: [embed] });
                  })
                  .catch(async (err) =>
                    interaction.reply({
                      content: err.message,
                      ephemeral: true,
                    }),
                  );

              case 'repeatMode':
                queue.setRepeatMode(queue.repeatMode);

                embed.setAuthor({
                  name: '🔁 Queue Repeat Mode Applied',
                });
                embed.setDescription(
                  `Repeat mode has been set to ${inlineCode(
                    applyRepeatMode(queue.repeatMode),
                  )}.`,
                );

                return interaction.reply({ embeds: [embed] });

              case 'queue':
                {
                  const descriptions = queue.songs.map(
                    (song, index) =>
                      `${index + 1}. ${inlineCode(song.name)} - ${inlineCode(
                        song.formattedDuration,
                      )}\nRequested by: ${song.user}`,
                  );

                  const pagination = new Pagination(interaction, {
                    ephemeral: true,
                  });

                  pagination.setTitle(`🔃 Music Queue (${queue.songs.length})`);
                  pagination.setColor(botColor || 0xfcc9b9);
                  pagination.setTimestamp(Date.now());
                  pagination.setFooter({
                    text: `${interaction.client.user.username} | Page {pageNumber} of {totalPages}`,
                    iconURL: interaction.client.user.displayAvatarURL({
                      dynamic: true,
                    }),
                  });
                  pagination.setDescriptions(descriptions);
                  pagination.render();
                }

                break;

              case 'previous':
                return queue
                  .previous(voiceChannel)
                  .then(async (song) => {
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

                    await interaction.reply({ embeds: [embed] });
                  })
                  .catch(
                    async (err) =>
                      await interaction.reply({
                        content: err.message,
                        ephemeral: true,
                      }),
                  );
            }
            break;
        }
        break;
    }
  },
};
