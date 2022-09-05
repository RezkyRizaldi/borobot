const AsciiTable = require('ascii-table');
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
	client.handleComponents = async () => {
		const table = new AsciiTable('Components');
		table.setHeading('Name', 'Status');
		const componentPath = path.join(__dirname, '..', '..', 'components');
		const componentFiles = fs.readdirSync(componentPath).filter((file) => file.endsWith('.js'));
		for (const file of componentFiles) {
			const { components } = client;
			const filePath = path.join(componentPath, file);
			const component = require(filePath);

			table.setTitle(`Components${componentFiles.length && ` (${componentFiles.length})`}`);
			table.addRow(component.data.name, '✅');

			components.set(component.data.name, component);
		}

		console.log(table.toString());
	};
};
