const { ChannelType, CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const pluralize = require('pluralize');
const { applyAFKTimeout, applyNSFWLevel, applyTier, applyTimestamp, applyVerificationLevel } = require('../../utils');

module.exports = {
	data: new SlashCommandBuilder().setName('serverinfo').setDescription('Get info about the server.'),
	type: 'Chat Input',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, client } = interaction;
		const botColor = (await guild.members.fetch(client.user.id)).displayHexColor;
		const textChannel = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size;
		const voiceChannel = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size;
		const channelCount = textChannel + voiceChannel;
		const onlineMemberCount = guild.members.cache.filter((member) => member.presence !== null).size;
		const emojiCount = guild.emojis.cache.size;
		const roleCount = guild.roles.cache.size;
		const inviteURLs = await guild.invites
			.fetch()
			.then((invites) => invites.map((invite) => `[Click Here](${invite.url}) (Used ${invite.uses}, ${invite.expiresTimestamp ? `expired ${applyTimestamp(invite.expiresTimestamp)}` : 'Permanent'})`).join('\n'));

		const embed = new EmbedBuilder()
			.setTitle(`ℹ️ ${guild.name} Server Info`)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.setDescription(guild.description || '_No description_')
			.setColor(botColor || 0xfcc9b9)
			.setFooter({
				text: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setFields([
				{
					name: '🆔 ID',
					value: guild.id,
					inline: true,
				},
				{
					name: '👑 Owner',
					value: `<@${guild.ownerId}>`,
					inline: true,
				},
				{
					name: '🚀 Boost Level',
					value: applyTier(guild.premiumTier),
					inline: true,
				},
				{
					name: '📆 Created',
					value: applyTimestamp(guild.createdTimestamp),
					inline: true,
				},
				{
					name: `👥 Members (${guild.memberCount})`,
					value: `${pluralize('Online', onlineMemberCount, true)} | ${pluralize('Booster', guild.premiumSubscriptionCount, true)}`,
					inline: true,
				},
				{
					name: '😀 Emoji & Sticker',
					value: `${pluralize('Emoji', emojiCount, true)} | ${pluralize('Sticker', guild.stickers.cache.size, true)}`,
					inline: true,
				},
				{
					name: '🔐 Roles',
					value: pluralize('Role', roleCount, true),
				},
				{
					name: `💬 Channels (${channelCount})`,
					value: `${textChannel} Text | ${voiceChannel} Voice\nRules Channel: ${guild.rulesChannel || '_None_'}\nSystem Channel: ${guild.systemChannel || '_None_'}\nPublic Updates Channel: ${
						guild.publicUpdatesChannel || '_None_'
					}\nAFK Channel: ${`${guild.afkChannel} (${applyAFKTimeout(guild.afkTimeout)})` || '_None_'}\nWidget Channel: ${guild.widgetChannel || '_None_'}`,
				},
				{
					name: '🔮 Features',
					value: guild.features.length ? guild.features.join(', ') : '_None_',
					inline: true,
				},
				{
					name: '⚠️ Verification Level',
					value: applyVerificationLevel(guild.verificationLevel),
					inline: true,
				},
				{
					name: '🔒 NSFW Level',
					value: applyNSFWLevel(guild.nsfwLevel),
					inline: true,
				},
				{
					name: '🖼️ Assets',
					value: `Icon: ${guild.icon ? `[Icon URL](${guild.iconURL({ dynamic: true })})` : '_None_'}\nBanner: ${guild.banner ? `[Banner URL](${guild.bannerURL({ dynamic: true })})` : '_None_'}\nSplash: ${
						guild.splash ? `[Splash URL](${guild.splashURL({ dynamic: true })})` : '_None_'
					}\nDiscovery Splash: ${guild.discoverySplash ? `[Discovery Splash URL](${guild.discoverySplashURL({ dynamic: true })})` : '_None_'}`,
					inline: true,
				},
				{
					name: '🔗 Invite URL',
					value: `Vanity URL: ${guild.vanityURLCode ? `[Click Here](${guild.vanityURLCode}) (Used ${pluralize('time', guild.vanityURLUses, true)})` : '_None_'}\nDefault URL:${`\n${inviteURLs}` || '_None_'}`,
					inline: true,
				},
				{
					name: '🔠 Misc',
					value: `Partnered: ${guild.partnered ? 'Yes' : 'No'}\nVerified: ${guild.verified ? 'Yes' : 'No'}`,
				},
			]);

		await interaction.reply({ embeds: [embed] });
	},
};
