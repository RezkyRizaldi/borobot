const {
  Collection,
  PermissionFlagsBits,
  SlashCommandBuilder,
  userMention,
} = require('discord.js');
const { changeLanguage, t } = require('i18next');
const pluralize = require('pluralize');

const { count, generateEmbed, groupMessageByAuthor } = require('@/utils');

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
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, guild: ?import('discord.js').Guild, locale: import('discord.js').Locale, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { channel, guild, locale, options } = interaction;

    const amount = options.getInteger('amount', true);
    const messages = await channel.messages.fetch();
    let i = 0;

    /** @type {?import('discord.js').GuildMember} */
    const member = options.getMember('member');

    /** @type {?import('discord.js').Role} */
    const role = options.getRole('role');

    /** @type {Collection<String, import('discord.js').Message<true>>} */
    const filteredMessages = new Collection();

    await interaction.deferReply({ ephemeral: true });

    await changeLanguage(locale);

    if (!guild) throw t('global.error.guild');

    if (!channel) throw t('global.error.channel.notFound');

    if (!messages.size) throw t('global.error.message.notFound', { channel });

    if (!messages.some((msg) => msg.bulkDeletable)) {
      throw t('global.error.message.perm');
    }

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
            throw t('global.error.message.role', { role, channel });
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
            throw t('global.error.message.member', { member, channel });
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
            throw t('global.error.message.role', { role, channel });
          }
        }
        break;
    }

    const msgs = await channel.bulkDelete(
      filteredMessages.size ? filteredMessages : amount,
      true,
    );

    if (!msgs.size) throw t('global.error.messages');

    const embed = generateEmbed({ interaction }).setAuthor({
      name: `🗑️ ${pluralize('Message', msgs.size)} Deleted`,
    });

    switch (true) {
      case member !== null && role !== null: {
        const groupedMessages = groupMessageByAuthor(msgs);

        embed.setDescription(
          groupedMessages
            .map(
              (arrMessage, index, array) =>
                `Deleted ${count(array[index], 'message')}${
                  arrMessage[index].author
                    ? ` from ${userMention(arrMessage[index].author.id)}`
                    : ''
                }.`,
            )
            .join('\n'),
        );

        return await interaction.editReply({ embeds: [embed] });
      }

      case member !== null:
        embed.setDescription(
          `Deleted ${count(msgs.size, 'message')}${
            msgs.first().author
              ? ` from ${userMention(msgs.first().author.id)}`
              : ''
          }.`,
        );

        return await interaction.editReply({ embeds: [embed] });

      case role !== null: {
        const groupedMessages = groupMessageByAuthor(msgs);

        embed.setDescription(
          groupedMessages
            .map(
              (arrMessage, index, array) =>
                `Deleted ${count(array[index], 'message')}${
                  arrMessage[index].author
                    ? ` from ${userMention(arrMessage[index].author.id)}`
                    : ''
                }.`,
            )
            .join('\n'),
        );

        return await interaction.editReply({ embeds: [embed] });
      }

      default: {
        embed.setDescription(`Deleted ${count(msgs.size, 'message')}.`);

        return await interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
