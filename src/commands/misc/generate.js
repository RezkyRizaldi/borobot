const AnimeImages = require('anime-images-api');
const axios = require('axios');
const { EmbedBuilder, italic, SlashCommandBuilder } = require('discord.js');
const {
  Blur,
  Greyscale,
  Invert,
  Sepia,
  Triggered,
} = require('discord-image-generation');
const fs = require('fs');
const nekoClient = require('nekos.life');
const QRCode = require('qrcode');

const { waifuChoices } = require('../../constants');
const { isValidURL, generateAttachmentFromBuffer } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('🏭 Generator command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('ahegao')
        .setDescription('🚫 Generate a random ahegao image.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('boobs')
        .setDescription('🚫 Generate a random boobs gif.'),
    )
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
        .setName('hentai')
        .setDescription('🚫 Generate a random hentai gif.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kemono')
        .setDescription('😻 Generate a random kemono image/gif.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lesbian')
        .setDescription('🚫 Generate a random lesbian gif.'),
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('waifu')
        .setDescription('👰‍♀️ Generate a waifu image/gif.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🖼️ The image type to generate.')
            .setRequired(true)
            .addChoices(...waifuChoices),
        ),
    ),

  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, client: import('discord.js').Client<true>, guild: ?import('discord.js').Guild, member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { channel, client, guild, member, options } = interaction;

    await interaction.deferReply();

    if (!member) throw "Member doesn't exist.";

    /** @type {{ channels: { cache: import('discord.js').Collection<String, import('discord.js').BaseGuildTextChannel> } */
    const {
      channels: { cache: baseGuildTextChannels },
    } = guild;

    const NSFWChannels = baseGuildTextChannels.filter((ch) => ch.nsfw);
    const NSFWResponse = NSFWChannels.size
      ? `\n${italic('eg.')} ${[...NSFWChannels.values()].join(', ')}`
      : '';

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    const images = new AnimeImages();
    const neko = new nekoClient();

    switch (options.getSubcommandGroup()) {
      case 'filters':
        {
          const image = options.getAttachment('image', true);

          embed.setAuthor({ name: '🖼️ Applied Filter Result' });

          switch (options.getSubcommand()) {
            case 'blur': {
              const amount = options.getInteger('amount') ?? undefined;

              const img = await generateAttachmentFromBuffer({
                buffer: await new Blur().getImage(image.url, amount),
                fileName: 'blur',
                fileDesc: 'Blurred Image',
              });

              embed.setImage(`attachment://${img.name}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'greyscale': {
              const img = await generateAttachmentFromBuffer({
                buffer: await new Greyscale().getImage(image.url),
                fileName: 'greyscale',
                fileDesc: 'Greyscaled image',
              });

              embed.setImage(`attachment://${img.name}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'invert': {
              const img = await generateAttachmentFromBuffer({
                buffer: await new Invert().getImage(image.url),
                fileName: 'invert',
                fileDesc: 'Invertd image',
              });

              embed.setImage(`attachment://${img.name}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'sepia': {
              const img = await generateAttachmentFromBuffer({
                buffer: await new Sepia().getImage(image.url),
                fileName: 'sepia',
                fileDesc: 'Sepia Image',
              });

              embed.setImage(`attachment://${img.name}`);

              return interaction.editReply({ embeds: [embed], files: [img] });
            }

            case 'triggered': {
              const img = await generateAttachmentFromBuffer({
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
      case 'ahegao': {
        if (!channel) throw "Channel doesn't exist.";

        if (!channel.nsfw) {
          throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
        }

        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/nsfw/ahegao?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'ahegao',
          fileDesc: 'Ahegao Image',
        });

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(`attachment://${img.name}`);

        return interaction.editReply({ embeds: [embed], files: [img] });
      }

      case 'boobs': {
        if (!channel) throw "Channel doesn't exist.";

        if (!channel.nsfw) {
          throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
        }

        const { image } = await images.nsfw.boobs();

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(image);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'hentai': {
        if (!channel) throw "Channel doesn't exist.";

        if (!channel.nsfw) {
          throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
        }

        /** @type {{ image: String }} */
        const { image } = await images.nsfw.hentai();

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(image);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'kemono': {
        const endpoints = ['neko', 'nekoGif', 'foxGirl'];

        /** @type {{ url: String }} */
        const { url } = await neko[
          endpoints[Math.floor(Math.random() * endpoints.length)]
        ]();

        embed.setColor(guild.members.me?.displayHexColor ?? null).setImage(url);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'lesbian': {
        if (!channel) throw "Channel doesn't exist.";

        if (!channel.nsfw) {
          throw `Please use this command in a NSFW Channel.${NSFWResponse}`;
        }

        const { image } = await images.nsfw.lesbian();

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(image);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'shortlink': {
        const url = options.getString('url', true);

        if (!isValidURL(url)) throw 'Please provide a valid URL.';

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

        const url = await QRCode.toDataURL(content, { version: 10 });

        const buffer = Buffer.from(url.split(';base64,').pop(), 'base64');
        const imagePath = './src/assets/images/qrcode.png';

        fs.writeFileSync(imagePath, buffer, { encoding: 'base64' });

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'qrcode',
          fileDesc: 'QR Code',
        });

        embed
          .setAuthor({ name: '🖼️ QR Code Result' })
          .setDescription("Here's your generated QR Code.")
          .setImage(`attachment://${img.name}`);

        await interaction.editReply({ embeds: [embed], files: [img] });

        return fs.unlinkSync(imagePath);
      }

      case 'waifu':
        {
          const type = options.getString('type', true);

          embed.setColor(member.displayHexColor);

          switch (type) {
            case 'image': {
              /** @type {{ data: { url: String } }} */
              const {
                data: { url },
              } = await axios.get('https://api.waifu.pics/sfw/waifu');

              embed
                .setAuthor({
                  name: `${member.user.username} Got a Waifu`,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setImage(url);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'pfp': {
              const { url } = await neko.avatar();

              /** @type {{ image: String }} */
              const { image } = await images.sfw.waifu();
              const imgArr = [url, image];
              const pfp = imgArr[Math.floor(Math.random() * imgArr.length)];

              embed.setAuthor({
                name: `${member.user.username} Got a Waifu`,
                iconURL: member.displayAvatarURL({ dynamic: true }),
              });
              embed.setImage(pfp);

              return interaction.editReply({ embeds: [embed] });
            }

            case 'wallpaper': {
              const { url } = await neko.wallpaper();

              embed
                .setAuthor({
                  name: `${member.user.username} Got a Waifu`,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setImage(url);

              return interaction.editReply({ embeds: [embed] });
            }
          }
        }
        break;
    }
  },
};
