const { Events, InteractionType } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: import('discord.js').TextChannel, client: { commands: import('discord.js').Collection<String, { data: import('discord.js').SlashCommandBuilder | import('discord.js').ContextMenuCommandBuilder, type: String, execute(): Promise<void> }>, components: import('discord.js').Collection<String, String> }, guild: import('discord.js').Guild|null }} */
    const {
      channel,
      client: { commands, components },
      guild,
    } = interaction;

    if (
      channel.id === guild.publicUpdatesChannelId ||
      channel.id === guild.rulesChannelId ||
      channel.id === guild.widgetChannelId ||
      channel.parent.id === process.env.DASHBOARD_CATEGORY_CHANNEL_ID
    ) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: `You don't have appropiate permissions to use slash command in ${channel}`,
          }),
      );
    }

    return {
      [InteractionType.ApplicationCommand]: async () => {
        const command = commands.get(interaction.commandName);

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
        const component = components.get(interaction.customId);

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
        const autocomplete = commands.get(interaction.commandName);

        if (!autocomplete) {
          return interaction.reply({
            content: 'Autocomplete not found',
          });
        }

        await autocomplete.autocomplete(interaction).catch(async (err) => {
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
        const modal = components.get(interaction.customId);

        if (!modal) {
          return interaction.reply({
            content: 'Modal not found',
          });
        }

        await modal.execute(interaction).catch(async (err) => {
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
