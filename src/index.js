const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { GuildBans, GuildInvites, GuildMembers, GuildMessages, GuildPresences, Guilds, MessageContent } = GatewayIntentBits;
const { GuildMember, Message } = Partials;
const client = new Client({ intents: [GuildBans, GuildInvites, GuildMembers, GuildMessages, GuildPresences, Guilds, MessageContent], partials: [Message, GuildMember] });
client.commands = new Collection();
client.components = new Collection();
client.commandArray = [];

const funcPath = path.join(__dirname, 'functions');
const funcFolders = fs.readdirSync(funcPath);
for (const folder of funcFolders) {
	const funcSubPath = path.join(funcPath, folder);
	const funcFiles = fs.readdirSync(funcSubPath).filter((file) => file.endsWith('.js'));
	for (const file of funcFiles) {
		const filePath = path.join(funcSubPath, file);
		require(filePath)(client);
	}
}

client
	.handleEvents()
	.then(() => client.handleComponents())
	.then(() => client.handleCommands())
	.then(() => client.login(process.env.token))
	.catch((err) => console.error(err));
