const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const {
  Blur,
  Greyscale,
  Invert,
  Sepia,
  Triggered,
} = require('discord-image-generation');
const fs = require('fs');
const QRCode = require('qrcode');

const { isValidURL, generateAttachmentFromBuffer } = require('../../utils');

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
        .setName('shortlink')
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
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    switch (options.getSubcommandGroup()) {
      case 'filters':
        {
          const image = options.getAttachment('image', true);

          embed.setAuthor({ name: '🖼️ Applied Filter Result' });

          await interaction.deferReply();

          switch (options.getSubcommand()) {
            case 'blur': {
              const amount = options.getInteger('amount') ?? undefined;

              const { attachment: img, ext } =
                await generateAttachmentFromBuffer({
                  buffer: await new Blur().getImage(image.url, amount),
                  fileName: 'blur',
                  fileDesc: 'Blurred Image',
                });

              embed.setImage(`attachment://${img.name}.${ext}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'greyscale': {
              const { attachment: img, ext } =
                await generateAttachmentFromBuffer({
                  buffer: await new Greyscale().getImage(image.url),
                  fileName: 'greyscale',
                  fileDesc: 'Greyscaled image',
                });

              embed.setImage(`attachment://${img.name}.${ext}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'invert': {
              const { attachment: img, ext } =
                await generateAttachmentFromBuffer({
                  buffer: await new Invert().getImage(image.url),
                  fileName: 'invert',
                  fileDesc: 'Invertd image',
                });

              embed.setImage(`attachment://${img.name}.${ext}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'sepia': {
              const { attachment: img, ext } =
                await generateAttachmentFromBuffer({
                  buffer: await new Sepia().getImage(image.url),
                  fileName: 'sepia',
                  fileDesc: 'Sepia Image',
                });

              embed.setImage(`attachment://${img.name}.${ext}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'triggered': {
              const { attachment: img } = await generateAttachmentFromBuffer({
                buffer: await new Triggered().getImage(image.url),
                fileName: 'sepia',
                fileDesc: 'Sepia Image',
              });

              embed.setImage(`attachment://${img.name}.gif`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }
          }
        }
        break;
    }

    switch (options.getSubcommand()) {
      case 'shortlink': {
        const url = options.getString('url', true);

        if (!isValidURL(url)) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: 'Please provide a valid URL.',
          });
        }

        await interaction.deferReply();

        /** @type {{ data: { result: String } }} */
        const {
          data: { result },
        } = await axios.get(
          `https://api.lolhuman.xyz/api/shortlink?url=${url}&apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🔗 Shortened URL Result' })
          .setDescription(`Here's your generated shorten URL: ${result}.`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'qrcode': {
        const content = options.getString('content', true);

        await interaction.deferReply();

        const url = await QRCode.toDataURL(content, { version: 10 });

        const buffer = Buffer.from(url.split(';base64,').pop(), 'base64');
        const imagePath = './src/assets/images/qrcode.png';

        fs.writeFileSync(imagePath, buffer, { encoding: 'base64' });

        const { attachment: img } = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'qrcode',
          fileDesc: 'QR Code',
        });

        embed
          .setAuthor({ name: '🖼️ QR Code Result' })
          .setDescription("Here's your generated QR Code.")
          .setImage(`attachment://${img.name}.png`);

        await interaction.editReply({ embeds: [embed], files: [img] });

        return fs.unlinkSync(imagePath);
      }
    }
  },
};
