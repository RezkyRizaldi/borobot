const { capitalCase } = require('change-case');
const {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  chatInputApplicationCommandMention,
  bold,
  ButtonBuilder,
  ButtonStyle,
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
        (cmd) => cmd.name.toLowerCase().trim() === command.toLowerCase().trim(),
      )
    ) {
      return interaction.deferReply({ ephemeral: true }).then(
        async () =>
          await interaction.editReply({
            content: `${inlineCode(command)} command doesn't exist.`,
          }),
      );
    }

    const cmd = commands.find(
      (c) => c.name.toLowerCase().trim() === command.toLowerCase().trim(),
    );

    const pagination = new Pagination(interaction, {
      limit: 2,
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
      name: `${capitalCase(cmd.name)} Command Information`,
      iconURL: client.user.displayAvatarURL({
        dynamic: true,
      }),
    });

    const descriptions = [
      `${bold('Command Type')}\n${
        cmd.type !== ApplicationCommandType.ChatInput
          ? 'Context Menu Command'
          : 'Slash Command'
      }`,
    ];

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
        descriptions.push(
          `${bold('Subcommand Groups')}\n${subcommandGroups
            .map(
              (option) =>
                `${chatInputApplicationCommandMention(
                  cmd.name,
                  option.name,
                  cmd.id,
                )} => ${option.description}`,
            )
            .join('\n')}`,
        );

        if (hasNestedSubcommandGroup) {
          descriptions.push(
            `${bold('Subcommand Group Subcommands')}\n${subcommandGroups
              .flatMap(
                (option) =>
                  `${bold('•')} ${chatInputApplicationCommandMention(
                    cmd.name,
                    option.name,
                    cmd.id,
                  )}\n${option.options
                    .map(
                      (opt) => `${inlineCode(opt.name)} => ${opt.description}`,
                    )
                    .join('\n')}`,
              )
              .join('\n\n')}\n`,
            `${bold('Subcommand Group Subcommand Options')}\n${subcommandGroups
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
              .join('\n\n')}`,
          );
        }
      }

      if (hasSubcommand) {
        descriptions.push(
          `${bold('Subcommands')}\n${subcommands
            .map(
              (option) =>
                `${chatInputApplicationCommandMention(
                  cmd.name,
                  option.name,
                  cmd.id,
                )} => ${option.description}`,
            )
            .join('\n')}\n`,
          `${bold('Subcommand Options')}\n${subcommands
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
            .join('\n\n')}`,
        );
      }

      if (!hasSubcommandGroup && !hasSubcommand) {
        descriptions.push(
          `${bold('Command Options')}\n${regularCommands
            .map(
              (opt) =>
                `${inlineCode(`${opt.name}${opt.required ? '' : '?'}`)} => ${
                  opt.description
                }`,
            )
            .join('\n')}`,
        );
      }

      if (hasChoices) {
        descriptions.push(
          `${bold('Command Option Choices')}\n${choices
            .map(
              (option) =>
                `${bold(`• ${option.name}`)}\n${option.choices
                  .map((choice) => choice.name)
                  .join('\n')}`,
            )
            .join('\n')}`,
        );
      }

      if (hasNestedChoices) {
        descriptions.push(
          `${bold('Subcommand Option Choices')}\n${cmd.options
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
                    )} ${bold(opt.name)}\n${opt.choices
                      .map((choice) => choice.name)
                      .join('\n')}`,
                ),
            )
            .join('\n\n')}`,
        );
      }
    }

    pagination.setDescriptions(descriptions);

    pagination.buttons = {
      ...pagination.buttons,
      extra: new ButtonBuilder()
        .setCustomId('jump')
        .setEmoji('↕️')
        .setDisabled(false)
        .setStyle(ButtonStyle.Secondary),
    };

    paginations.set(pagination.interaction.id, pagination);

    await pagination.render();
  },
};
