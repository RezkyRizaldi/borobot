const {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const {
  Blur,
  Greyscale,
  Invert,
  Sepia,
  Triggered,
} = require('discord-image-generation');
const fs = require('fs');
const shortUrl = require('node-url-shortener');
const QRCode = require('qrcode');

const { isValidURL } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('🏭 Generator command.')
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('filters')
        .setDescription('🖼️ Generate a filter for an image.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('blur')
            .setDescription('🖼️ Apply the blur filter to the image.')
            .addAttachmentOption((option) =>
              option
                .setName('image')
                .setDescription('🖼️ The image to be applied.')
                .setRequired(true),
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('🔢 The amount of blurness.')
                .setMinValue(0)
                .setMaxValue(100),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('greyscale')
            .setDescription('🖼️ Apply the greyscale filter to the image.')
            .addAttachmentOption((option) =>
              option
                .setName('image')
                .setDescription('🖼️ The image to be applied.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('invert')
            .setDescription('🖼️ Apply the invert filter to the image.')
            .addAttachmentOption((option) =>
              option
                .setName('image')
                .setDescription('🖼️ The image to be applied.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('sepia')
            .setDescription('🖼️ Apply the sepia filter to the image.')
            .addAttachmentOption((option) =>
              option
                .setName('image')
                .setDescription('🖼️ The image to be applied.')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('triggered')
            .setDescription('🖼️ Apply the triggered filter to the image.')
            .addAttachmentOption((option) =>
              option
                .setName('image')
                .setDescription('🖼️ The image to be applied.')
                .setRequired(true),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('shortenurl')
        .setDescription('🔗 Generate a shortened URL.')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('🔗 The url to shorten.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('qrcode')
        .setDescription('🔗 Generate a QR Code.')
        .addStringOption((option) =>
          option
            .setName('content')
            .setDescription('🔗 The content to be transformed.')
            .setRequired(true),
        ),
    ),

  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommandGroup()) {
      case 'filters':
        {
          const image = options.getAttachment('image', true);

          embed.setAuthor({
            name: '🖼️ Applied Filter Result',
          });

          switch (options.getSubcommand()) {
            case 'blur': {
              const amount = options.getInteger('amount') ?? undefined;

              return interaction.deferReply().then(
                async () =>
                  await new Blur()
                    .getImage(image.url, amount)
                    .then(async (buffer) => {
                      const file = new AttachmentBuilder(buffer, {
                        name: 'blur.png',
                        description: 'Blurred image',
                      });

                      embed.setImage('attachment://blur.png');

                      await interaction.editReply({
                        embeds: [embed],
                        files: [file],
                      });
                    }),
              );
            }

            case 'greyscale':
              return interaction.deferReply().then(
                async () =>
                  await new Greyscale()
                    .getImage(image.url)
                    .then(async (buffer) => {
                      const file = new AttachmentBuilder(buffer, {
                        name: 'greyscale.png',
                        description: 'Greyscaled image',
                      });

                      embed.setImage('attachment://greyscale.png');

                      await interaction.editReply({
                        embeds: [embed],
                        files: [file],
                      });
                    }),
              );

            case 'invert':
              return interaction.deferReply().then(
                async () =>
                  await new Invert()
                    .getImage(image.url)
                    .then(async (buffer) => {
                      const file = new AttachmentBuilder(buffer, {
                        name: 'invert.png',
                        description: 'Inverted image',
                      });

                      embed.setImage('attachment://invert.png');

                      await interaction.editReply({
                        embeds: [embed],
                        files: [file],
                      });
                    }),
              );

            case 'sepia':
              return interaction.deferReply().then(
                async () =>
                  await new Sepia().getImage(image.url).then(async (buffer) => {
                    const file = new AttachmentBuilder(buffer, {
                      name: 'sepia.png',
                      description: 'Sepia image',
                    });

                    embed.setImage('attachment://sepia.png');

                    await interaction.editReply({
                      embeds: [embed],
                      files: [file],
                    });
                  }),
              );

            case 'triggered':
              return interaction.deferReply().then(
                async () =>
                  await new Triggered()
                    .getImage(image.url)
                    .then(async (buffer) => {
                      const file = new AttachmentBuilder(buffer, {
                        name: 'triggered.gif',
                        description: 'Triggered image',
                      });

                      embed.setImage('attachment://triggered.gif');

                      await interaction.editReply({
                        embeds: [embed],
                        files: [file],
                      });
                    }),
              );
          }
        }
        break;
    }

    switch (options.getSubcommand()) {
      case 'shortenurl': {
        const url = options.getString('url', true);

        if (!isValidURL(url)) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid URL.',
              }),
          );
        }

        return shortUrl.short(
          url,
          /**
           *
           * @param {any} err
           * @param {String} shortURL
           */
          async (err, shortURL) => {
            if (err) {
              console.error(err);

              return interaction
                .deferReply({ ephemeral: true })
                .then(
                  async () => await interaction.editReply({ content: err }),
                );
            }

            embed.setAuthor({
              name: '🔗 Shortened URL Result',
            });
            embed.setDescription(
              `Here's your generated shorten URL: ${shortURL}.`,
            );

            await interaction.deferReply().then(
              async () =>
                await interaction.editReply({
                  embeds: [embed],
                }),
            );
          },
        );
      }

      case 'qrcode': {
        const content = options.getString('content', true);

        return QRCode.toDataURL(content, { version: 10 })
          .then(async (url) => {
            const image = Buffer.from(url.split(';base64,').pop(), 'base64');
            const imagePath = './src/assets/images/qrcode.png';

            fs.writeFileSync(imagePath, image, {
              encoding: 'base64',
            });

            const file = new AttachmentBuilder(imagePath, {
              name: 'qrcode.png',
              description: 'QR Code',
            });

            await interaction.deferReply().then(async () => {
              embed.setAuthor({
                name: '🖼️ QR Code Result',
              });
              embed.setDescription("Here's your generated QR Code.");
              embed.setImage('attachment://qrcode.png');

              await interaction
                .editReply({ embeds: [embed], files: [file] })
                .then(() => fs.unlinkSync(imagePath));
            });
          })
          .catch(async (err) => {
            console.error(err);

            await interaction
              .deferReply({ ephemeral: true })
              .then(async () => await interaction.editReply({ content: err }));
          });
      }
    }
  },
};
