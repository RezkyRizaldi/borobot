const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
const { Message } = Partials;
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent], partials: [Message] });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const funcFolders = fs.readdirSync('./src/functions');
for (const folder of funcFolders) {
	const funcFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of funcFiles) {
		require(`./functions/${folder}/${file}`)(client);
	}
}

client
	.handleEvents()
	.then(() => client.handleCommands())
	.then(() => client.handleComponents())
	.then(() => client.login(process.env.token))
	.catch((err) => console.error(err));
