const { REST } = require('@discordjs/rest');
const AsciiTable = require('ascii-table/ascii-table');
const { Routes } = require('discord-api-types/v9');
const { Client } = require('discord.js');

const fs = require('fs');

/**
 *
 * @param {Client} client
 * @param {AsciiTable} Ascii
 */
module.exports = (client, Ascii) => {
	client.handleCommands = async () => {
		const table = new Ascii();
		table.setHeading('Name', 'Category', 'Type', 'Status');
		const { commands, commandArray } = client;
		const commandFolders = fs.readdirSync('./src/commands');
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				commands.set(command.data.name, command);
				commandArray.push(command.data.toJSON());
				table.setTitle(`Commands${file.length > 0 ? ` (${file.length})` : ''}`);
				table.addRow(command.data.name || file, folder, command.type || 'None', '✅');
				table.sort((a, b) => a[0].localeCompare(b[0]));
			}
		}
		console.log(table.toString());

		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
		try {
			console.log('Started refreshing application (/) commands.');
			await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commandArray });
			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	};
};
