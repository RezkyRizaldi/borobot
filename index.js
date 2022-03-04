const DiscordJS = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const WOKCommands = require('wokcommands');

const testSchema = require('./test-schema');

const { Intents } = DiscordJS;

const client = new DiscordJS.Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', async () => {
	console.log('Bot is ready!');

	// await mongoose.connect(process.env.MONGO_URI, {
	// 	keepAlive: true,
	// });

	const guildId = '791708642813411358';
	const ownerId = '530963824396992514';

	new WOKCommands(client, {
		commandsDir: path.join(__dirname, 'commands'),
		testServers: [guildId],
		botOwners: [ownerId],
		mongoUri: process.env.MONGO_URI,
	})
		.setDefaultPrefix('!')
		.setColor(0xfcc9b9);

	// setTimeout(async () => {
	// 	await new testSchema({
	// 		message: 'Hello world!',
	// 	}).save();
	// }, 1000);

	// const guild = client.guilds.cache.get(guildId);
	// let commands;

	// if (guild) {
	// 	commands = guild.commands;
	// } else {
	// 	commands = client.application?.commands;
	// }

	// commands?.create({
	// 	name: 'ping',
	// 	description: 'Test command.',
	// });

	// 	commands?.create({
	// 		name: 'add',
	// 		description: 'Add two numbers.',
	// 		options: [
	// 			{
	// 				name: 'num1',
	// 				description: 'The first number.',
	// 				required: true,
	// 				type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
	// 			},
	// 			{
	// 				name: 'num2',
	// 				description: 'The second number.',
	// 				required: true,
	// 				type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
	// 			},
	// 		],
	// 	});
});

// client.on('interactionCreate', async (interaction) => {
// 	if (!interaction.isCommand()) return;

// 	const { commandName, options } = interaction;

// 	if (commandName === 'ping') {
// 		interaction.reply({
// 			content: 'pong',
// 			ephemeral: true,
// 		});
// 	} else if (commandName === 'add') {
// 		const num1 = options.getNumber('num1') || 0;
// 		const num2 = options.getNumber('num2') || 0;

// 		await interaction.deferReply({
// 			ephemeral: true,
// 		});
// 		await new Promise((resolve) => setTimeout(resolve, 5000));
// 		await interaction.editReply({
// 			content: `The sum is ${num1 + num2}`,
// 		});

// 		// interaction.reply({
// 		// 	content: `The sum is ${num1 + num2}`,
// 		// 	ephemeral: true,
// 		// });
// 	}
// });

// client.on('messageCreate', (message) => {
// 	if (message.content === 'ping') {
// 		message.reply({
// 			content: 'pong',
// 		});
// 	}
// });

client.login(process.env.TOKEN);
