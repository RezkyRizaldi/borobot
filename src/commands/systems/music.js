const { bold, EmbedBuilder, inlineCode, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { RepeatMode } = require('distube');

const { musicSettingChoices } = require('../../constants');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Music command.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('🎶 Play a song.')
				.addStringOption((option) => option.setName('query').setDescription('🔠 The music search query.').setRequired(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('volume')
				.setDescription('🔊 Set the music volume.')
				.addNumberOption((option) => option.setName('percentage').setDescription('🔢 The music volume percentage.').setRequired(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('settings')
				.setDescription('⚙️ The music settings.')
				.addStringOption((option) =>
					option
						.setName('options')
						.setDescription('⚙️ Set the music setting options.')
						.setRequired(true)
						.addChoices(...musicSettingChoices),
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

		const musicChannel = await interaction.guild.channels.fetch(process.env.CHANNEL_MUSIC_COMMAND_ID).then((ch) => ch);

		const botColor = await interaction.guild.members.fetch(interaction.client.user.id).then((res) => res.displayHexColor);

		const embed = new EmbedBuilder()
			.setColor(botColor || 0xfcc9b9)
			.setTimestamp(Date.now())
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			});

		if (interaction.channelId !== musicChannel.id) return interaction.reply({ content: `Please use this command in ${musicChannel}`, ephemeral: true });

		if (!voiceChannel) return interaction.reply({ content: 'You must be in a voice channel to be able to use this command.', ephemeral: true });

		const queue = distube.getQueue(voiceChannel);
		switch (interaction.options.getSubcommand()) {
			case 'play':
				distube.play(voiceChannel, interaction.options.getString('query'), { textChannel, member });

				return interaction.deferReply({ fetchReply: true, ephemeral: true }).then(() => interaction.editReply({ content: 'Request received.' }));

			case 'volume': {
				const percentage = interaction.options.getNumber('percentage');
				if (!queue) return interaction.reply({ content: 'There is no playing queue now.', ephemeral: true });

				if (percentage > 100 || percentage < 1) return interaction.reply({ content: 'You have to specify a number between 1 to 100', ephemeral: true });

				distube.setVolume(voiceChannel, percentage);
				embed.setAuthor({
					name: '🔊 Volume Adjusted',
				});
				embed.setDescription(`The volume has been set to ${inlineCode(`${percentage}%`)}`);

				return interaction.reply({ embeds: [embed] });
			}

			case 'settings':
				if (!queue) return interaction.reply({ content: 'There is no playing queue now.', ephemeral: true });

				switch (interaction.options.getString('options')) {
					case 'skip':
						return queue
							.skip(voiceChannel)
							.then(async (song) => {
								embed.setAuthor({
									name: '⏩ Queue Skipped',
								});
								embed.setDescription(`The queue ${song.name} has been skipped by ${song.user}.`);
								await interaction.reply({ embeds: [embed] });
							})
							.catch(async (err) => await interaction.reply({ content: err.message, ephemeral: true }));

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
							.catch(async (err) => await interaction.reply({ content: err.message, ephemeral: true }));

					case 'pause':
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
						return queue.shuffle(voiceChannel).then(async (q) => {
							embed.setAuthor({
								name: '🔀 Queue Shuffled',
							});
							embed.setDescription(`The queue order has been shuffled.\n${q.songs.map((song, id) => `\n${bold(id + 1)}. ${song.name} - ${inlineCode(song.formattedDuration)}`)}`);
							await interaction.reply({ embeds: [embed] });
						});

					case 'autoplay': {
						queue.toggleAutoplay(voiceChannel);

						embed.setAuthor({
							name: '🔁 Queue Setting Applied',
						});
						embed.setDescription(`The Autoplay mode has been set to ${inlineCode(queue.autoplay ? 'On' : 'Off')}.`);
						return interaction.reply({ embeds: [embed] });
					}

					case 'relatedSong':
						return queue.addRelatedSong(voiceChannel).then(async (song) => {
							embed.setAuthor({
								name: '🔃 Queue Added',
							});
							embed.setDescription(`${inlineCode(song.name)} has been added to the queue by ${song.user}.`);
							await interaction.reply({ embeds: [embed] });
						});

					case 'repeatMode': {
						/** @type {String} */
						let mode;
						switch (distube.setRepeatMode(queue)) {
							case RepeatMode.DISABLED:
								mode = 'Off';
								break;

							case RepeatMode.SONG:
								mode = 'Song';
								break;

							case RepeatMode.QUEUE:
								mode = 'Queue';
								break;
						}

						return interaction.reply({ content: `🔁 Repeat mode has been set to ${inlineCode(mode)}` });
					}

					case 'queue':
						embed.setAuthor({
							name: '🔃 Music Queue',
						});
						embed.setDescription(`${queue.songs.map((song, id) => `\n${bold(id + 1)}. ${song.name} - ${inlineCode(song.formattedDuration)}`)}`);

						return interaction.reply({ embeds: [embed] });
				}
				break;
		}
	},
};
