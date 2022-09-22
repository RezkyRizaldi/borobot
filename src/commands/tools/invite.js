const { EmbedBuilder, hyperlink, SlashCommandBuilder } = require('discord.js');

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
    const { client, guild } = interaction;

    const embed = new EmbedBuilder()
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      })
      .setAuthor({
        name: `🔗 ${client.user.username}'s Invite Link`,
      })
      .setDescription(
        `Here's your ${hyperlink(
          'invite link',
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`,
          'Get your invite link here',
        )} for invite me to your server!`,
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    await interaction
      .deferReply()
      .then(async () => await interaction.editReply({ embeds: [embed] }));
  },
};
