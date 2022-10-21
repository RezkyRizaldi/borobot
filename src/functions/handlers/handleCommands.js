const AsciiTable = require('ascii-table/ascii-table');
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  client.handleCommands = async () => {
    const table = new AsciiTable();
    table.setHeading('Name', 'Category', 'Type', 'Status');
    const { commands, commandArray } = client;
    const commandPath = path.join(__dirname, '..', '..', 'commands');
    const commandFolders = fs.readdirSync(commandPath);
    const arr = [];
    for (const folder of commandFolders) {
      const commandSubPath = path.join(commandPath, folder);
      const commandFiles = fs
        .readdirSync(commandSubPath)
        .filter((file) => file.endsWith('.js'));
      for (const file of commandFiles) {
        const filePath = path.join(commandSubPath, file);
        const command = require(filePath);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        table.addRow(
          command?.data?.name ?? file,
          folder,
          command?.type ?? 'None',
          '✅',
        );
        table.sort((a, b) => a[0].localeCompare(b[0]));
        arr.push(file);
      }
    }
    table.setTitle(`Commands${arr.length ? ` (${arr.length})` : ''}`);
    console.log(table.toString());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    console.log('Started refreshing application (/) commands.');
    await rest
      .put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID,
        ),
        { body: commandArray },
      )
      .then(() =>
        console.log('Successfully reloaded application (/) commands.'),
      )
      .catch(console.error);
  };
};
