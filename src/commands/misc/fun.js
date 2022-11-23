const AnimeImages = require('anime-images-api');
const axios = require('axios');
const { snakeCase } = require('change-case');
const {
  EmbedBuilder,
  italic,
  SlashCommandBuilder,
  inlineCode,
} = require('discord.js');
const nekoClient = require('nekos.life');

const { waifuChoices } = require('../../constants');
const { generateAttachmentFromBuffer } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fun')
    .setDescription('🎉 Fun command.')
    .addSubcommand((subcommand) =>
      subcommand.setName('ahegao').setDescription('🚫 Send a ahegao image.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('boobs').setDescription('🚫 Send a boobs gif.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('cuddle')
        .setDescription('😍 Send a cuddling image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to cuddle.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('danbooru')
        .setDescription('🖼️ Send a random image from Danbooru.')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('🔠 The image search query.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('feed')
        .setDescription('🧑‍🍼 Send a feeding image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to feed.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('hentai').setDescription('🚫 Send a hentai gif.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('hug')
        .setDescription('🤗 Send a hugging image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to hug.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kemono')
        .setDescription('😻 Send a kemono image/gif.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kill')
        .setDescription('⚰️ Send a killing gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to kill.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kiss')
        .setDescription('😘 Send a kissing image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to kiss.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('lesbian').setDescription('🚫 Send a lesbian gif.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('pat')
        .setDescription('🖐️ Send a patting image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to pat.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('punch')
        .setDescription('👊 Send a punching gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to punch.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('slap')
        .setDescription('🤚 Send a slapping image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to slap.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('smug')
        .setDescription('😏 Send a smugging image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to smug.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tickle')
        .setDescription('👉 Send a tickle image/gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to tickle.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('waifu')
        .setDescription('👰‍♀️ Send a waifu image/gif.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🖼️ The image type to send.')
            .setRequired(true)
            .addChoices(...waifuChoices),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('wink')
        .setDescription('😉 Send a winking gif.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('👤 The target member to wink.')
            .setRequired(true),
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

    if (!guild) return;

    if (!member) {
      await interaction.deferReply({ ephemeral: true });

      return interaction.editReply({ content: "Member doesn't exist." });
    }

    /** @type {{ channels: { cache: import('discord.js').Collection<String, import('discord.js').BaseGuildTextChannel> } */
    const {
      channels: { cache: baseGuildTextChannels },
    } = guild;

    const NSFWChannels = baseGuildTextChannels.filter((ch) => ch.nsfw);
    const NSFWResponse = NSFWChannels.size
      ? `\n${italic('eg.')} ${[...NSFWChannels.values()].join(', ')}`
      : '';

    const embed = new EmbedBuilder().setTimestamp(Date.now()).setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ dynamic: true }),
    });

    /** @type {?import('discord.js').GuildMember} */
    const target = options.getMember('target');
    const images = new AnimeImages();
    const neko = new nekoClient();

    switch (options.getSubcommand()) {
      case 'hug': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.hug();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.hug();
        const imgArr = [url, image];
        const hug = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(hug)
          .setDescription(`${member} has hugged ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'kiss': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.kiss();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.kiss();
        const imgArr = [url, image];
        const kiss = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(kiss)
          .setDescription(`${member} is kissing ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'slap': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.slap();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.slap();
        const imgArr = [url, image];
        const slap = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(slap)
          .setDescription(`${member} has slapped ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'punch': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.punch();

        embed
          .setColor(target.displayHexColor)
          .setImage(image)
          .setDescription(`${member} has punched ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'wink': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.wink();

        embed
          .setColor(target.displayHexColor)
          .setImage(image)
          .setDescription(`${member} is giving a wink for ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'pat': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.pat();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.pat();
        const imgArr = [url, image];
        const pat = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(pat)
          .setDescription(`${member} is giving a pat for ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'kill': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.kill();

        embed
          .setColor(target.displayHexColor)
          .setImage(image)
          .setDescription(`${target} has been killed by ${member}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'cuddle': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.cuddle();

        /** @type {{ image: String }} */
        const { image } = await images.sfw.cuddle();
        const imgArr = [url, image];
        const cuddle = imgArr[Math.floor(Math.random() * imgArr.length)];

        embed
          .setColor(target.displayHexColor)
          .setImage(cuddle)
          .setDescription(`${member} cuddles ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'tickle':
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        return interaction.deferReply().then(
          async () =>
            await neko.tickle().then(async ({ url }) => {
              embed.setColor(target.displayHexColor);
              embed.setImage(url);
              embed.setDescription(`${member} tickled ${target}!`);

              await interaction.editReply({ embeds: [embed] });
            }),
        );

      case 'feed': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.feed();

        embed
          .setColor(target.displayHexColor)
          .setImage(url)
          .setDescription(`${member} feeding ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'kemono': {
        const endpoints = ['neko', 'nekoGif', 'foxGirl'];

        await interaction.deferReply();

        /** @type {{ url: String }} */
        const { url } = await neko[
          endpoints[Math.floor(Math.random() * endpoints.length)]
        ]();

        embed.setColor(guild.members.me?.displayHexColor ?? null).setImage(url);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'smug': {
        if (!target) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Member doesn't exist." });
        }

        await interaction.deferReply();

        const { url } = await neko.smug();

        embed
          .setColor(target.displayHexColor)
          .setImage(url)
          .setDescription(`${member} smugged ${target}!`);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'waifu':
        {
          const type = options.getString('type', true);

          embed.setColor(member.displayHexColor);

          await interaction.deferReply();

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

      case 'hentai': {
        if (!channel) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Channel doesn't exist." });
        }

        if (!channel.nsfw) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `Please use this command in a NSFW Channel.${NSFWResponse}`,
          });
        }

        await interaction.deferReply();

        /** @type {{ image: String }} */
        const { image } = await images.nsfw.hentai();

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(image);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'boobs': {
        if (!channel) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Channel doesn't exist." });
        }

        if (!channel.nsfw) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `Please use this command in a NSFW Channel.${NSFWResponse}`,
          });
        }

        await interaction.deferReply();

        const { image } = await images.nsfw.boobs();

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(image);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'lesbian': {
        if (!channel) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Channel doesn't exist." });
        }

        if (!channel.nsfw) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `Please use this command in a NSFW Channel.${NSFWResponse}`,
          });
        }

        await interaction.deferReply();

        const { image } = await images.nsfw.lesbian();

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(image);

        return interaction.editReply({ embeds: [embed] });
      }

      case 'ahegao': {
        if (!channel) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Channel doesn't exist." });
        }

        if (!channel.nsfw) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `Please use this command in a NSFW Channel.${NSFWResponse}`,
          });
        }

        await interaction.deferReply();

        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/nsfw/ahegao?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const { attachment: img, ext } = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'ahegao',
          fileDesc: 'Ahegao Image',
        });

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(`attachment://${img.name}.${ext}`);

        return interaction.editReply({ embeds: [embed], files: [img] });
      }

      case 'danbooru': {
        const query = options.getString('query', true);

        if (!channel) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({ content: "Channel doesn't exist." });
        }

        if (!channel.nsfw) {
          await interaction.deferReply({ ephemeral: true });

          return interaction.editReply({
            content: `Please use this command in a NSFW Channel.${NSFWResponse}`,
          });
        }

        await interaction.deferReply();

        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios
          .get(
            `https://api.lolhuman.xyz/api/danbooru?query=${snakeCase(
              query,
            )}&apikey=${process.env.LOLHUMAN_API_KEY}`,
            { responseType: 'arraybuffer' },
          )
          .catch(() => {
            throw `No image found with query ${inlineCode(query)}.`;
          });

        const { attachment: img, ext } = await generateAttachmentFromBuffer({
          buffer,
          fileName: snakeCase(query),
          fileDesc: 'Danbooru Image',
        });

        embed
          .setColor(guild.members.me?.displayHexColor ?? null)
          .setImage(`attachment://${img.name}.${ext}`);

        return interaction.editReply({ embeds: [embed], files: [img] });
      }
    }
  },
};
