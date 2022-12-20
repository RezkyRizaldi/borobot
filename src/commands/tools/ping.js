const { inlineCode, SlashCommandBuilder } = require('discord.js');

const { generateEmbed } = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("🤖 Test the bot's latency."),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const { client } = interaction;

    const message = await interaction.deferReply({ fetchReply: true });

    const embed = generateEmbed({ interaction }).setDescription(
      `Websocket heartbeat: ${inlineCode(
        `${Math.round(client.ws.ping)}ms`,
      )}\nRoundtrip latency: ${inlineCode(
        `${message.createdTimestamp - interaction.createdTimestamp}ms`,
      )}`,
    );

    await interaction.editReply({ embeds: [embed] });
  },
};
