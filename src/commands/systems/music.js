const { bold, EmbedBuilder, inlineCode, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { RepeatMode } = require('distube');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Music command.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('Play a song.')
				.addStringOption((option) => option.setName('query').setDescription('The music search query.').setRequired(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('volume')
				.setDescription('Set the music volume.')
				.addNumberOption((option) => option.setName('percentage').setDescription('Set the percentage from 1 to 100.').setRequired(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('settings')
				.setDescription('Select an option.')
				.addStringOption((option) =>
					option.setName('options').setDescription('Set the music option.').setRequired(true).addChoices(
						{
							name: '🔢 View Queue',
							value: 'queue',
						},
						{
							name: '⏭️ Skip Queue',
							value: 'skip',
						},
						{
							name: '⏸️ Pause Song',
							value: 'pause',
						},
						{
							name: '⏯️ Resume Song',
							value: 'resume',
						},
						{
							name: '⏹️ Stop Queue',
							value: 'stop',
						},
						{
							name: '🔀 Shuffle Queue',
							value: 'shuffle',
						},
						{
							name: '🔃 Autoplay',
							value: 'autoplay',
						},
						{
							name: '🔠 Add Related Song',
							value: 'relatedSong',
						},
						{
							name: '🔁 Loop Song',
							value: 'repeatMode',
						},
					),
				),
		),
	type: 'Chat Input',

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, member, guild, channel } = interaction;
		const voiceChannel = member.voice.channel;

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

		if (guild.client.voice.channelId && voiceChannel.id !== guild.client.voice.channelId) return interaction.reply({ content: `Already playing music in ${guild.client.voice.channelId}`, ephemeral: true });

		const queue = interaction.client.distube.getQueue(voiceChannel);
		switch (options.getSubcommand()) {
			case 'play':
				interaction.client.distube.play(voiceChannel, options.getString('query'), {
					textChannel: channel,
					member,
				});

				return interaction.deferReply({ fetchReply: true, ephemeral: true }).then(() => interaction.editReply({ content: 'Request received.' }));

			case 'volume': {
				const percentage = options.getNumber('percentage');
				if (!queue) return interaction.reply({ content: 'There is no playing queue now.', ephemeral: true });

				if (percentage > 100 || percentage < 1) return interaction.reply({ content: 'You have to specify a number between 1 to 100', ephemeral: true });

				interaction.client.distube.setVolume(voiceChannel, percentage);
				embed.setTitle('Volume Adjusted');
				embed.setDescription(`🔊 Volume has been set to ${inlineCode(`${percentage}%`)}`);

				return interaction.reply({ embeds: [embed] });
			}

			case 'settings':
				if (!queue) return interaction.reply({ content: 'There is no playing queue now.', ephemeral: true });

				switch (options.getString('options')) {
					case 'skip':
						await queue.skip(voiceChannel).then(() => {
							embed.setTitle('⏩ Queue Skipped');
							embed.setDescription('The queue has been skipped.');
							interaction.reply({ embeds: [embed] });
						});

						break;

					case 'stop':
						queue.stop(voiceChannel);

						embed.setTitle('⏹️ Queue Stopped');
						embed.setDescription('The queue has been stopped.');
						return interaction.reply({ embeds: [embed] });

					case 'pause':
						queue.pause(voiceChannel);

						embed.setTitle('⏸️ Queue Paused');
						embed.setDescription('The Queue has been paused.');
						return interaction.reply({ embeds: [embed] });

					case 'resume':
						queue.resume(voiceChannel);

						embed.setTitle('⏯️ Queue Resumed');
						embed.setDescription('Resumed back all the queue.');
						return interaction.reply({ embeds: [embed] });

					case 'shuffle':
						await queue.shuffle(voiceChannel).then(() => {
							embed.setTitle('🔀 Queue Shuffled');
							embed.setDescription('The Queue order has been shuffled.');
							interaction.reply({ embeds: [embed] });
						});

						break;

					case 'autoplay': {
						queue.toggleAutoplay(voiceChannel);

						embed.setTitle('🔁 Queue Setting Applied');
						embed.setDescription(`The Autoplay mode has been set to ${inlineCode(queue.autoplay ? 'On' : 'Off')}.`);
						return interaction.reply({ embeds: [embed] });
					}

					case 'relatedSong':
						await queue.addRelatedSong(voiceChannel).then((song) => {
							embed.setTitle('🔃 Queue Added');
							embed.setDescription(`${inlineCode(song.name)} has been added to the queue.`);
							interaction.reply({ embeds: [embed] });
						});
						break;

					case 'repeatMode': {
						let mode;
						switch (interaction.client.distube.setRepeatMode(queue)) {
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
						embed.setTitle('🔃 Music Queue');
						embed.setDescription(`${queue.songs.map((song, id) => `\n${bold(id + 1)}. ${song.name} - ${inlineCode(song.formattedDuration)}`)}`);

						return interaction.reply({ embeds: [embed] });
				}

				break;
		}
	},
};
