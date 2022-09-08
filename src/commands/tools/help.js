const {
  ActionRowBuilder,
  bold,
  ComponentType,
  EmbedBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  SlashCommandBuilder,
} = require('discord.js');

const { applyPermission } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('ℹ️ Show information about a command.'),
  type: 'Select Menu',

  /**
   *
   * @param {import('discord.js').SelectMenuInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ client: { commandArray: { name: String, description: String, type: Number, default_member_permissions: bigint }[] }}} */
    const {
      client: { commandArray: commands },
    } = interaction;

    const options = commands
      .map(({ name, description }) => ({
        name,
        description: description !== undefined ? description : 'No description',
      }))
      .filter(({ name }) => name !== 'help');

    /**
     *
     * @param {Boolean} state
     * @returns {ActionRowBuilder[]} Array of Action Row components.
     */
    const menu = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('help')
          .setPlaceholder('- Select Command -')
          .setDisabled(state)
          .setOptions(
            options.map((cmd) =>
              new SelectMenuOptionBuilder()
                .setLabel(cmd.name)
                .setDescription(cmd.description)
                .setValue(cmd.name.toLowerCase()),
            ),
          ),
      ),
    ];

    const initialMessage = await interaction
      .deferReply({ fetchReply: true })
      .then(
        async () =>
          await interaction
            .editReply({ components: menu(false) })
            .then((message) => message),
      );

    /**
     *
     * @param {import('discord.js').SelectMenuInteraction} inter
     * @returns {Boolean} Boolean value of the filtered interaction.
     */
    const filter = (inter) => inter.customId === 'help';
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.SelectMenu,
      idle: 15000,
    });

    collector.on('collect', async (inter) => {
      const [name] = inter.values;

      const command = commands.find((cmd) => cmd.name.toLowerCase() === name);

      const botColor = await inter.guild.members
        .fetch(inter.client.user.id)
        .then((res) => res.displayHexColor)
        .catch((err) => console.error(err));

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${inter.client.user.username} Commands`,
          iconURL: inter.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`Information about the ${bold(`/${name}`)} command.`)
        .setColor(botColor || 0xfcc9b9)
        .setFooter({
          text: inter.client.user.username,
          iconURL: inter.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp(Date.now())
        .setFields([
          {
            name: 'Command Type',
            value: command.type !== undefined ? 'Context Menu' : 'Slash',
          },
        ]);

      if (command.options !== undefined) {
        embed.addFields(
          command.options.map((opt) => ({
            name: `${opt.name} ${
              opt.required !== undefined && opt.required.valueOf() === true
                ? '(required)'
                : ''
            }`,
            value: opt.description,
            inline: true,
          })),
        );

        if (command.options.some((option) => option.choices !== undefined)) {
          embed.addFields(
            command.options
              .filter((option) => option.choices !== undefined)
              .map((option) => ({
                name: `${option.name} choices`,
                value: option.choices.map((choice) => choice.name).join('\n'),
              })),
          );
        }

        if (command.options.some((option) => option.options !== undefined)) {
          embed.addFields(
            command.options
              .filter((option) => option.options !== undefined)
              .flatMap((option) =>
                option.options.map((opt) => ({
                  name: `${opt.name} ${
                    opt.required !== undefined &&
                    opt.required.valueOf() === true
                      ? '(required)'
                      : ''
                  } [${option.name}]`,
                  value: opt.description,
                  inline: true,
                })),
              ),
          );

          if (
            command.options.some((option) =>
              option.options.some((opt) => opt.choices !== undefined),
            )
          ) {
            embed.addFields(
              command.options
                .filter((option) => option.options !== undefined)
                .flatMap((option) =>
                  option.options.filter((opt) => opt.choices !== undefined),
                )
                .map((option) => ({
                  name: `${option.name} choices`,
                  value: option.choices.map((choice) => choice.name).join('\n'),
                })),
            );
          }
        }
      }

      if (command.default_member_permissions !== undefined) {
        embed.addFields([
          {
            name: 'Permission',
            value: applyPermission(command.default_member_permissions),
          },
        ]);
      }

      await initialMessage.edit({ embeds: [embed] });
    });

    collector.on('end', async () => {
      await initialMessage
        .edit({ components: menu(true) })
        .then((message) =>
          setTimeout(async () => await message.delete(), 10000),
        );
    });
  },
};
