const { SlashCommandBuilder } = require('discord.js');

const { Guild } = require('@/schemas');
const { generateEmbed } = require('@/utils');
const mongoose = require('mongoose');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('db')
    .setDescription('🫙 Database Command.'),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild } = interaction;

    if (!guild) throw "Guild doesn't exists.";

    let guildData = await Guild.findOne({ guildId: guild.id });

    if (!guildData) {
      guildData = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildId: guild.id,
        guildName: guild.name,
        guildIcon: guild.iconURL(),
      });

      await guildData.save();

      guildData = await Guild.findOne({ guildId: guild.id });
    }

    const embed = generateEmbed({ interaction }).setDescription('s');

    await interaction.editReply({ embeds: [embed] });
  },
};
