const fs = require('fs');
const path = require('path');

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  client.handleEvents = () => {
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

            event.once
              ? client.once(
                  event.name,
                  async (...args) => await event.execute(...args, client),
                )
              : client.on(
                  event.name,
                  async (...args) => await event.execute(...args, client),
                );
          }

          break;

        case 'distube':
          for (const file of eventFiles) {
            const filePath = path.join(eventSubPath, file);
            const event = require(filePath);

            client.distube.on(
              event.name,
              async (...args) => await event.execute(...args, client),
            );
          }

          break;
      }
    }
  };
};
