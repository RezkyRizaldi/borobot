const {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const fs = require('fs');
const shortUrl = require('node-url-shortener');
const QRCode = require('qrcode');

const { isValidURL } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('🏭 Generator command.')
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
      .setColor(guild.members.me.displayHexColor)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      });

    switch (options.getSubcommand()) {
      case 'shortenurl': {
        const url = options.getString('url');

        if (!isValidURL(url)) {
          return interaction.deferReply({ ephemeral: true }).then(
            async () =>
              await interaction.editReply({
                content: 'Please provide a valid URL.',
              }),
          );
        }

        return shortUrl.short(url, async (err, shortURL) => {
          if (err) {
            console.error(err);

            return interaction
              .deferReply({ ephemeral: true })
              .then(async () => await interaction.editReply({ content: err }));
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
        });
      }

      case 'qrcode': {
        const content = options.getString('content');

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
