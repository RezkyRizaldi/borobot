const { bold, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { chunk } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inrole')
    .setDescription('👥 Show member list with specific role.')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('🛠️ The member role to show.')
        .setRequired(true),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const membersWithRole = interaction.guild.members.cache
      .filter((member) => member.roles.cache.has(role.id))
      .map((member) => member.user.username);

    if (!membersWithRole.length) {
      return interaction.reply({
        content: `There is no member with role ${role}`,
        ephemeral: true,
      });
    }

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

    const memberChunk = chunk(membersWithRole, 5);

    switch (true) {
      case memberChunk.length === 1:
        return interaction
          .deferReply({ fetchReply: true })
          .then(async () => {
            embed.setDescription(
              `👥 ${bold('Member list with role')} ${role} ${bold(
                `(${membersWithRole.length})`,
              )}\n\n${memberChunk.join('\n')}`,
            );

            await interaction.editReply({ embeds: [embed] });
          })
          .catch((err) => console.error(err))
          .finally(() =>
            setTimeout(async () => await interaction.deleteReply(), 10000),
          );

      case memberChunk.length > 1:
        return interaction
          .deferReply({ fetchReply: true })
          .then(async () => {
            embed.setDescription(
              `👥 ${bold('Member list with role')} ${role} ${bold(
                `(${membersWithRole.length}) [1/${memberChunk.length}]`,
              )}\n\n${memberChunk[0].join('\n')}`,
            );

            await interaction
              .editReply({ embeds: [embed] })
              .then(async (message) => {
                await message
                  .react('⬅️')
                  .then(async () => await message.react('➡️'));

                /**
                 *
                 * @param {import('discord.js').MessageReaction} reaction
                 * @param {import('discord.js').User} user
                 * @returns {Boolean} Boolean value of the filtered interaction.
                 */
                const filter = (reaction, user) =>
                  ['⬅️', '➡️'].includes(reaction.emoji.name) &&
                  user.id === interaction.user.id;
                const collector = message.createReactionCollector({
                  filter,
                  idle: 10000,
                });

                collector.on('collect', async (reaction) => {
                  await reaction.users
                    .remove(message.author)
                    .then(async (react) => {
                      let pg = 0;

                      switch (react.emoji.name) {
                        case '⬅️':
                          !memberChunk[pg - 1] ? (pg = 0) : (pg -= 1);

                          embed.setDescription(
                            `👥 ${bold('Member list with role')} ${role} ${bold(
                              `(${membersWithRole.length}) [${
                                pg === 0 ? '1' : pg + 1
                              }/${memberChunk.length}]`,
                            )}\n\n${memberChunk[pg].join('\n')}`,
                          );

                          return message
                            .edit({ embeds: [embed] })
                            .then(async (msg) => {
                              await msg.react('⬅️');
                              await msg.react('➡️');
                            });

                        case '➡️':
                          !memberChunk[pg + 1] ? (pg = 0) : (pg += 1);

                          embed.setDescription(
                            `👥 ${bold('Member list with role')} ${role} ${bold(
                              `(${membersWithRole.length}) [${
                                pg === 1 ? '2' : pg + 1
                              }/${memberChunk.length}]`,
                            )}\n\n${memberChunk[pg].join('\n')}`,
                          );

                          return message
                            .edit({ embeds: [embed] })
                            .then(async (msg) => {
                              await msg.react('⬅️');
                              await msg.react('➡️');
                            });
                      }
                    });
                });

                collector.on('end', async () => {
                  if (message) {
                    return message.reactions
                      .removeAll()
                      .then((msg) =>
                        setTimeout(async () => await msg.delete(), 10000),
                      );
                  }
                });
              });
          })
          .catch((err) => console.error(err));
    }
  },
};
