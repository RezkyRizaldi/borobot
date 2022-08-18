const AsciiTable = require('ascii-table');
const { Client } = require('discord.js');
const fs = require('fs');

const { Events } = require('../../constants/Events');

/**
 *
 * @param {Client} client
 * @param {AsciiTable} Ascii
 */
module.exports = (client, Ascii) => {
	client.handleEvents = async () => {
		const table = new Ascii('Events');
		table.setHeading('Name', 'Instance', 'Status');
		let total;
		const eventFolders = fs.readdirSync('./src/events');
		for (const folder of eventFolders) {
			const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.js'));
			switch (folder) {
				case 'client':
					for (const file of eventFiles) {
						const event = require(`../../events/${folder}/${file}`);

						if (!Events.includes(event.name)) {
							table.addRow(`${eventFiles.indexOf(file) + 1}.`, event.name || file, `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`, '❌ -> invalid event name.');
							continue;
						}

						if (event.once) {
							client.once(event.name, (...args) => event.execute(...args, client));
						} else {
							client.on(event.name, (...args) => event.execute(...args, client));
						}

						total = eventFiles.length;
						table.addRow(event.name, `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`, '✅');
					}
					break;

				default:
					break;
			}
		}

		table.setTitle(`Events ${total > 0 ? `(${total})` : ''}`);
		console.log(table.toString());
	};
};
