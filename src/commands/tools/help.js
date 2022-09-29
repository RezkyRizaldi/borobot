const {
  ApplicationCommandOptionType,
  bold,
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

    /** @type {{ commandArray: { name: String, description: String|undefined, type: Number|undefined, options: import('discord.js').ApplicationCommandChoicesOption[] }[] }} */
    const { commandArray: commands } = client;

    const command = options.getString('command');

    const cmds = commands
      .filter(({ name }) => name !== 'help')
      .map(({ name, description, type, options: opts }) => ({
        name,
        description:
          name === 'Avatar'
            ? "🖼️ Get the member's avatar."
            : name === 'User Info'
            ? 'ℹ️ Get information about a member.'
            : description,
        type,
        options: opts,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

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
          name: `${client.user.username} Commands (${cmds.length})`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
        pagination.setFields(
          cmds.map((option) => ({
            name: option.type !== undefined ? option.name : `/${option.name}`,
            value: option.description,
          })),
        );
        pagination.paginateFields();

        return pagination.render();
      }

      if (
        !cmds.some(
          (cmd) =>
            cmd.name.toLowerCase().replace(/\s+/g, '') ===
            command.toLowerCase().replace(/\s+/g, ''),
        )
      ) {
        return interaction.editReply({
          content: `${inlineCode(command)} command doesn't exist.`,
        });
      }

      const cmd = cmds.find(
        (c) =>
          c.name.toLowerCase().replace(/\s+/g, '') ===
          command.toLowerCase().replace(/\s+/g, ''),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${client.user.username} Commands`,
          iconURL: client.user.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setDescription(
          `Information about the ${bold(
            cmd.type !== undefined ? cmd.name : `/${cmd.name}`,
          )} command.`,
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
              cmd.type !== undefined ? 'Context Menu Command' : 'Slash Command',
            inline: true,
          },
        ]);

      if (cmd.options !== undefined) {
        if (
          cmd.options.some(
            (option) =>
              option.type === ApplicationCommandOptionType.SubcommandGroup,
          )
        ) {
          embed.addFields([
            {
              name: 'Subcommand Groups',
              value: cmd.options
                .filter(
                  (option) =>
                    option.type ===
                    ApplicationCommandOptionType.SubcommandGroup,
                )
                .map(
                  (option) =>
                    `${inlineCode(option.name)} => ${option.description}`,
                )
                .join('\n'),
            },
          ]);
        }

        if (
          cmd.options.some(
            (option) => option.type === ApplicationCommandOptionType.Subcommand,
          )
        ) {
          embed.addFields([
            {
              name: 'Subcommands',
              value: cmd.options
                .filter(
                  (option) =>
                    option.type === ApplicationCommandOptionType.Subcommand,
                )
                .map((opt) => `${inlineCode(opt.name)} => ${opt.description}`)
                .join('\n'),
            },
          ]);
        }

        if (
          cmd.options.some(
            (option) =>
              option.type !== ApplicationCommandOptionType.SubcommandGroup &&
              option.type !== ApplicationCommandOptionType.Subcommand,
          )
        ) {
          embed.addFields([
            {
              name: 'Command Options',
              value: cmd.options
                .filter(
                  (option) =>
                    option.type !==
                      ApplicationCommandOptionType.SubcommandGroup &&
                    option.type !== ApplicationCommandOptionType.Subcommand,
                )
                .map(
                  (opt) =>
                    `${inlineCode(
                      `${opt.name}${
                        opt.required !== undefined &&
                        opt.required.valueOf() === true
                          ? ''
                          : '?'
                      }`,
                    )} => ${opt.description}`,
                )
                .join('\n'),
            },
          ]);
        }

        if (cmd.options.some((option) => option.choices !== undefined)) {
          embed.addFields([
            {
              name: 'Command Option Choices',
              value: cmd.options
                .filter((option) => option.choices !== undefined)
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

        if (cmd.options.some((option) => option.options !== undefined)) {
          if (
            cmd.options.some(
              (option) =>
                option.type === ApplicationCommandOptionType.SubcommandGroup,
            )
          ) {
            embed.addFields([
              {
                name: 'Subcommand Group Subcommands',
                value: cmd.options
                  .filter(
                    (option) =>
                      option.type ===
                      ApplicationCommandOptionType.SubcommandGroup,
                  )
                  .flatMap(
                    (option) =>
                      `${bold(`• ${option.name}`)}\n${option.options
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
                value: cmd.options
                  .filter(
                    (option) =>
                      option.type ===
                      ApplicationCommandOptionType.SubcommandGroup,
                  )
                  .map((option) =>
                    option.options
                      .filter((opt) => opt.options.length)
                      .map(
                        (opt) =>
                          `${bold(
                            `• ${option.name} ${opt.name}`,
                          )}\n${opt.options
                            .map(
                              (o) =>
                                `${inlineCode(
                                  `${o.name}${
                                    o.required !== undefined &&
                                    o.required.valueOf() === true
                                      ? ''
                                      : '?'
                                  }`,
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

          embed.addFields([
            {
              name: 'Subcommand Options',
              value: cmd.options
                .filter((option) => option.options.length)
                .filter(
                  (option) =>
                    option.type === ApplicationCommandOptionType.Subcommand,
                )
                .flatMap(
                  (option) =>
                    `${bold(`• ${option.name}`)}\n${option.options
                      .map(
                        (opt) =>
                          `${inlineCode(
                            `${opt.name}${
                              opt.required !== undefined &&
                              opt.required.valueOf() === true
                                ? ''
                                : '?'
                            }`,
                          )} => ${opt.description}`,
                      )
                      .join('\n')}`,
                )
                .join('\n\n'),
            },
          ]);

          if (
            cmd.options.some((option) =>
              option.options.some((opt) => opt.choices !== undefined),
            )
          ) {
            embed.addFields([
              {
                name: 'Subcommand Option Choices',
                value: cmd.options
                  .filter((option) => option.options !== undefined)
                  .map((option) =>
                    option.options
                      .filter((opt) => opt.choices !== undefined)
                      .map(
                        (opt) =>
                          `${bold(
                            `• ${option.name} ${opt.name}`,
                          )}\n${opt.choices
                            .map((choice) => choice.name)
                            .join('\n')}`,
                      )
                      .join('\n\n'),
                  )
                  .join('\n\n'),
              },
            ]);
          }
        }
      }

      await interaction.editReply({ embeds: [embed] });
    });
  },
};
