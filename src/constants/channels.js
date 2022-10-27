const { ChannelType } = require('discord.js');

/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
const threadChannels = [
  {
    name: '📣 Announcement Thread',
    value: ChannelType.AnnouncementThread,
  },
  {
    name: '👁️‍🗨️ Public Thread',
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

module.exports = { threadChannels, guildChannels };
