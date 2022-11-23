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

    await interaction.deferReply();

    if (!member) throw "Member doesn't exist.";

    if (!textChannel) throw "Channel doesn't exist.";

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

    if (!musicChannel) throw 'Cannot find a music text channel.';

    if (interaction.channelId !== musicChannel.id) {
      throw `Please use this command in ${musicChannel}.`;
    }

    if (!voiceChannel) {
      throw 'You must be in a voice channel to be able to use this command.';
    }

    if (
      !!guild.members.me?.voice.channel &&
      guild.members.me?.voice.channelId !== voiceChannel.id
    ) {
      throw `Already playing music in ${guild.members.me.voice.channel}.`;
    }

    if (voiceChannel.full) {
      throw `${voiceChannel} user limit is already full.`;
    }

    switch (options.getSubcommand()) {
      case 'play': {
        const query = options.getString('query', true);

        await distube.play(voiceChannel, query, { textChannel, member });

        return interaction.editReply({ content: 'Request received.' });
      }

      case 'playskip': {
        const query = options.getString('query', true);

        await distube.play(voiceChannel, query, {
          textChannel,
          member,
          skip: true,
        });

        return interaction.editReply({ content: 'Request received.' });
      }

      case 'playfirst': {
        const query = options.getString('query', true);

        await distube.play(voiceChannel, query, {
          textChannel,
          member,
          position: 1,
        });

        return interaction.editReply({ content: 'Request received.' });
      }

      case 'search': {
        const query = options.getString('query', true);
        const type = options.getString('type', true);

        const searchResults = await distube.search(query, { limit: 10, type });

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

        embed
          .setAuthor({
            name: `🔍 ${
              type === SearchResultType.VIDEO ? 'Video' : 'Playlist'
            } Search Result`,
          })
          .setDescription(
            `${response}${codeBlock(
              'Type between 1 to 10 to play the music. (15s remaining time)',
            )}`,
          );

        const message = await interaction.editReply({ embeds: [embed] });

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

        return textChannel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then(async (messages) => {
            await distube.play(
              voiceChannel,
              searchResults[+messages.first().content - 1].name,
              { textChannel, member },
            );

            messages.first().delete();
          })
          .catch(() => console.log('No one use the command.'));
      }
    }

    const queue = distube.getQueue(voiceChannel);

    if (!queue) throw 'There is no playing queue now.';

    switch (interaction.options.getSubcommandGroup()) {
      case 'filters':
        switch (options.getSubcommand()) {
          case 'apply': {
            const filter = options.getString('filter', true);

            if (!queue.filters.names.includes(filter)) {
              throw 'Please provide a valid filters.';
            }

            if (!queue.filters.has(filter)) {
              queue.filters.set(filter);

              embed
                .setAuthor({ name: '🎚️ Music Filters Applied' })
                .setDescription('The music filters successfully applied.');

              return interaction.editReply({ embeds: [embed] });
            }

            queue.filters.add(filter, true);

            embed
              .setAuthor({ name: '🎚️ Music Filters Applied' })
              .setDescription('The music filters successfully applied.');

            return interaction.editReply({ embeds: [embed] });
          }

          case 'cease': {
            const filter = options.getString('filter', true);

            if (!queue.filters.names.includes(filter)) {
              throw 'Please provide a valid filters.';
            }

            if (!queue.filters.has(filter)) {
              throw "The queue doesn't have that filters.";
            }

            queue.filters.remove(filter);

            embed
              .setAuthor({ name: '🎚️ Music Filters Ceased' })
              .setDescription('The music filters successfully ceased.');

            return interaction.editReply({ embeds: [embed] });
          }

          case 'clear':
            if (!queue.filters.size) {
              throw "The queue doesn't have any filters.";
            }

            queue.filters.clear();

            embed
              .setAuthor({ name: '🎚️ Music Filters Cleared' })
              .setDescription('The music filters successfully cleared.');

            return interaction.editReply({ embeds: [embed] });
        }
        break;

      case 'playback':
        {
          const time = options.getInteger('time', true);

          switch (options.getSubcommand()) {
            case 'forward':
              if (time > queue.duration || queue.currentTime > queue.duration) {
                queue.seek(queue.beginTime);

                embed
                  .setAuthor({ name: '🕒 Queue Time Adjusted' })
                  .setDescription(
                    `The queue time has been set to ${inlineCode(
                      queue.formattedCurrentTime,
                    )}.`,
                  );

                return interaction.editReply({ embeds: [embed] });
              }

              queue.seek(queue.currentTime + time);

              embed
                .setAuthor({ name: '🕒 Queue Time Adjusted' })
                .setDescription(
                  `The queue time has been set to ${inlineCode(
                    queue.formattedCurrentTime,
                  )}.`,
                );

              return interaction.editReply({ embeds: [embed] });

            case 'seek':
              if (time > queue.duration) {
                queue.seek(queue.beginTime);

                embed
                  .setAuthor({ name: '🕒 Queue Time Adjusted' })
                  .setDescription(
                    `The queue time has been set to ${inlineCode(
                      queue.formattedCurrentTime,
                    )}.`,
                  );

                return interaction.editReply({ embeds: [embed] });
              }

              queue.seek(time);

              embed
                .setAuthor({ name: '🕒 Queue Time Adjusted' })
                .setDescription(
                  `The queue time has been set to ${inlineCode(
                    queue.formattedCurrentTime,
                  )}.`,
                );

              return interaction.editReply({ embeds: [embed] });

            case 'rewind':
              if (
                time > queue.duration ||
                queue.currentTime < queue.beginTime
              ) {
                queue.seek(queue.beginTime);

                embed
                  .setAuthor({ name: '🕒 Queue Time Adjusted' })
                  .setDescription(
                    `The queue time has been set to ${inlineCode(
                      queue.formattedCurrentTime,
                    )}.`,
                  );

                return interaction.editReply({ embeds: [embed] });
              }

              queue.seek(queue.currentTime - time);

              embed
                .setAuthor({
                  name: '🕒 Queue Time Adjusted',
                })
                .setDescription(
                  `The queue time has been set to ${inlineCode(
                    queue.formattedCurrentTime,
                  )}.`,
                );

              return interaction.editReply({ embeds: [embed] });
          }
        }
        break;

      case 'settings':
        switch (options.getSubcommand()) {
          case 'jump': {
            const position = options.getInteger('position', true);

            if (position > queue.songs.length) {
              throw `The queue only have ${pluralize(
                'song',
                queue.songs.length,
                true,
              )}.`;
            }

            const song = await queue.jump(position);

            embed
              .setAuthor({ name: '🔢 Queue Jumped' })
              .setDescription('The queue has been jumped.')
              .setThumbnail(song?.thumbnail ?? null);

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

            return interaction.editReply({ embeds: [embed] });
          }

          case 'volume': {
            const percentage = options.getInteger('percentage', true);

            queue.setVolume(voiceChannel, percentage);

            embed
              .setAuthor({ name: '🔊 Volume Adjusted' })
              .setDescription(
                `The volume has been set to ${inlineCode(`${queue.volume}%`)}.`,
              );

            return interaction.editReply({ embeds: [embed] });
          }

          case 'controls':
            switch (options.getString('options', true)) {
              case 'nowPlaying':
                {
                  embed
                    .setAuthor({ name: '💿 Now Playing' })
                    .setDescription(
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
                    )
                    .setThumbnail(queue.songs[0]?.thumbnail ?? null);

                  const message = await interaction.editReply({
                    embeds: [embed],
                  });

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
                }
                break;

              case 'skip': {
                if (queue.songs.length === 1) {
                  throw 'There is no up next song in the queue.';
                }

                const song = await queue.skip(voiceChannel);

                embed
                  .setAuthor({ name: '⏩ Queue Skipped' })
                  .setDescription('The queue has been skipped.')
                  .setThumbnail(song?.thumbnail ?? null);

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

                return interaction.editReply({ embeds: [embed] });
              }

              case 'stop':
                await queue.stop(voiceChannel);

                return interaction.editReply({ content: 'Request received.' });

              case 'pause':
                if (queue.paused) throw 'The queue has currently being paused.';

                queue.pause(voiceChannel);

                embed
                  .setAuthor({ name: '⏸️ Queue Paused' })
                  .setDescription('The queue has been paused.');

                return interaction.editReply({ embeds: [embed] });

              case 'resume':
                queue.resume(voiceChannel);

                embed
                  .setAuthor({ name: '⏯️ Queue Resumed' })
                  .setDescription('Resumed back all the queue.');

                return interaction.editReply({ embeds: [embed] });

              case 'shuffle':
                await queue.shuffle(voiceChannel);

                embed
                  .setAuthor({ name: '🔀 Queue Shuffled' })
                  .setDescription('The queue order has been shuffled.');

                return interaction.editReply({ embeds: [embed] });

              case 'autoplay':
                queue.toggleAutoplay();

                embed
                  .setAuthor({ name: '▶️ Queue Autoplay Applied' })
                  .setDescription(
                    `The Autoplay mode has been set to ${inlineCode(
                      queue.autoplay ? 'On' : 'Off',
                    )}.`,
                  );

                return interaction.editReply({ embeds: [embed] });

              case 'relatedSong': {
                const song = await queue.addRelatedSong(voiceChannel);

                embed
                  .setAuthor({ name: '🔃 Queue Added' })
                  .setDescription(
                    `${
                      song.name ? inlineCode(song.name) : 'A song'
                    } has been added to the queue${
                      song.user ? ` by ${song.user}` : ''
                    }.`,
                  )
                  .setThumbnail(song?.thumbnail ?? null);

                return interaction.editReply({ embeds: [embed] });
              }

              case 'repeatMode':
                queue.setRepeatMode(queue.repeatMode);

                embed
                  .setAuthor({ name: '🔁 Queue Repeat Mode Applied' })
                  .setDescription(
                    `Repeat mode has been set to ${inlineCode(
                      applyRepeatMode(queue.repeatMode),
                    )}.`,
                  );

                return interaction.editReply({ embeds: [embed] });

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
                  const pagination = new Pagination(interaction, { limit: 10 })
                    .setColor(guild.members.me?.displayHexColor ?? null)
                    .setTimestamp(Date.now())
                    .setFooter({
                      text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setAuthor({
                      name: `🔃 Music Queue (${queue.songs.length.toLocaleString()})`,
                    })
                    .setDescriptions(descriptions);

                  pagination.buttons = {
                    ...pagination.buttons,
                    extra: new ButtonBuilder()
                      .setCustomId('jump')
                      .setEmoji('↕️')
                      .setDisabled(false)
                      .setStyle(ButtonStyle.Secondary),
                  };

                  paginations.set(pagination.interaction.id, pagination);

                  return pagination.render();
                }

                embed
                  .setAuthor({
                    name: `🔃 Music Queue (${queue.songs.length.toLocaleString()})`,
                  })
                  .setDescription(descriptions.join('\n'));

                return interaction.editReply({ embeds: [embed] });
              }

              case 'previous': {
                if (!queue.previousSongs.length) {
                  throw 'There is no previous song in the queue.';
                }

                const song = await queue.previous(voiceChannel);

                embed
                  .setAuthor({ name: '⏮️ Queue Replayed' })
                  .setDescription('The queue has been replayed.')
                  .setThumbnail(song?.thumbnail ?? null);

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

                return interaction.editReply({ embeds: [embed] });
              }
            }
            break;
        }
        break;
    }
  },
};
