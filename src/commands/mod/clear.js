const {
  bold,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  userMention,
  Collection,
} = require('discord.js');
const pluralize = require('pluralize');

const { groupMessageByAuthor } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription(
      '❌ Delete a certain amount of messages sent by the members.',
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('🔢 The amount of messages to delete.')
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('👤 The member to delete messages from.'),
    )
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription(
          '👥 The members with specific role to delete messages from.',
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: import('discord.js').TextChannel }} */
    const { channel } = interaction;

    const amount = interaction.options.getInteger('amount');

    /** @type {import('discord.js').GuildMember} */
    const member = interaction.options.getMember('member');
    const role = interaction.options.getRole('role');

    const messages = await channel.messages.fetch();

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!messages.size) {
        return interaction.editReply({
          content: `${channel} doesn't have any message.`,
        });
      }

      if (!messages.first().deletable) {
        return interaction.editReply({
          content: "You don't have appropiate permissions to delete messages.",
        });
      }

      if (amount <= 0) {
        return interaction.editReply({
          content: 'Please specify the message amount from 1 to 50.',
        });
      }

      if (amount > 50) {
        return interaction.editReply({
          content: `You can only delete up to ${bold(
            '50',
          )} messages at a time.`,
        });
      }

      let i = 0;

      /** @type {import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>} */
      const filteredMessages = new Collection();

      switch (true) {
        case !!member && !!role: {
          const membersWithRole = interaction.guild.members.cache
            .filter((m) => m.roles.cache.has(role.id))
            .map((m) => m.id);

          messages.filter((message) => {
            if (
              message.author.id === member.id ||
              (membersWithRole.includes(message.author.id) && amount > i)
            ) {
              filteredMessages.set(message.id, message);
              i++;
            }
          });

          if (!filteredMessages.size) {
            return interaction.editReply({
              content: `members with role ${role} doesn't have any message in ${channel}`,
            });
          }

          break;
        }

        case !!member: {
          messages.filter((message) => {
            if (message.author.id === member.id && amount > i) {
              filteredMessages.set(message.id, message);
              i++;
            }
          });

          if (!filteredMessages.size) {
            return interaction.editReply({
              content: `${member} doesn't have any message in ${channel}`,
            });
          }

          break;
        }

        case !!role: {
          const membersWithRole = interaction.guild.members.cache
            .filter((m) => m.roles.cache.has(role.id))
            .map((m) => m.id);

          messages.filter((message) => {
            if (membersWithRole.includes(message.author.id) && amount > i) {
              filteredMessages.set(message.id, message);
              i++;
            }
          });

          if (!filteredMessages.size) {
            return interaction.editReply({
              content: `members with role ${role} doesn't have any message in ${channel}`,
            });
          }

          break;
        }
      }

      if (filteredMessages.size > 50) {
        return interaction.editReply({
          content: `You can only delete up to ${bold(
            '50',
          )} messages at a time.`,
        });
      }

      await channel
        .bulkDelete(filteredMessages.size ? filteredMessages : amount, true)
        .then(async (msgs) => {
          const embed = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTimestamp(Date.now())
            .setFooter({
              text: interaction.client.user.username,
              iconURL: interaction.client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setAuthor({
              name: `🗑️ ${pluralize('Message', msgs.size)} Deleted`,
            });

          switch (true) {
            case !!member && !!role: {
              const groupedMessages = groupMessageByAuthor(msgs);

              embed.setDescription(
                groupedMessages
                  .map(
                    (arrMessage, index, array) =>
                      `Deleted ${bold(`${array[index].length}`)} ${pluralize(
                        'message',
                        array[index].length,
                      )}${
                        arrMessage[index]?.author
                          ? ` from ${userMention(arrMessage[index].author.id)}`
                          : ''
                      }.`,
                  )
                  .join('\n'),
              );

              return interaction.editReply({ embeds: [embed] });
            }

            case !!member:
              embed.setDescription(
                `Deleted ${bold(`${msgs.size}`)} ${pluralize(
                  'message',
                  msgs.size,
                )}${
                  msgs.first()?.author
                    ? ` from ${userMention(msgs.first().author.id)}`
                    : ''
                }.`,
              );

              return interaction.editReply({ embeds: [embed] });

            case !!role: {
              const groupedMessages = groupMessageByAuthor(msgs);

              embed.setDescription(
                groupedMessages
                  .map(
                    (arrMessage, index, array) =>
                      `Deleted ${bold(`${array[index].length}`)} ${pluralize(
                        'message',
                        array[index].length,
                      )}${
                        arrMessage[index]?.author
                          ? ` from ${userMention(arrMessage[index].author.id)}`
                          : ''
                      }.`,
                  )
                  .join('\n'),
              );

              return interaction.editReply({ embeds: [embed] });
            }
          }

          embed.setDescription(
            `Deleted ${bold(`${msgs.size}`)} ${pluralize(
              'message',
              msgs.size,
            )}.`,
          );

          await interaction.editReply({ embeds: [embed] });
        });
    });
  },
};
