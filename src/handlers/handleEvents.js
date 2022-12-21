const { connection } = require('mongoose');

const { loadFiles } = require('@/utils');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleEvents = async () => {
    const files = await loadFiles('events');

    files.forEach((file) => {
      /** @type {import('@/constants/types').Event} */
      const event = require(file);

      const execute = async (...args) => await event.execute(...args, client);

      if (file.includes('/client/')) {
        event.rest
          ? event.once
            ? client.rest.once(event.name, execute)
            : client.rest.on(event.name, execute)
          : event.once
          ? client.once(event.name, execute)
          : client.on(event.name, execute);
      }

      if (file.includes('/distube/')) {
        event.once
          ? client.distube.once(event.name, execute)
          : client.distube.on(event.name, execute);
      }

      if (file.includes('/mongo/')) {
        event.once
          ? connection.once(event.name, execute)
          : connection.on(event.name, execute);
      }
    });
  };
};
