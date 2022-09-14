const { EmbedBuilder, hyperlink, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription("🔗 Grab the bot's invite link."),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction
      .deferReply()
      .then(async () => {
        const embed = new EmbedBuilder()
          .setColor(interaction.guild.members.me.displayHexColor)
          .setTimestamp(Date.now())
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setTitle(`${interaction.client.user.username}'s Invite Link`)
          .setDescription(
            `Here's your ${hyperlink(
              'invite link',
              `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=applications.commands%20bot`,
              'Get your invite link here',
            )} for invite me to your server!`,
          )
          .setThumbnail(
            interaction.client.user.displayAvatarURL({ dynamic: true }),
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
