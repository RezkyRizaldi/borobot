const { EmbedBuilder, inlineCode, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

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
    const { client, guild } = interaction;

    await interaction
      .deferReply()
      .then(async (message) => {
        const embed = new EmbedBuilder()
          .setColor(guild.members.me.displayHexColor)
          .setTimestamp(Date.now())
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setDescription(
            `Websocket heartbeat: ${inlineCode(
              `${Math.round(client.ws.ping)}ms`,
            )}\nRoundtrip latency: ${inlineCode(
              `${message.createdTimestamp - interaction.createdTimestamp}ms`,
            )}`,
          );

        await interaction.editReply({ embeds: [embed] });
      })
      .catch(async (err) => {
        console.error(err);

        await interaction.editReply({ content: err.message });
      })
      .finally(
        async () =>
          await wait(15000).then(async () => await interaction.deleteReply()),
      );
  },
};
