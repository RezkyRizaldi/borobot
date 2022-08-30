const { AuditLogEvent, EmbedBuilder, Events, time, TimestampStyles, WebhookClient } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,

	/**
	 *
	 * @param {import('discord.js').VoiceState} oldState
	 * @param {import('discord.js').VoiceState} newState
	 */
	async execute(oldState, newState) {
		if (oldState.member.user.bot) return;

		const embed = new EmbedBuilder()
			.setFooter({
				text: newState.client.user.username,
				iconURL: newState.client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setColor(oldState.member.displayHexColor || 0xfcc9b9);

		// If the member join to a voice channel
		if (!oldState.channel) {
			const VoiceJoinLogger = new WebhookClient({
				id: process.env.MEMBER_VOICE_JOIN_WEBHOOK_ID,
				token: process.env.MEMBER_VOICE_JOIN_WEBHOOK_TOKEN,
			});

			embed.setAuthor({
				name: 'Member Joined Voice Channel',
				iconURL: oldState.member.displayAvatarURL({ dynamic: true }),
			});
			embed.setDescription(`${oldState.member} has join to ${newState.channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);

			return VoiceJoinLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}

		// If the member leave from a voice channel or disconnected by a moderator
		if (!newState.channel) {
			const VoiceLeaveLogger = new WebhookClient({
				id: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_ID,
				token: process.env.MEMBER_VOICE_LEAVE_WEBHOOK_TOKEN,
			});

			embed.setAuthor({
				name: 'Member Left Voice Channel',
				iconURL: newState.member.displayAvatarURL({ dynamic: true }),
			});
			embed.setDescription(`${newState.member} has left from ${oldState.channel} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);

			return VoiceLeaveLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}

		// If the member being moved by a moderator
		const moveLog = await newState.guild
			.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberMove,
			})
			.then((audit) => audit.entries.first());

		const VoiceMoveLogger = new WebhookClient({
			id: process.env.MEMBER_VOICE_MOVE_WEBHOOK_ID,
			token: process.env.MEMBER_VOICE_MOVE_WEBHOOK_TOKEN,
		});

		embed.setAuthor({
			name: 'Member Moved',
			iconURL: newState.member.displayAvatarURL({ dynamic: true }),
		});
		embed.setDescription(`${newState.member} has been moved from ${oldState.channel} to ${newState.channel} by ${moveLog.executor} at ${time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime)}`);
		embed.setFields([
			{
				name: '📄 Reason',
				value: moveLog.reason || 'No reason',
			},
		]);

		return VoiceMoveLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
	},
};
