const { Client } = require('discord.js');
const fs = require('fs');

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
	client.handleComponents = async () => {
		const componentFolders = fs.readdirSync('./src/components');
		for (const folder of componentFolders) {
			const componentFiles = fs.readdirSync(`./src/components/${folder}`).filter((file) => file.endsWith('.js'));

			const { buttons, selectMenus, modals } = client;
			switch (folder) {
				case 'buttons':
					for (const file of componentFiles) {
						const button = require(`../../components/${folder}/${file}`);
						buttons.set(button.data.name, button);
					}
					break;

				case 'selectMenus':
					for (const file of componentFiles) {
						const selectMenu = require(`../../components/${folder}/${file}`);
						selectMenus.set(selectMenu.data.name, selectMenu);
					}
					break;

				case 'modals':
					for (const file of componentFiles) {
						const modal = require(`../../components/${folder}/${file}`);
						modals.set(modal.data.name, modal);
					}
					break;

				default:
					break;
			}
		}
	};
};
