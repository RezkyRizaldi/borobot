const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleCommands = async () => {
    const { commands, commandArray } = client;
    const commandPath = path.join(__dirname, '..', '..', 'commands');
    const commandFolders = fs.readdirSync(commandPath);

    for (const folder of commandFolders) {
      const commandSubPath = path.join(commandPath, folder);
      const commandFiles = fs
        .readdirSync(commandSubPath)
        .filter((file) => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandSubPath, file);

        /** @type {import('@/constants/types').Command} */
        const command = require(filePath);

        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commandArray.sort((a, b) => a.name.localeCompare(b.name)) },
    );
  };
};
