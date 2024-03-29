const {
  ChannelType,
  Events,
  PermissionFlagsBits,
  PermissionsBitField,
} = require('discord.js');
const { SearchResultType } = require('distube');

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const banChoices = [
  {
    name: "📆 Don't Delete Any",
    value: 0,
  },
  {
    name: '📆 Previous 1 Day',
    value: 1000 * 60 * 60 * 24,
  },
  {
    name: '📆 Previous 2 Days',
    value: 1000 * 60 * 60 * 24 * 2,
  },
  {
    name: '📆 Previous 3 Days',
    value: 1000 * 60 * 60 * 24 * 3,
  },
  {
    name: '📆 Previous 4 Days',
    value: 1000 * 60 * 60 * 24 * 4,
  },
  {
    name: '📆 Previous 5 Days',
    value: 1000 * 60 * 60 * 24 * 5,
  },
  {
    name: '📆 Previous 6 Days',
    value: 1000 * 60 * 60 * 24 * 6,
  },
  {
    name: '📆 Previous 7 Days',
    value: 1000 * 60 * 60 * 24 * 7,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const banTempChoices = [
  {
    name: '🕒 5 secs',
    value: 5 * 1000,
  },
  {
    name: '🕒 15 secs',
    value: 15 * 1000,
  },
  {
    name: '🕒 30 secs',
    value: 30 * 1000,
  },
  {
    name: '🕒 45 secs',
    value: 45 * 1000,
  },
  {
    name: '🕒 60 secs',
    value: 60 * 1000,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const timeoutChoices = [
  {
    name: '🕒 60 secs',
    value: 1000 * 60,
  },
  {
    name: '🕒 5 mins',
    value: 1000 * 60 * 5,
  },
  {
    name: '🕒 10 mins',
    value: 1000 * 60 * 10,
  },
  {
    name: '🕒 1 hour',
    value: 1000 * 60 * 60,
  },
  {
    name: '🕒 1 day',
    value: 1000 * 60 * 60 * 24,
  },
  {
    name: '🕒 1 week',
    value: 1000 * 60 * 60 * 24 * 7,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const emitChoices = [
  {
    name: Events.GuildMemberAdd,
    value: Events.GuildMemberAdd,
  },
  {
    name: Events.GuildMemberRemove,
    value: Events.GuildMemberRemove,
  },
  {
    name: Events.GuildMemberUpdate,
    value: Events.GuildMemberUpdate,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const musicSearchChoices = [
  {
    name: '🎥 Video',
    value: SearchResultType.VIDEO,
  },
  {
    name: '💽 Playlist',
    value: SearchResultType.PLAYLIST,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const musicSettingChoices = [
  {
    name: '💿 Now Playing',
    value: 'nowPlaying',
  },
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
  {
    name: '⏮️ Previous Queue',
    value: 'previous',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const slowmodeChoices = [
  {
    name: '🕒 5 secs',
    value: 5,
  },
  {
    name: '🕒 15 secs',
    value: 15,
  },
  {
    name: '🕒 30 secs',
    value: 30,
  },
  {
    name: '🕒 45 secs',
    value: 45,
  },
  {
    name: '🕒 60 secs',
    value: 60,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const serverMuteChoices = [
  {
    name: '#️⃣ Text',
    value: ChannelType.GuildText,
  },
  {
    name: '🔊 Voice',
    value: ChannelType.GuildVoice,
  },
  {
    name: 'All',
    value: 6,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const serverMuteTempChoices = [
  {
    name: '🕒 5 secs',
    value: 5 * 1000,
  },
  {
    name: '🕒 15 secs',
    value: 15 * 1000,
  },
  {
    name: '🕒 30 secs',
    value: 30 * 1000,
  },
  {
    name: '🕒 45 secs',
    value: 45 * 1000,
  },
  {
    name: '🕒 60 secs',
    value: 60 * 1000,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const githubRepoSortingTypeChoices = [
  {
    name: '⭐ Stars',
    value: 'stars',
  },
  {
    name: '🕎 Fork',
    value: 'forks',
  },
  {
    name: '❓ Help Wanted Issues',
    value: 'help-wanted-issues',
  },
  {
    name: '🆕 Updated',
    value: 'updated',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const waifuChoices = [
  {
    name: '🖼️ Image',
    value: 'image',
  },
  {
    name: '🖼️ Profile Picture',
    value: 'pfp',
  },
  {
    name: '🖼️ Wallpaper',
    value: 'wallpaper',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const animeSearchTypeChoices = [
  {
    name: '📺 TV',
    value: 'tv',
  },
  {
    name: '🎞️ Movie',
    value: 'movie',
  },
  {
    name: '🎥 OVA',
    value: 'ova',
  },
  {
    name: '✨ Special',
    value: 'special',
  },
  {
    name: '📡 ONA',
    value: 'ona',
  },
  {
    name: '🎶 Music',
    value: 'ona',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const animeSearchStatusChoices = [
  {
    name: '⏳ Airing',
    value: 'airing',
  },
  {
    name: '⌛ Finished Airing',
    value: 'complete',
  },
  {
    name: '🔜 Not Aired Yet',
    value: 'upcoming',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const animeSearchOrderChoices = [
  {
    name: '🆔 ID',
    value: 'mal_id',
  },
  {
    name: '🔤 Title',
    value: 'title',
  },
  {
    name: '🔠 type',
    value: 'type',
  },
  {
    name: '🔞 Rating',
    value: 'rating',
  },
  {
    name: '📆 Start Date',
    value: 'start_date',
  },
  {
    name: '📆 End Date',
    value: 'end_date',
  },
  {
    name: '🎬 Episodes',
    value: 'episodes',
  },
  {
    name: '⭐ Score',
    value: 'score',
  },
  {
    name: '👥 Scored By',
    value: 'scored_by',
  },
  {
    name: '#️⃣ Rank',
    value: 'rank',
  },
  {
    name: '📈 Popularity',
    value: 'popularity',
  },
  {
    name: '👥 Members',
    value: 'members',
  },
  {
    name: '❤️ Favorites',
    value: 'favorites',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const animeCharacterSearchOrderChoices = [
  {
    name: '🆔 ID',
    value: 'mal_id',
  },
  {
    name: '🔤 Name',
    value: 'name',
  },
  {
    name: '❤️ Favorites',
    value: 'favorites',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const mangaSearchTypeChoices = [
  {
    name: '📔 Manga',
    value: 'manga',
  },
  {
    name: '📕 Novel',
    value: 'novel',
  },
  {
    name: '📗 Light Novel',
    value: 'lightnovel',
  },
  {
    name: '📑 One-shot',
    value: 'oneshot',
  },
  {
    name: '📘 Doujinshi',
    value: 'doujin',
  },
  {
    name: '📙 Manhwa',
    value: 'manhwa',
  },
  {
    name: '📙 Manhua',
    value: 'manhua',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const mangaSearchStatusChoices = [
  {
    name: '⏳ Publishing',
    value: 'publishing',
  },
  {
    name: '⌛ Finished',
    value: 'complete',
  },
  {
    name: '⏱️ On Hiatus',
    value: 'hiatus',
  },
  {
    name: '🪝 Discontinued',
    value: 'discontinued',
  },
  {
    name: '🔜 Not Yet Published',
    value: 'upcoming',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const mangaSearchOrderChoices = [
  {
    name: '🆔 ID',
    value: 'mal_id',
  },
  {
    name: '🔤 Title',
    value: 'title',
  },
  {
    name: '📆 Start Date',
    value: 'start_date',
  },
  {
    name: '📆 End Date',
    value: 'end_date',
  },
  {
    name: '📄 Chapters',
    value: 'chapters',
  },
  {
    name: '📚 Volumes',
    value: 'volumes',
  },
  {
    name: '⭐ Score',
    value: 'score',
  },
  {
    name: '👥 Scored By',
    value: 'scored_by',
  },
  {
    name: '#️⃣ Rank',
    value: 'rank',
  },
  {
    name: '📈 Popularity',
    value: 'popularity',
  },
  {
    name: '👥 Members',
    value: 'members',
  },
  {
    name: '❤️ Favorites',
    value: 'favorites',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const searchSortingChoices = [
  {
    name: '⬆️ Descending',
    value: 'desc',
  },
  {
    name: '⬇️ Ascending',
    value: 'asc',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const rolePermissionChoices = [
  {
    name: '⛔ None',
    value: 0,
  },
  {
    name: '⚫ Default',
    value: Number(PermissionsBitField.Default),
  },
  {
    name: '🔊 Manage Channels',
    value: Number(PermissionFlagsBits.ManageChannels),
  },
  {
    name: '🛠️ Manage Roles',
    value: Number(PermissionFlagsBits.ManageRoles),
  },
  {
    name: '😀 Manage Emoji and Stickers',
    value: Number(PermissionFlagsBits.ManageEmojisAndStickers),
  },
  {
    name: '👁️ View Audit Log',
    value: Number(PermissionFlagsBits.ViewAuditLog),
  },
  {
    name: '🪝 Manage Webhooks',
    value: Number(PermissionFlagsBits.ManageWebhooks),
  },
  {
    name: '🏰 Manage Server',
    value: Number(PermissionFlagsBits.ManageGuild),
  },
  {
    name: '🔤 Change Nickname',
    value: Number(PermissionFlagsBits.ChangeNickname),
  },
  {
    name: '🔤 Manage Nicknames',
    value: Number(PermissionFlagsBits.ManageNicknames),
  },
  {
    name: '🔨 Kick Members',
    value: Number(PermissionFlagsBits.KickMembers),
  },
  {
    name: '🚫 Ban Members',
    value: Number(PermissionFlagsBits.BanMembers),
  },
  {
    name: '🕒 Timeout Members',
    value: Number(PermissionFlagsBits.ModerateMembers),
  },
  {
    name: '#️⃣ Create Public Threads',
    value: Number(PermissionFlagsBits.CreatePublicThreads),
  },
  {
    name: '🔒 Create Private Threads',
    value: Number(PermissionFlagsBits.CreatePrivateThreads),
  },
  {
    name: '🏷️ Mention @everyone, @here, and All Roles',
    value: Number(PermissionFlagsBits.MentionEveryone),
  },
  {
    name: '💬 Manage Messages',
    value: Number(PermissionFlagsBits.ManageMessages),
  },
  {
    name: '#️⃣ Manage Threads',
    value: Number(PermissionFlagsBits.ManageThreads),
  },
  {
    name: '🎙️ Send Text-to-Speech Messages',
    value: Number(PermissionFlagsBits.SendTTSMessages),
  },
  {
    name: '🗣️ Priority Speaker',
    value: Number(PermissionFlagsBits.PrioritySpeaker),
  },
  {
    name: '🔇 Mute Members',
    value: Number(PermissionFlagsBits.MuteMembers),
  },
  {
    name: '🦻 Deafen Members',
    value: Number(PermissionFlagsBits.DeafenMembers),
  },
  {
    name: '🚚 Move Members',
    value: Number(PermissionFlagsBits.MoveMembers),
  },
  {
    name: '📆 Manage Events',
    value: Number(PermissionFlagsBits.ManageEvents),
  },
  {
    name: '👑 Administrator',
    value: Number(PermissionFlagsBits.Administrator),
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const roleModifyPermissionTypeChoices = [
  {
    name: '🟢 Grant',
    value: 'grant',
  },
  {
    name: '🚫 Deny',
    value: 'deny',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const threadChannels = [
  {
    name: '📣 Announcement Thread',
    value: ChannelType.AnnouncementThread,
  },
  {
    name: '👁️ Public Thread',
    value: ChannelType.PublicThread,
  },
  {
    name: '🔒 Private Thread',
    value: ChannelType.PrivateThread,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const guildChannels = [
  {
    name: '#️⃣ Text',
    value: ChannelType.GuildText,
  },
  {
    name: '🔊 Voice',
    value: ChannelType.GuildVoice,
  },
  {
    name: '📁 Category',
    value: ChannelType.GuildCategory,
  },
  {
    name: '📣 Announcement',
    value: ChannelType.GuildAnnouncement,
  },
  {
    name: '🎤 Stage',
    value: ChannelType.GuildStageVoice,
  },
  {
    name: '🗯️ Forum',
    value: ChannelType.GuildForum,
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const vtuberVideoSorting = [
  {
    name: '🆔 ID',
    value: 'id',
  },
  {
    name: '🔤 Name',
    value: 'english_name',
  },
  {
    name: '🔤 Channel Name',
    value: 'name',
  },
  {
    name: '👥 Group',
    value: 'group',
  },
  {
    name: '🔢 Video Count',
    value: 'video_count',
  },
  {
    name: '🔢 Subscriber Count',
    value: 'subscriber_count',
  },
  {
    name: '🔢 Clip Count',
    value: 'clip_count',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const vtuberStreamSorting = [
  {
    name: '👁️ Live Viewers',
    value: 'live_viewers',
  },
  {
    name: '🔤 Streamed At',
    value: 'available_at',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const animeDownloadSiteChoices = [
  {
    name: '🌐 Otakudesu',
    value: 'otakudesu',
  },
  {
    name: '🌐 Kusonime',
    value: 'kusonime',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const instagramDownloadTypeChoices = [
  {
    name: '🌐 Instagram Post',
    value: 'instagram',
  },
  {
    name: '🌐 Instagram Story',
    value: 'igstory',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const tiktokDownloadTypeChoices = [
  {
    name: '🎵 Audio',
    value: 'music',
  },
  {
    name: '🎞️ Video',
    value: 'video',
  },
  {
    name: '🎞️ Video (No Watermark)',
    value: 'videoNoWatermark',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const twitterDownloadTypeChoices = [
  {
    name: '🖼️ Image',
    value: 'image',
  },
  {
    name: '🎞️ Video',
    value: 'video',
  },
];

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const youtubeDownloadTypeChoices = [
  {
    name: '🎵 Audio',
    value: 'audio',
  },
  {
    name: '🎞️ Shorts',
    value: 'shorts',
  },
  {
    name: '🎞️ Video',
    value: 'video',
  },
];

module.exports = {
  animeCharacterSearchOrderChoices,
  animeDownloadSiteChoices,
  animeSearchOrderChoices,
  animeSearchStatusChoices,
  animeSearchTypeChoices,
  banChoices,
  banTempChoices,
  emitChoices,
  githubRepoSortingTypeChoices,
  guildChannels,
  instagramDownloadTypeChoices,
  mangaSearchOrderChoices,
  mangaSearchStatusChoices,
  mangaSearchTypeChoices,
  musicSearchChoices,
  musicSettingChoices,
  roleModifyPermissionTypeChoices,
  rolePermissionChoices,
  searchSortingChoices,
  serverMuteChoices,
  serverMuteTempChoices,
  slowmodeChoices,
  threadChannels,
  tiktokDownloadTypeChoices,
  timeoutChoices,
  twitterDownloadTypeChoices,
  vtuberStreamSorting,
  vtuberVideoSorting,
  waifuChoices,
  youtubeDownloadTypeChoices,
};
