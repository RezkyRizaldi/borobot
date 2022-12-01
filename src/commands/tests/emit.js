const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const { emitChoices } = require('../../constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emit')
    .setDescription('🔘 Emit an event.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('event')
        .setDescription('⚠️ The event to emit.')
        .setRequired(true)
        .addChoices(...emitChoices),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ client: import('discord.js').Client<true>, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { client, member, options } = interaction;
    const event = options.getString('event', true);

    await interaction.deferReply();

    if (!member) throw "Member doesn't exist.";

    client.emit(event, member);

    await interaction.editReply({ content: `Emitted ${event} event.` });
  },
};
