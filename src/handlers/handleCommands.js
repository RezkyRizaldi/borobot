const AsciiTable = require('ascii-table');
const chalk = require('chalk');
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

    const table = new AsciiTable()
      .setTitle(`Commands${files.length ? ` (${files.length})` : ''}`)
      .setHeading('#', 'Name', 'Category', 'Type', 'Status');

    files
      .sort((a, b) => a.split('/').at(-1).localeCompare(b.split('/').at(-1)))
      .forEach((file, i) => {
        /** @type {import('@/constants/types').Command} */
        const command = require(file);

        table.addRow(
          `${i + 1}.`,
          command?.data.name ?? file,
          file.split('/').at(-2),
          command?.type ?? 'None',
          command?.data.name ? '✅' : '❌ -> Undefined command name.',
        );

        commands.set(command?.data.name, command);
        commandArray.push(command?.data.toJSON());
      });

    console.log(table.toString());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    console.log(
      chalk.blue('[info]', 'Started refreshing application (/) commands...'),
    );

    await rest
      .put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID,
        ),
        { body: commandArray },
      )
      .then(() =>
        console.log(
          chalk.green(
            '[success]',
            'Successfully reloaded application (/) commands!',
          ),
        ),
      );
  };
};
