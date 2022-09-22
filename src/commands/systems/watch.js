const {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('watch')
    .setDescription('📽️ Watch YouTube video in a voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('🔊 Voice channel to be used to watch.')
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ client: import('discord.js').Client<Boolean>, member: import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { client, options } = interaction;

    const channel = options.getChannel('channel');

    /** @type {{ discordTogether: import('discord-together').DiscordTogether<{[x: string]: string}> }} */
    const { discordTogether } = client;

    return interaction.deferReply().then(
      async () =>
        await discordTogether.createTogetherCode(channel.id, 'youtube').then(
          async ({ code }) =>
            await interaction.editReply({
              content: code,
            }),
        ),
    );
  },
};
