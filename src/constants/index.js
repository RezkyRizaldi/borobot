const { languages } = require('@vitalets/google-translate-api');
const { ChannelType, Events } = require('discord.js');
const { SearchResultType } = require('distube');

const newSupportedLanguages = {
  ak: 'Twi',
  as: 'Assamese',
  ay: 'Aymara',
  bho: 'Bhojpuri',
  bm: 'Bambara',
  ckb: 'Kurdish (Sorani)',
  doi: 'Dogri',
  dv: 'Dhivehi',
  ee: 'Ewe',
  gn: 'Guarani',
  gom: 'Konkani',
  ilo: 'Ilocano',
  kri: 'Krio',
  lg: 'Luganda',
  ln: 'Lingala',
  lus: 'Mizo',
  mai: 'Maithili',
  'mni-Mtei': 'Meiteilon (Manipuri)',
  nso: 'Sepedi',
  om: 'Oromo',
  or: 'Odia (Oriya)',
  qu: 'Quechua',
  rw: 'Kinyarwanda',
  sa: 'Sanskrit',
  ti: 'Tigrinya',
  tk: 'Turkmen',
  ts: 'Tsonga',
  tt: 'Tatar',
  ug: 'Uyghur',
};

module.exports = {
  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  banChoices: [
    {
      name: "📆 Don't Delete Any",
      value: 0,
    },
    {
      name: '📆 Previous 1 Day',
      value: 1,
    },
    {
      name: '📆 Previous 2 Days',
      value: 2,
    },
    {
      name: '📆 Previous 3 Days',
      value: 3,
    },
    {
      name: '📆 Previous 4 Days',
      value: 4,
    },
    {
      name: '📆 Previous 5 Days',
      value: 5,
    },
    {
      name: '📆 Previous 6 Days',
      value: 6,
    },
    {
      name: '📆 Previous 7 Days',
      value: 7,
    },
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  timeoutChoices: [
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
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  emitChoices: [
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
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  musicSearchChoices: [
    {
      name: '🎥 Video',
      value: SearchResultType.VIDEO,
    },
    {
      name: '💽 Playlist',
      value: SearchResultType.PLAYLIST,
    },
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  musicSettingChoices: [
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
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  slowmodeChoices: [
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
  ],

  /** @type {{[x: string]: string}} */
  extendedLocales: { ...languages, ...newSupportedLanguages },

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  serverMuteChoices: [
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
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  serverMuteTempChoices: [
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
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  mdnLocales: [
    {
      name: 'English (US)',
      value: 'en-US',
    },
    {
      name: 'Español',
      value: 'es',
    },
    {
      name: 'Français',
      value: 'fr',
    },
    {
      name: '日本語',
      value: 'ja',
    },
    {
      name: '한국어',
      value: 'ko',
    },
    {
      name: '한국어',
      value: 'ko',
    },
    {
      name: 'Português (do Brasil)',
      value: 'pt-BR',
    },
    {
      name: 'Русский',
      value: 'ru',
    },
    {
      name: '中文 (简体)',
      value: 'zh-CN',
    },
    {
      name: '正體中文 (繁體)',
      value: 'zh-TW',
    },
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  githubRepoSortingTypeChoices: [
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
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  githubRepoOrderingTypeChoices: [
    {
      name: '⬆️ Descending',
      value: 'desc',
    },
    {
      name: '⬇️ Ascending',
      value: 'asc',
    },
  ],

  /** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
  waifuChoices: [
    {
      name: '🖼️ Image',
      value: 'image',
    },
    {
      name: '🖼️ Profile Picture',
      value: 'pfp',
    },
  ],
};
