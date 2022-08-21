const { Client, CommandInteraction, Events, InteractionType } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) {
				await interaction.reply({ content: 'Command not found.', ephemeral: true });
				return console.error(`Command not found: ${commandName}`);
			}

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
			}
		} else if (interaction.isButton()) {
			const { buttons } = client;
			const { customId } = interaction;
			const command = buttons.get(customId);
			if (!command) {
				await interaction.reply({ content: 'Button not found.', ephemeral: true });
				return console.error(`Button not found: ${customId}`);
			}

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this button.', ephemeral: true });
			}
		} else if (interaction.isSelectMenu()) {
			const { selectMenus } = client;
			const { customId } = interaction;
			const command = selectMenus.get(customId);
			if (!command) {
				await interaction.reply({ content: 'Select menu not found.', ephemeral: true });
				return console.error(`Select menu not found: ${customId}`);
			}

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this select menu.', ephemeral: true });
			}
		} else if (interaction.type === InteractionType.ModalSubmit) {
			const { modals } = client;
			const { customId } = interaction;
			const command = modals.get(customId);
			if (!command) {
				await interaction.reply({ content: 'Modal not found.', ephemeral: true });
				return console.error(`Modal not found: ${customId}`);
			}

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this modal.', ephemeral: true });
			}
		} else if (interaction.isContextMenuCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) {
				await interaction.reply({ content: 'Context menu not found.', ephemeral: true });
				return console.error(`Context menu not found: ${commandName}`);
			}

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this context menu.', ephemeral: true });
			}
		} else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) {
				await interaction.reply({ content: 'Autocomplete not found.', ephemeral: true });
				return console.error(`Autocomplete not found: ${commandName}`);
			}

			try {
				await command.autocomplete(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this autocomplete.', ephemeral: true });
			}
		}
	},
};
