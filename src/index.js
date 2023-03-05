require('module-alias/register');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const chalk = require('chalk');
const { DiscordTogether } = require('discord-together');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require('discord.js');
const { DisTube } = require('distube');
require('dotenv').config();
// const mongoose = require('mongoose');

const keepAlive = require('./server');
const { loadFiles } = require('@/utils');

const {
  GuildBans,
  GuildInvites,
  GuildEmojisAndStickers,
  GuildMembers,
  GuildMessageReactions,
  GuildMessages,
  GuildPresences,
  Guilds,
  GuildVoiceStates,
  MessageContent,
} = GatewayIntentBits;
const { Channel, GuildMember, Message, Reaction, ThreadMember, User } =
  Partials;

/** @type {import('@/constants/types').Client} */
const client = new Client({
  intents: [
    GuildBans,
    GuildInvites,
    GuildEmojisAndStickers,
    GuildMembers,
    GuildMessageReactions,
    GuildMessages,
    GuildPresences,
    Guilds,
    GuildVoiceStates,
    MessageContent,
  ],
  partials: [Channel, Message, GuildMember, Reaction, ThreadMember, User],
});

client.commands = new Collection();
client.components = new Collection();
client.paginations = new Collection();
client.commandArray = [];
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({ emitEventsAfterFetching: true }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});
client.discordTogether = new DiscordTogether(client);

const initHandlers = async () => {
  const files = await loadFiles('handlers');

  files.forEach((file) => require(file)(client));
};

(async () => {
  await initHandlers(client);
  await client.handleLanguage();
  await client.handleEvents();
  await client.handleComponents();
  await client.handleCommands();
  await client.login(process.env.TOKEN);
  // await mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI);
})().catch((err) => console.error(chalk.red(`[error] ${err}`)));

keepAlive();
