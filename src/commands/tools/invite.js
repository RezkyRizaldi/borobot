const {
  EmbedBuilder,
  hyperlink,
  OAuth2Scopes,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription("🔗 Grab the bot's invite link.")
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({ name: `🔗 ${client.user.username}'s Invite Link` })
      .setDescription(
        `Here's your ${hyperlink(
          'invite link',
          client.generateInvite({
            permissions: [PermissionFlagsBits.Administrator],
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
          }),
          'Get your invite link here',
        )} for invite me to your server!`,
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    return interaction.editReply({ embeds: [embed] });
  },
};
