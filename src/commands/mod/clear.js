const {
  Collection,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  userMention,
} = require('discord.js');
const pluralize = require('pluralize');

const { count, groupMessageByAuthor } = require('../../utils');

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
        .setMinValue(1)
        .setMaxValue(50)
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
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, client: import('discord.js').Client<true>, guild: ?import('discord.js').Guild | null, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { channel, client, guild, options } = interaction;

    if (!guild) return;

    await interaction.deferReply({ ephemeral: true });

    if (!channel) throw "Channel doesn't exist.";

    const amount = options.getInteger('amount', true);

    /** @type {?import('discord.js').GuildMember} */
    const member = options.getMember('member');

    /** @type {?import('discord.js').Role} */
    const role = options.getRole('role');

    const messages = await channel.messages.fetch();

    if (!messages.size) throw `${channel} doesn't have any message.`;

    if (!messages.first().deletable) {
      throw "You don't have appropiate permissions to delete messages.";
    }

    let i = 0;

    /** @type {Collection<import('discord.js').Snowflake, import('discord.js').Message>} */
    const filteredMessages = new Collection();

    switch (true) {
      case member !== null && role !== null:
        {
          const membersWithRole = guild.members.cache
            .filter((m) => m.roles.cache.has(role.id))
            .map((m) => m.id);

          messages.filter((message) => {
            if (
              message.author.id === member.id ||
              (membersWithRole.includes(message.author.id) && amount > i)
            ) {
              i++;

              return filteredMessages.set(message.id, message);
            }
          });

          if (!filteredMessages.size) {
            throw `members with role ${role} doesn't have any message in ${channel}.`;
          }
        }
        break;

      case member !== null:
        {
          messages.filter((message) => {
            if (message.author.id === member.id && amount > i) {
              filteredMessages.set(message.id, message);
              i++;
            }

            return message;
          });

          if (!filteredMessages.size) {
            throw `${member} doesn't have any message in ${channel}.`;
          }
        }
        break;

      case role !== null:
        {
          const membersWithRole = guild.members.cache
            .filter((m) => m.roles.cache.has(role.id))
            .map((m) => m.id);

          messages.filter((message) => {
            if (membersWithRole.includes(message.author.id) && amount > i) {
              filteredMessages.set(message.id, message);
              i++;
            }

            return message;
          });

          if (!filteredMessages.size) {
            throw `members with role ${role} doesn't have any message in ${channel}.`;
          }
        }
        break;
    }

    const msgs = await channel.bulkDelete(
      filteredMessages.size ? filteredMessages : amount,
      true,
    );

    if (!msgs.size) throw 'No messages can be deleted.';

    const embed = new EmbedBuilder()
      .setColor(guild.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({ name: `🗑️ ${pluralize('Message', msgs.size)} Deleted` });

    switch (true) {
      case member !== null && role !== null: {
        const groupedMessages = groupMessageByAuthor(msgs);

        embed.setDescription(
          groupedMessages
            .map(
              (arrMessage, index, array) =>
                `Deleted ${count({
                  total: array[index].length,
                  data: 'message',
                })}${
                  arrMessage[index]?.author
                    ? ` from ${userMention(arrMessage[index].author.id)}`
                    : ''
                }.`,
            )
            .join('\n'),
        );

        return interaction.editReply({ embeds: [embed] });
      }

      case member !== null:
        embed.setDescription(
          `Deleted ${count({ total: msgs.size, data: 'message' })}${
            msgs.first().author
              ? ` from ${userMention(msgs.first().author.id)}`
              : ''
          }.`,
        );

        return interaction.editReply({ embeds: [embed] });

      case role !== null: {
        const groupedMessages = groupMessageByAuthor(msgs);

        embed.setDescription(
          groupedMessages
            .map(
              (arrMessage, index, array) =>
                `Deleted ${count({
                  total: array[index].length,
                  data: 'message',
                })}${
                  arrMessage[index].author
                    ? ` from ${userMention(arrMessage[index].author.id)}`
                    : ''
                }.`,
            )
            .join('\n'),
        );

        return interaction.editReply({ embeds: [embed] });
      }

      default: {
        embed.setDescription(
          `Deleted ${count({ total: msgs.size, data: 'message' })}.`,
        );

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
