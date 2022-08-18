const Ascii = require('ascii-table');
const fs = require('fs');

const { Events } = require('../../constants/Events');

module.exports = (client) => {
	client.handleEvents = async () => {
		const table = new Ascii();
		table.setHeading('No.', 'Name', 'Status');
		const eventFolders = fs.readdirSync('./src/events');
		for (const folder of eventFolders) {
			const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.js'));
			switch (folder) {
				case 'client':
					for (const file of eventFiles) {
						const event = require(`../../events/${folder}/${file}`);

						if (!Events.includes(event.name)) {
							table.addRow(`${eventFiles.indexOf(file) + 1}.`, event.name || file, '❌ -> invalid event name.');
							continue;
						}

						if (event.once) {
							client.once(event.name, (...args) => event.execute(...args, client));
						} else {
							client.on(event.name, (...args) => event.execute(...args, client));
						}

						table.addRow(`${eventFiles.indexOf(file) + 1}.`, event.name, '✅');
					}

					console.log(table.toString());
					break;

				default:
					break;
			}
		}
	};
};
