const { EmbedBuilder, inlineCode, SlashCommandBuilder } = require('discord.js');

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
    const botColor = await interaction.guild.members
      .fetch(interaction.client.user.id)
      .then((res) => res.displayHexColor);

    const embed = new EmbedBuilder()
      .setColor(botColor || 0xfcc9b9)
      .setTimestamp(Date.now())
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction
      .deferReply({ fetchReply: true })
      .then(async (message) => {
        embed.setDescription(
          `Websocket heartbeat: ${inlineCode(
            `${Math.round(interaction.client.ws.ping)}ms`,
          )}\nRoundtrip latency: ${inlineCode(
            `${message.createdTimestamp - interaction.createdTimestamp}ms`,
          )}`,
        );

        await interaction.editReply({ embeds: [embed] });
      })
      .catch((err) => console.error(err))
      .finally(() =>
        setTimeout(async () => await interaction.deleteReply(), 10000),
      );
  },
};
