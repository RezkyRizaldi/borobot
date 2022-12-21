const { REST, Routes } = require('discord.js');

const { loadFiles } = require('@/utils');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleCommands = async () => {
    const { commands, commandArray } = client;

    const files = await loadFiles('commands');

    files.forEach((file) => {
      /** @type {import('@/constants/types').Command} */
      const command = require(file);

      commands.set(command.data.name, command);
      commandArray.push(command.data.toJSON());
    });

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
