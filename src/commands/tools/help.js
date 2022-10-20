const {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  chatInputApplicationCommandMention,
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  SlashCommandBuilder,
} = require('discord.js');
const { Pagination } = require('pagination.djs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('ℹ️ Show information about a command.')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('🎮 Command name to show the details information.'),
    ),
  type: 'Select Menu',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ client: import('discord.js').Client, guild: import('discord.js').Guild, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { client, guild, options } = interaction;

    /** @type {{ paginations: import('discord.js').Collection<String, import('pagination.djs').Pagination> }} */
    const { paginations } = client;

    const command = options.getString('command');

    const commands = await guild.commands.fetch().then((cmds) =>
      cmds
        .filter((cmd) => cmd.name !== 'help')
        .mapValues((cmd) => ({
          ...cmd,
          description:
            cmd.name === 'Avatar'
              ? "🖼️ Get the member's avatar."
              : cmd.name === 'User Info'
              ? 'ℹ️ Get information about a member.'
              : cmd.description,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      if (!command) {
        const pagination = new Pagination(interaction, {
          limit: 5,
        });

        pagination.setColor(guild.members.me.displayHexColor);
        pagination.setTimestamp(Date.now());
        pagination.setFooter({
          text: `${client.user.username} | Page {pageNumber} of {totalPages}`,
          iconURL: client.user.displayAvatarURL({
            dynamic: true,
          }),
        });
        pagination.setAuthor({
          name: `${client.user.username} Commands (${commands.size})`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
        pagination.setFields(
          commands.map((cmd) => ({
            name:
              cmd.type !== ApplicationCommandType.ChatInput
                ? cmd.name
                : chatInputApplicationCommandMention(cmd.name, cmd.id),
            value: cmd.description,
          })),
        );
        pagination.paginateFields();

        pagination.buttons = {
          ...pagination.buttons,
          extra: new ButtonBuilder()
            .setCustomId('jump')
            .setEmoji('↕️')
            .setDisabled(false)
            .setStyle(ButtonStyle.Secondary),
        };

        paginations.set(pagination.interaction.id, pagination);

        return pagination.render();
      }

      if (
        !commands.some(
          (cmd) =>
            cmd.name.toLowerCase().trim() === command.toLowerCase().trim(),
        )
      ) {
        return interaction.editReply({
          content: `${inlineCode(command)} command doesn't exist.`,
        });
      }

      const cmd = commands.find(
        (c) => c.name.toLowerCase().trim() === command.toLowerCase().trim(),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${client.user.username} Commands`,
          iconURL: client.user.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setDescription(
          `Information about the ${
            cmd.type !== ApplicationCommandType.ChatInput
              ? bold(cmd.name)
              : chatInputApplicationCommandMention(cmd.name, cmd.id)
          } command.`,
        )
        .setColor(guild.members.me.displayHexColor)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setTimestamp(Date.now())
        .setFields([
          {
            name: 'Command Type',
            value:
              cmd.type !== ApplicationCommandType.ChatInput
                ? 'Context Menu Command'
                : 'Slash Command',
            inline: true,
          },
        ]);

      if (cmd.options.length) {
        const hasSubcommandGroup = cmd.options.some(
          (option) =>
            option.type === ApplicationCommandOptionType.SubcommandGroup,
        );

        const hasSubcommand = cmd.options.some(
          (option) => option.type === ApplicationCommandOptionType.Subcommand,
        );

        const hasChoices = cmd.options.some(
          (option) => option.choices !== undefined,
        );

        const subcommandGroups = cmd.options.filter(
          (option) =>
            option.type === ApplicationCommandOptionType.SubcommandGroup,
        );

        const subcommands = cmd.options.filter(
          (option) => option.type === ApplicationCommandOptionType.Subcommand,
        );

        const regularCommands = cmd.options.filter(
          (option) =>
            option.type !== ApplicationCommandOptionType.SubcommandGroup &&
            option.type !== ApplicationCommandOptionType.Subcommand,
        );

        const choices = cmd.options.filter(
          (option) => option.choices !== undefined,
        );

        const hasNestedSubcommandGroup = subcommandGroups.some(
          (option) => option.options !== undefined,
        );

        const hasNestedChoices = cmd.options.some((option) =>
          option.options?.some((opt) => opt.choices !== undefined),
        );

        if (hasSubcommandGroup) {
          embed.addFields([
            {
              name: 'Subcommand Groups',
              value: subcommandGroups
                .map(
                  (option) =>
                    `${chatInputApplicationCommandMention(
                      cmd.name,
                      option.name,
                      cmd.id,
                    )} => ${option.description}`,
                )
                .join('\n'),
            },
          ]);

          if (hasNestedSubcommandGroup) {
            embed.addFields([
              {
                name: 'Subcommand Group Subcommands',
                value: subcommandGroups
                  .flatMap(
                    (option) =>
                      `${bold('•')} ${chatInputApplicationCommandMention(
                        cmd.name,
                        option.name,
                        cmd.id,
                      )}\n${option.options
                        .map(
                          (opt) =>
                            `${inlineCode(opt.name)} => ${opt.description}`,
                        )
                        .join('\n')}`,
                  )
                  .join('\n\n'),
              },
            ]);

            embed.addFields([
              {
                name: 'Subcommand Group Subcommand Options',
                value: subcommandGroups
                  .flatMap((option) =>
                    option.options
                      .map(
                        (opt) =>
                          `${bold('•')} ${chatInputApplicationCommandMention(
                            cmd.name,
                            option.name,
                            opt.name,
                            cmd.id,
                          )}\n${option.options
                            .map(
                              (o) =>
                                `${inlineCode(
                                  `${o.name}${o.required ? '' : '?'}`,
                                )} => ${o.description}`,
                            )
                            .join('\n')}`,
                      )
                      .join('\n\n'),
                  )
                  .join('\n\n'),
              },
            ]);
          }
        }

        if (hasSubcommand) {
          embed.addFields([
            {
              name: 'Subcommands',
              value: subcommands
                .map(
                  (option) =>
                    `${chatInputApplicationCommandMention(
                      cmd.name,
                      option.name,
                      cmd.id,
                    )} => ${option.description}`,
                )
                .join('\n'),
            },
          ]);

          embed.addFields([
            {
              name: 'Subcommand Options',
              value: subcommands
                .filter((option) => option.options !== undefined)
                .map(
                  (option) =>
                    `${bold('•')} ${chatInputApplicationCommandMention(
                      cmd.name,
                      option.name,
                      cmd.id,
                    )}\n${option.options
                      .map(
                        (opt) =>
                          `${inlineCode(
                            `${opt.name}${opt.required ? '' : '?'}`,
                          )} => ${opt.description}`,
                      )
                      .join('\n')}`,
                )
                .join('\n\n'),
            },
          ]);
        }

        if (!hasSubcommandGroup && !hasSubcommand) {
          embed.addFields([
            {
              name: 'Command Options',
              value: regularCommands
                .map(
                  (opt) =>
                    `${inlineCode(
                      `${opt.name}${opt.required ? '' : '?'}`,
                    )} => ${opt.description}`,
                )
                .join('\n'),
            },
          ]);
        }

        if (hasChoices) {
          embed.addFields([
            {
              name: 'Command Option Choices',
              value: choices
                .map(
                  (option) =>
                    `${bold(`• ${option.name}`)}\n${option.choices
                      .map((choice) => choice.name)
                      .join('\n')}`,
                )
                .join('\n'),
            },
          ]);
        }

        if (hasNestedChoices) {
          embed.addFields([
            {
              name: 'Subcommand Option Choices',
              value: cmd.options
                .filter((option) => option.options !== undefined)
                .flatMap((option) =>
                  option.options
                    .filter((opt) => opt.choices !== undefined)
                    .map(
                      (opt) =>
                        `${bold('•')} ${chatInputApplicationCommandMention(
                          cmd.name,
                          option.name,
                          cmd.id,
                        )} ${opt.name}\n${opt.choices
                          .map((choice) => choice.name)
                          .join('\n')}`,
                    ),
                )
                .join('\n\n'),
            },
          ]);
        }
      }

      await interaction.editReply({ embeds: [embed] });
    });
  },
};
