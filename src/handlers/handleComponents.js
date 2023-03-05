const AsciiTable = require('ascii-table');

const { loadFiles } = require('@/utils');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleComponents = async () => {
    const { components } = client;

    const files = await loadFiles('components');

    const table = new AsciiTable()
      .setTitle(`Components${files.length ? ` (${files.length})` : ''}`)
      .setHeading('#', 'Name', 'Status');

    files.forEach((file, i) => {
      /** @type {import('@/constants/types').Component} */
      const component = require(file);

      table.addRow(
        `${i + 1}.`,
        component?.data?.name ?? file,
        component?.data?.name ? '✅' : '❌ -> Undefined component name.',
      );

      components.set(component?.data?.name, component);
    });

    console.log(table.toString());
  };
};
