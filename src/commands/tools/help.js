const {
  ApplicationCommandOptionType,
  bold,
  EmbedBuilder,
  inlineCode,
  italic,
  SlashCommandBuilder,
} = require('discord.js');
const { Pagination } = require('pagination.djs');

const { applyPermission } = require('../../utils');

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
    /** @type {{ client: { commandArray: { name: String, description: String|undefined, type: Number|undefined, default_member_permissions: bigint|undefined, options: import('discord.js').ApplicationCommandChoicesOption[] }[] }}} */
    const {
      client: { commandArray: commands },
    } = interaction;

    const command = interaction.options.getString('command');

    await interaction.deferReply({ ephemeral: true }).then(async () => {
      const cmds = commands
        .filter(({ name }) => name !== 'help')
        .map(
          ({
            name,
            description,
            type,
            default_member_permissions,
            options,
          }) => ({
            name,
            description: description ?? 'No description.',
            type,
            permissions: default_member_permissions,
            options,
          }),
        );

      if (command) {
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
            name: `${interaction.client.user.username} Commands`,
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setDescription(
            `Information about the ${bold(
              cmd.type !== undefined ? cmd.name : `/${cmd.name}`,
            )} command.`,
          )
          .setColor(interaction.guild.members.me.displayHexColor)
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setTimestamp(Date.now())
          .setFields([
            {
              name: 'Command Type',
              value:
                cmd.type !== undefined
                  ? 'Context Menu Command'
                  : 'Slash Command',
              inline: true,
            },
            {
              name: 'Command Permissions',
              value: applyPermission(cmd.permissions) ?? italic('None'),
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
              (option) =>
                option.type === ApplicationCommandOptionType.Subcommand,
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

        return interaction.editReply({ embeds: [embed] });
      }

      const pagination = new Pagination(interaction, {
        limit: 5,
      });

      pagination.setColor(interaction.guild.members.me.displayHexColor);
      pagination.setTimestamp(Date.now());
      pagination.setFooter({
        text: `${interaction.client.user.username} | Page {pageNumber} of {totalPages}`,
        iconURL: interaction.client.user.displayAvatarURL({
          dynamic: true,
        }),
      });
      pagination.setAuthor({
        name: `${interaction.client.user.username} Commands (${cmds.length})`,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });
      pagination.setFields(
        cmds.map((option) => ({
          name: option.type !== undefined ? option.name : `/${option.name}`,
          value: `${option.description}\nPermissions: ${
            applyPermission(option.permissions) ?? italic('None')
          }`,
        })),
      );
      pagination.paginateFields();

      await pagination.render();
    });
  },
};
