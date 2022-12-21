const AsciiTable = require('ascii-table');
const { connection } = require('mongoose');

const { loadFiles } = require('@/utils');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleEvents = async () => {
    const files = await loadFiles('events');

    const table = new AsciiTable()
      .setTitle(`Events${files.length ? ` (${files.length})` : ''}`)
      .setHeading('#', 'Name', 'Category', 'Status');

    files
      .sort((a, b) => a.split('/').at(-1).localeCompare(b.split('/').at(-1)))
      .forEach((file, i) => {
        /** @type {import('@/constants/types').Event} */
        const event = require(file);

        const execute = async (...args) => await event.execute(...args, client);

        if (file.includes('/client/')) {
          table.addRow(
            `${i + 1}.`,
            event?.name ?? file,
            file.split('/').at(-2),
            event?.name ? '✅' : '❌ -> Undefined event name.',
          );

          event.once
            ? client.once(event?.name, execute)
            : client.on(event?.name, execute);
        }

        if (file.includes('/distube/')) {
          table.addRow(
            `${i + 1}.`,
            event?.name ?? file,
            file.split('/').at(-2),
            event?.name ? '✅' : '❌ -> Undefined event name.',
          );

          event.once
            ? client.distube.once(event?.name, execute)
            : client.distube.on(event?.name, execute);
        }

        if (file.includes('/mongo/')) {
          table.addRow(
            `${i + 1}.`,
            event?.name ?? file,
            file.split('/').at(-2),
            event?.name ? '✅' : '❌ -> Undefined event name.',
          );

          event.once
            ? connection.once(event?.name, execute)
            : connection.on(event?.name, execute);
        }
      });

    console.log(table.toString());
  };
};
