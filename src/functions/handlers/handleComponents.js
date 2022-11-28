const fs = require('fs');
const path = require('path');

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  client.handleComponents = () => {
    const componentPath = path.join(__dirname, '..', '..', 'components');

    if (fs.existsSync(componentPath)) {
      const componentFiles = fs
        .readdirSync(componentPath)
        .filter((file) => file.endsWith('.js'));

      for (const file of componentFiles) {
        const { components } = client;
        const filePath = path.join(componentPath, file);
        const component = require(filePath);

        components.set(component.data.name, component);
      }
    }
  };
};
