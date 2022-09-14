const AsciiTable = require('ascii-table');
const { Events } = require('discord.js');
const { Events: DistubeEvents } = require('distube');
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  client.handleEvents = async () => {
    const table = new AsciiTable('Events');
    table.setHeading('Name', 'Instance', 'Status');
    let total;
    const eventPath = path.join(__dirname, '..', '..', 'events');
    const eventFolders = fs.readdirSync(eventPath);
    for (const folder of eventFolders) {
      const eventSubPath = path.join(eventPath, folder);
      const eventFiles = fs
        .readdirSync(eventSubPath)
        .filter((file) => file.endsWith('.js'));
      switch (folder) {
        case 'client':
          for (const file of eventFiles) {
            const filePath = path.join(eventSubPath, file);
            const event = require(filePath);

            if (!Object.values(Events).includes(event.name)) {
              table.addRow(
                event?.name ?? file,
                `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`,
                '❌ -> invalid event name.',
              );
              continue;
            }

            event.once
              ? client.once(event.name, (...args) =>
                  event.execute(...args, client),
                )
              : client.on(event.name, (...args) =>
                  event.execute(...args, client),
                );

            table.addRow(
              event.name,
              `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`,
              '✅',
            );
          }
          total = eventFiles.length;
          break;

        case 'distube':
          for (const file of eventFiles) {
            const filePath = path.join(eventSubPath, file);
            const event = require(filePath);

            if (!Object.values(DistubeEvents).includes(event.name)) {
              table.addRow(
                event?.name ?? file,
                `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`,
                '❌ -> invalid event name.',
              );
              continue;
            }

            client.distube.on(event.name, (...args) =>
              event.execute(...args, client),
            );

            table.addRow(
              event.name,
              `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`,
              '✅',
            );
          }
          total += eventFiles.length;
          break;
      }
    }

    table.setTitle(`Events ${total > 0 && `(${total})`}`);
    console.log(table.toString());
  };
};
