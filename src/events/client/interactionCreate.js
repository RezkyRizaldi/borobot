const { Events, InteractionType } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */
  async execute(interaction, client) {
    return {
      [InteractionType.ApplicationCommand]: async () => {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          return interaction.reply({
            content: 'Command not found',
            ephemeral: true,
          });
        }

        await command.execute(interaction).catch(async (err) => {
          console.error(err);
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        });
      },
      [InteractionType.MessageComponent]: async () => {
        const component = client.components.get(interaction.customId);

        if (!component) {
          return interaction.reply({
            content: 'Component not found',
            ephemeral: true,
          });
        }

        await component.execute(interaction).catch(async (err) => {
          console.error(err);
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        });
      },
      [InteractionType.ApplicationCommandAutocomplete]: async () => {
        const autocomplete = client.commands.get(interaction.commandName);

        if (!autocomplete) {
          return interaction.reply({
            content: 'Autocomplete not found',
            ephemeral: true,
          });
        }

        await autocomplete.execute(interaction).catch(async (err) => {
          console.error(err);
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        });
      },
      [InteractionType.ModalSubmit]: async () => {
        const modal = client.components.get(interaction.customId);

        if (!modal) {
          return interaction.reply({
            content: 'Modal not found',
            ephemeral: true,
          });
        }

        await modal.execute(interaction).catch(async (err) => {
          console.error(err);
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        });
      },
    }[interaction.type]();
  },
};
