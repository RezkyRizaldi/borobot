const { loadFiles } = require('@/utils');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleComponents = async () => {
    const { components } = client;

    const files = await loadFiles('components');

    files.forEach((file) => {
      /** @type {import('@/constants/types').Component} */
      const component = require(file);

      components.set(component.data.name, component);
    });
  };
};
