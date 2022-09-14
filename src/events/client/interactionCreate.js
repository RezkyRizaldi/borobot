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
          });
        }

        await command.execute(interaction).catch(async (err) => {
          console.error(err);

          if (interaction.replied || interaction.deferred) {
            return interaction.editReply({
              content: 'There was an error while executing this command!',
            });
          }

          await interaction.reply({
            content: 'There was an error while executing this command!',
          });
        });
      },
      [InteractionType.MessageComponent]: async () => {
        const component = client.components.get(interaction.customId);

        if (!component) return;

        await component.execute(interaction).catch(async (err) => {
          console.error(err);

          if (interaction.replied || interaction.deferred) {
            return interaction.editReply({
              content: 'There was an error while executing this command!',
            });
          }

          await interaction.reply({
            content: 'There was an error while executing this command!',
          });
        });
      },
      [InteractionType.ApplicationCommandAutocomplete]: async () => {
        const autocomplete = client.commands.get(interaction.commandName);

        if (!autocomplete) {
          return interaction.reply({
            content: 'Autocomplete not found',
          });
        }

        await autocomplete.execute(interaction).catch(async (err) => {
          console.error(err);

          if (interaction.replied || interaction.deferred) {
            return interaction.editReply({
              content: 'There was an error while executing this command!',
            });
          }

          await interaction.reply({
            content: 'There was an error while executing this command!',
          });
        });
      },
      [InteractionType.ModalSubmit]: async () => {
        const modal = client.components.get(interaction.customId);

        if (!modal) {
          return interaction.reply({
            content: 'Modal not found',
          });
        }

        await modal
          .execute(interaction)
          .then(() => interaction.reply({ content: 'success' }))
          .catch(async (err) => {
            console.error(err);

            if (interaction.replied || interaction.deferred) {
              return interaction.editReply({
                content: 'There was an error while executing this command!',
              });
            }

            await interaction.reply({
              content: 'There was an error while executing this command!',
            });
          });
      },
    }[interaction.type]();
  },
};
